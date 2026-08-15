const Quiz = require("../models/quizModel");
const UserVocabulary = require("../models/userVocabularyModel");
const Vocabulary = require("../models/vocabularyModel");
const CustomQuestion = require("../models/customQuestionModel");
const srsService = require("../services/srsService");
const { updateStudyStreak } = require("../models/userModel");

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
 * Lấy 4 lựa chọn của Custom Question theo thứ tự CỐ ĐỊNH:
 * A = option_a, B = option_b, C = option_c, D = option_d.
 * KHÔNG shuffle options của Custom Question.
 */
function buildCustomOptions(customQuestion) {
    return [
        customQuestion.option_a,
        customQuestion.option_b,
        customQuestion.option_c,
        customQuestion.option_d
    ];
}

/**
 * Lấy đáp án đúng của Custom Question theo correct_option.
 * correct_option = 'C' luôn có nghĩa là option_c.
 */
function getCustomCorrectAnswer(customQuestion) {
    const optionMap = {
        A: customQuestion.option_a,
        B: customQuestion.option_b,
        C: customQuestion.option_c,
        D: customQuestion.option_d
    };
    return optionMap[customQuestion.correct_option];
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

        // 4. Sinh câu hỏi Auto + lựa chọn cho từng vocabulary (giữ nguyên logic hiện tại)
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

        // 4b. Lấy tất cả Custom Question active của các vocabulary đã chọn.
        // Mỗi vocabulary có Custom Question active sẽ có thêm 1 câu hỏi Custom độc lập
        // bên cạnh câu hỏi Auto. KHÔNG loại bỏ duplicate vocabulary giữa Auto và Custom.
        const selectedVocabularyIds = selectedVocabularies.map(
            (v) => v.vocabulary_id
        );
        const customQuestions = await CustomQuestion.getActiveByVocabularyIds(
            selectedVocabularyIds
        );

        // Custom Question KHÔNG dùng buildOptions(), KHÔNG shuffle options.
        // Thứ tự luôn cố định: A = option_a, B = option_b, C = option_c, D = option_d.
        for (const customQuestion of customQuestions) {
            const vocabulary = selectedVocabularies.find(
                (v) => v.vocabulary_id === customQuestion.vocabulary_id
            );
            if (!vocabulary) continue;

            generated.push({
                vocabulary,
                questionType: "CUSTOM",
                customQuestion,
                options: buildCustomOptions(customQuestion)
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

        // 4c. Shuffle thứ tự các câu hỏi trong Quiz (Auto + Custom trộn lẫn).
        // Options của Auto vẫn được shuffle bởi buildOptions(), options của Custom giữ nguyên.
        const shuffledQuestions = shuffle(generated);

        // 5. Tạo quiz attempt
        const attemptResult = await Quiz.createAttempt(userId);
        const attemptId = attemptResult.insertId;

        // 6. Tạo quiz_questions và chuẩn bị response
        const questions = [];
        let questionOrder = 1;

        for (const item of shuffledQuestions) {
            const questionResult = await Quiz.createQuestion({
                quizAttemptId: attemptId,
                vocabularyId: item.vocabulary.vocabulary_id,
                questionType: item.questionType,
                questionOrder,
                customQuestionId: item.customQuestion ? item.customQuestion.id : null
            });

            questions.push({
                id: questionResult.insertId,
                vocabulary_id: item.vocabulary.vocabulary_id,
                question_type: item.questionType,
                question: item.questionType === "CUSTOM"
                    ? item.customQuestion.question
                    : buildQuestionText(item.vocabulary, item.questionType),
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

/**
 * API Trả lời Quiz
 * POST /api/quiz/answer
 * Body: { attemptId: number, questionId: number, userAnswer: string }
 * Không nhận isCorrect hoặc correctAnswer từ Frontend.
 */
const answerQuestion = async (req, res) => {
    try {
        const userId = req.user.id;
        const { attemptId, questionId, userAnswer } = req.body;

        // 1. Validate required fields
        if (attemptId === undefined || attemptId === null || attemptId === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu attemptId"
            });
        }
        if (questionId === undefined || questionId === null || questionId === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu questionId"
            });
        }
        if (userAnswer === undefined || userAnswer === null || userAnswer === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu userAnswer"
            });
        }

        // 2. Validate types
        if (!Number.isInteger(attemptId) || attemptId <= 0) {
            return res.status(400).json({
                success: false,
                message: "attemptId không hợp lệ"
            });
        }
        if (!Number.isInteger(questionId) || questionId <= 0) {
            return res.status(400).json({
                success: false,
                message: "questionId không hợp lệ"
            });
        }
        if (typeof userAnswer !== "string") {
            return res.status(400).json({
                success: false,
                message: "userAnswer phải là chuỗi"
            });
        }

        // 3. Kiểm tra quiz_attempt tồn tại và thuộc người dùng hiện tại
        const attempt = await Quiz.getAttemptById(attemptId);
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz không tồn tại"
            });
        }
        if (attempt.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Quiz không thuộc về người dùng hiện tại"
            });
        }

        // 4. Kiểm tra question thuộc quiz_attempt đó
        const questions = await Quiz.getQuestionsByAttemptId(attemptId);
        const question = questions.find((q) => q.id === questionId);
        if (!question) {
            return res.status(404).json({
                success: false,
                message: "Câu hỏi không tồn tại hoặc không thuộc Quiz này"
            });
        }

        // 5. Kiểm tra câu hỏi đã được trả lời trước đó chưa.
        // Phân biệt theo question_id (không theo vocabulary_id) vì cùng một vocabulary
        // có thể xuất hiện 2 lần: 1 Auto Question + 1 Custom Question (2 câu hỏi độc lập).
        // Câu trả lời cũ (chưa có question_id — NULL hoặc column chưa tồn tại/undefined)
        // vẫn kiểm tra theo vocabulary_id cho tương thích.
        const answers = await Quiz.getAnswersByAttemptId(attemptId);
        const alreadyAnswered = answers.some((a) => {
            const isLegacyAnswer =
                a.question_id === null || a.question_id === undefined;
            return (
                (isLegacyAnswer &&
                    a.vocabulary_id === question.vocabulary_id) ||
                (!isLegacyAnswer && a.question_id === question.id)
            );
        });
        if (alreadyAnswered) {
            return res.status(409).json({
                success: false,
                message: "Câu hỏi này đã được trả lời trước đó"
            });
        }

        // 6. Lấy vocabulary tương ứng (cần cho cả Auto và Custom để cập nhật SRS)
        const vocabulary = await Vocabulary.findById(question.vocabulary_id);
        if (!vocabulary) {
            return res.status(404).json({
                success: false,
                message: "Từ vựng không tồn tại"
            });
        }

        // 7. Xác định đáp án đúng dựa trên question_type
        let correctAnswer;
        let isCorrect = false;

        if (question.question_type === "CUSTOM") {
            // Custom Question: đáp án đúng là option tương ứng với correct_option.
            // correct_option = 'C' luôn có nghĩa là option_c (không shuffle).
            if (!question.custom_question_id) {
                return res.status(400).json({
                    success: false,
                    message: "Câu hỏi Custom không hợp lệ"
                });
            }
            const customQuestion = await CustomQuestion.findById(
                question.custom_question_id
            );
            if (!customQuestion) {
                return res.status(404).json({
                    success: false,
                    message: "Câu hỏi Custom không tồn tại"
                });
            }
            correctAnswer = getCustomCorrectAnswer(customQuestion);

            // 8. So sánh userAnswer với đáp án đúng.
            // Hỗ trợ cả 2 dạng: userAnswer là giá trị option (ví dụ 'Three')
            // hoặc userAnswer là ký tự option (ví dụ 'C').
            const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
            const normalizedCorrectOption = String(
                customQuestion.correct_option
            ).trim().toLowerCase();
            const normalizedCorrectAnswer = String(correctAnswer)
                .trim()
                .toLowerCase();

            isCorrect =
                normalizedUserAnswer === normalizedCorrectOption ||
                normalizedUserAnswer === normalizedCorrectAnswer;
        } else {
            correctAnswer = getCorrectAnswerValue(vocabulary, question.question_type);

            // 8. So sánh userAnswer với đáp án đúng (logic Auto giữ nguyên)
            const normalizedUserAnswer = String(userAnswer).trim().toLowerCase();
            const normalizedCorrectAnswer = String(correctAnswer).trim().toLowerCase();
            isCorrect = normalizedUserAnswer === normalizedCorrectAnswer;
        }

        // 9. Lưu câu trả lời vào quiz_answers.
        // Lưu question_id để phân biệt câu hỏi đã trả lời (Auto/Custom cùng vocabulary độc lập).
        await Quiz.createAnswer({
            quizAttemptId: attemptId,
            questionId: question.id,
            vocabularyId: question.vocabulary_id,
            userAnswer: String(userAnswer).trim(),
            correctAnswer: String(correctAnswer),
            isCorrect: isCorrect ? 1 : 0
        });

        // 10. Cập nhật SRS theo logic M4-T6 (chỉ khi người dùng thực sự trả lời)
        const existingRecord = await UserVocabulary.findByUserAndVocab(userId, question.vocabulary_id);
        const currentReviewCount = existingRecord ? existingRecord.review_count : 0;

        const srsResult = isCorrect
            ? srsService.handleCorrectAnswer(currentReviewCount)
            : srsService.handleWrongAnswer();

        const now = new Date();
        const newStatus = srsResult.reviewCount >= 5
            ? "mastered"
            : "learning";
        await UserVocabulary.upsert(userId, question.vocabulary_id, {
            status: newStatus,
            review_count: srsResult.reviewCount,
            next_review_at: srsResult.nextReviewAt,
            last_reviewed_at: now
        });

        // 11. Trả về kết quả
        return res.status(200).json({
            success: true,
            message: isCorrect ? "Chính xác!" : "Sai rồi",
            data: {
                isCorrect,
                correctAnswer: String(correctAnswer),
                review_count: srsResult.reviewCount,
                next_review_at: srsResult.nextReviewAt
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

/**
 * API Hoàn thành Quiz
 * POST /api/quiz/complete
 * Body: { attemptId: number, duration: number }
 * Không nhận score, correctAnswers hoặc totalQuestions từ Frontend.
 * Không tạo attempt mới. Không cập nhật SRS (đã xử lý ở M5-T3).
 */
const completeQuiz = async (req, res) => {
    try {
        const userId = req.user.id;
        const { attemptId, duration } = req.body;

        // 1. Validate required fields
        if (attemptId === undefined || attemptId === null || attemptId === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu attemptId"
            });
        }
        if (duration === undefined || duration === null || duration === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu duration"
            });
        }

        // 2. Validate types
        if (!Number.isInteger(attemptId) || attemptId <= 0) {
            return res.status(400).json({
                success: false,
                message: "attemptId không hợp lệ"
            });
        }
        if (!Number.isInteger(duration) || duration < 0) {
            return res.status(400).json({
                success: false,
                message: "duration không hợp lệ"
            });
        }

        // 3. Kiểm tra quiz_attempt tồn tại và thuộc người dùng hiện tại
        const attempt = await Quiz.getAttemptById(attemptId);
        if (!attempt) {
            return res.status(404).json({
                success: false,
                message: "Quiz không tồn tại"
            });
        }
        if (attempt.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Quiz không thuộc về người dùng hiện tại"
            });
        }

        // 4. Kiểm tra attempt đã được hoàn thành trước đó chưa.
        // total_questions chỉ được cập nhật khi hoàn thành Quiz (M5-T4),
        // nên total_questions > 0 nghĩa là attempt đã hoàn thành.
        if (attempt.total_questions > 0) {
            return res.status(409).json({
                success: false,
                message: "Quiz đã được hoàn thành trước đó"
            });
        }

        // 5. Lấy quiz_questions và quiz_answers của attempt
        const questions = await Quiz.getQuestionsByAttemptId(attemptId);
        const answers = await Quiz.getAnswersByAttemptId(attemptId);

        // 6. Kiểm tra tất cả câu hỏi đã được trả lời
        if (questions.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Quiz không có câu hỏi nào"
            });
        }
        if (answers.length < questions.length) {
            return res.status(400).json({
                success: false,
                message: "Chưa trả lời đủ tất cả câu hỏi"
            });
        }

        // 7. Tính kết quả dựa trên quiz_answers đã lưu (không nhận từ Frontend,
        // không tự chấm lại đáp án - sử dụng is_correct đã lưu ở M5-T3)
        const totalQuestions = questions.length;
        const correctAnswers = answers.filter(
            (a) => Number(a.is_correct) === 1
        ).length;
        const score = Math.round((correctAnswers / totalQuestions) * 10000) / 100;

        // 8. Cập nhật quiz_attempts (chỉ score, total_questions, correct_answers, duration.
        // Không cập nhật review_count, next_review_at hoặc SRS trong M5-T4)
        await Quiz.updateAttempt(attemptId, {
            score,
            totalQuestions,
            correctAnswers,
            duration
        });

        // Cập nhật streak sau khi Quiz hoàn thành thành công
        const now = new Date();
        const streak = await updateStudyStreak(userId, now);

        // 9. Trả về kết quả Quiz để Frontend hiển thị
        return res.status(200).json({
            success: true,
            message: "Hoàn thành Quiz thành công",
            data: {
                quiz_id: attemptId,
                score,
                total_questions: totalQuestions,
                correct_answers: correctAnswers,
                duration
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

/**
 * API Tiếp tục Quiz
 * GET /api/quiz/continue
 * Chỉ đọc dữ liệu. Không tạo attempt mới, không tạo câu hỏi/trả lời,
 * không cập nhật SRS (review_count, next_review_at, status) hay quiz_attempts.
 */
const continueQuiz = async (req, res) => {
    try {
        const userId = req.user.id;

        // 1. Tìm quiz_attempt chưa hoàn thành mới nhất của người dùng hiện tại
        const attempt = await Quiz.getIncompleteAttempt(userId);
        if (!attempt) {
            return res.status(200).json({
                success: true,
                message: "Không có Quiz chưa hoàn thành",
                data: {
                    hasIncompleteQuiz: false
                }
            });
        }

        // 2. Lấy tất cả câu hỏi của attempt (giữ nguyên question_order)
        const questions = await Quiz.getQuestionsByAttemptId(attempt.id);

        // 3. Lấy danh sách câu trả lời của attempt.
        // Phân biệt theo question_id (không theo vocabulary_id) vì cùng một vocabulary
        // có thể xuất hiện cả Auto và Custom (2 câu hỏi độc lập).
        const answers = await Quiz.getAnswersByAttemptId(attempt.id);
        const answeredQuestionIds = new Set(
            answers
                .filter((a) => a.question_id !== null && a.question_id !== undefined)
                .map((a) => a.question_id)
        );
        // Câu trả lời cũ (chưa có question_id — NULL hoặc undefined)
        // vẫn lọc theo vocabulary_id cho tương thích
        const answeredVocabularyIdsLegacy = new Set(
            answers
                .filter((a) => a.question_id === null || a.question_id === undefined)
                .map((a) => a.vocabulary_id)
        );

        // 4. Chỉ giữ các câu hỏi chưa được trả lời (theo question id)
        const unansweredQuestions = questions.filter(
            (q) =>
                !answeredQuestionIds.has(q.id) &&
                !answeredVocabularyIdsLegacy.has(q.vocabulary_id)
        );

        // 5. Lấy pool vocabulary của người dùng để tạo options (cùng cách M5-T2)
        const userVocabularies = await UserVocabulary.getByUser(userId);

        // 6. Xây dựng nội dung câu hỏi cho từng câu chưa trả lời.
        // Dùng đúng question_type đã lưu trong quiz_questions để không sinh lại
        // một câu hỏi khác.
        // - Auto Question: buildOptions() (options được shuffle như khi tạo Quiz).
        // - Custom Question: giữ nguyên option_a, option_b, option_c, option_d (KHÔNG shuffle).
        const questionData = [];
        for (const question of unansweredQuestions) {
            const vocabulary = await Vocabulary.findById(question.vocabulary_id);
            if (!vocabulary) continue;

            let questionText;
            let options;

            if (question.question_type === "CUSTOM") {
                if (!question.custom_question_id) continue;
                const customQuestion = await CustomQuestion.findById(
                    question.custom_question_id
                );
                if (!customQuestion) continue;

                questionText = customQuestion.question;
                options = buildCustomOptions(customQuestion);
            } else {
                options = buildOptions(vocabulary, question.question_type, userVocabularies);
                questionText = buildQuestionText(vocabulary, question.question_type);
            }

            if (!options) continue;

            questionData.push({
                id: question.id,
                vocabulary_id: question.vocabulary_id,
                question_type: question.question_type,
                question: questionText,
                options,
                question_order: question.question_order
            });
        }

        // 7. Trả về danh sách câu hỏi chưa trả lời (không trả các câu đã làm)
        return res.status(200).json({
            success: true,
            message: "Tiếp tục Quiz thành công",
            data: {
                quiz_id: attempt.id,
                total_questions: questions.length,
                remaining_questions: questionData.length,
                questions: questionData
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
    startQuiz,
    answerQuestion,
    completeQuiz,
    continueQuiz
};