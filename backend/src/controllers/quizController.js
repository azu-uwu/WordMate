const Quiz = require("../models/quizModel");
const UserVocabulary = require("../models/userVocabularyModel");

const MAX_QUESTIONS = 20;

/**
 * Xáo trộn mảng (Fisher-Yates shuffle)
 */
function shuffle(array) {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

/**
 * Escape regex special characters
 */
function escapeRegExp(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Kiểm tra vocabulary có đủ điều kiện ôn tập:
 * status IN ('new', 'learning') HOẶC next_review_at <= NOW()
 */
function isEligible(uv, now) {
    if (uv.status === "new" || uv.status === "learning") return true;
    if (uv.next_review_at) {
        return new Date(uv.next_review_at) <= now;
    }
    return false;
}

/**
 * Kiểm tra vocabulary đã đến hạn review (ưu tiên cao).
 * Từ chưa có next_review_at (từ mới) được coi là đến hạn.
 */
function isDue(uv, now) {
    if (!uv.next_review_at) return true;
    return new Date(uv.next_review_at) <= now;
}

/**
 * Áp dụng Quiz Generation Rules:
 * - Tối đa 20 vocabulary.
 * - Ưu tiên vocabulary đã đến hạn review.
 * - Trong cùng mức ưu tiên, ưu tiên review_count thấp hơn.
 */
function selectVocabularies(vocabularies) {
    const now = new Date();
    const eligible = vocabularies.filter((uv) => isEligible(uv, now));

    eligible.sort((a, b) => {
        const aDue = isDue(a, now) ? 0 : 1;
        const bDue = isDue(b, now) ? 0 : 1;
        if (aDue !== bDue) return aDue - bDue;
        return (a.review_count || 0) - (b.review_count || 0);
    });

    return eligible.slice(0, MAX_QUESTIONS);
}

/**
 * Kiểm tra vocabulary có thể dùng để tạo câu FILL_IN_BLANK:
 * có example hợp lệ và chứa từ cần học (word) dưới dạng từ độc lập.
 */
function canFillBlank(vocabulary) {
    if (!vocabulary.example || !vocabulary.word) return false;
    const word = String(vocabulary.word);
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i");
    return regex.test(String(vocabulary.example));
}

/**
 * Tạo câu FILL_IN_BLANK: thay từ cần học trong example bằng chỗ trống.
 */
function buildFillBlankQuestion(vocabulary) {
    const word = String(vocabulary.word);
    const regex = new RegExp(`\\b${escapeRegExp(word)}\\b`, "i");
    return String(vocabulary.example).replace(regex, "______");
}

/**
 * Chọn ngẫu nhiên loại câu hỏi cho vocabulary.
 * FILL_IN_BLANK chỉ được chọn khi example hợp lệ và có thể thay thế từ.
 */
function pickQuestionType(vocabulary) {
    const types = ["WORD_TO_MEANING", "MEANING_TO_WORD"];
    if (canFillBlank(vocabulary)) {
        types.push("FILL_IN_BLANK");
    }
    return types[Math.floor(Math.random() * types.length)];
}

/**
 * Lấy giá trị đáp án đúng của câu hỏi theo loại câu hỏi.
 */
function getCorrectAnswerValue(vocabulary, questionType) {
    return questionType === "WORD_TO_MEANING"
        ? vocabulary.meaning
        : vocabulary.word;
}

/**
 * Lấy giá trị đáp án của một vocabulary dùng làm lựa chọn theo loại câu hỏi.
 */
function getAnswerValue(vocabulary, questionType) {
    return questionType === "WORD_TO_MEANING"
        ? vocabulary.meaning
        : vocabulary.word;
}

/**
 * Tạo câu hỏi text theo loại câu hỏi và vocabulary.
 */
function buildQuestionText(vocabulary, questionType) {
    if (questionType === "WORD_TO_MEANING") {
        return `What does "${vocabulary.word}" mean?`;
    }
    if (questionType === "MEANING_TO_WORD") {
        return `Which English word means "${vocabulary.meaning}"?`;
    }
    return buildFillBlankQuestion(vocabulary);
}

/**
 * Tạo 4 lựa chọn (1 đáp án đúng + 3 đáp án sai) từ pool vocabulary của người dùng.
 * Không dùng chính đáp án đúng làm distractor, 4 lựa chọn không trùng nhau.
 * Trả về null nếu không đủ 3 đáp án sai hợp lệ (xử lý an toàn).
 */
function buildOptions(vocabulary, questionType, pool) {
    const correctValue = getCorrectAnswerValue(vocabulary, questionType);
    const used = new Set([String(correctValue).toLowerCase()]);
    const distractors = [];

    // Xáo trộn pool để chọn distractor ngẫu nhiên
    const shuffledPool = shuffle(pool);

    for (const v of shuffledPool) {
        if (v.vocabulary_id === vocabulary.vocabulary_id) continue;
        const value = getAnswerValue(v, questionType);
        if (!value) continue;

        const key = String(value).toLowerCase();
        if (used.has(key)) continue;

        used.add(key);
        distractors.push(value);

        if (distractors.length >= 3) break;
    }

    if (distractors.length < 3) return null;

    // Trả về 4 lựa chọn đã xáo trộn thứ tự
    return shuffle([correctValue, ...distractors]);
}

/**
 * API Bắt đầu Quiz
 * POST /api/quiz/start
 */
const startQuiz = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Kiểm tra người dùng có quiz_attempt chưa hoàn thành hay không
        const incompleteAttempt = await Quiz.getIncompleteAttempt(userId);
        if (incompleteAttempt) {
            return res.status(409).json({
                success: false,
                message: "Bạn đang có bài Quiz chưa hoàn thành. Hãy tiếp tục bài Quiz trước đó.",
                data: {
                    hasIncompleteQuiz: true,
                    quiz_id: incompleteAttempt.id
                }
            });
        }

        // 2. Lấy vocabulary của chính người dùng
        const userVocabularies = await UserVocabulary.getByUser(userId);

        // 3. Chọn vocabulary cần ôn theo Quiz Generation Rules
        const selectedVocabularies = selectVocabularies(userVocabularies);

        // Không có vocabulary phù hợp -> không tạo quiz_attempt
        if (selectedVocabularies.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Chưa có từ vựng cần ôn tập, hãy học từ mới!",
                data: {
                    hasQuestions: false
                }
            });
        }

        // 4. Sinh câu hỏi + 4 lựa chọn cho từng vocabulary
        const generated = [];
        for (const vocabulary of selectedVocabularies) {
            const questionType = pickQuestionType(vocabulary);
            const options = buildOptions(vocabulary, questionType, userVocabularies);

            // Không đủ 3 đáp án sai hợp lệ -> bỏ qua an toàn, không tạo câu hỏi trùng/sai cấu trúc
            if (!options) continue;

            generated.push({
                vocabulary,
                questionType,
                options
            });
        }

        // Không tạo được câu hỏi nào -> không tạo quiz_attempt
        if (generated.length === 0) {
            return res.status(200).json({
                success: false,
                message: "Không đủ dữ liệu để tạo câu hỏi Quiz.",
                data: {
                    hasQuestions: false
                }
            });
        }

        // 5. Tạo quiz attempt
        const attemptResult = await Quiz.createAttempt(userId);
        const attemptId = attemptResult.insertId;

        // 6. Tạo quiz_questions và chuẩn bị response
        const questions = [];
        let questionOrder = 1;

        for (const item of generated) {
            const questionResult = await Quiz.createQuestion({
                quizAttemptId: attemptId,
                vocabularyId: item.vocabulary.vocabulary_id,
                questionType: item.questionType,
                questionOrder
            });

            questions.push({
                id: questionResult.insertId,
                vocabulary_id: item.vocabulary.vocabulary_id,
                question_type: item.questionType,
                question: buildQuestionText(item.vocabulary, item.questionType),
                options: item.options
            });

            questionOrder++;
        }

        // 7. Trả về thông tin Quiz và danh sách câu hỏi (không trả correct_answer)
        return res.status(201).json({
            success: true,
            message: "Bắt đầu Quiz thành công",
            data: {
                quiz_id: attemptId,
                total_questions: questions.length,
                questions
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = {
    startQuiz
};