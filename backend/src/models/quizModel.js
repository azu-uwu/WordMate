const pool = require("../../config/db");

/**
 * Tạo mới một quiz_attempt cho người dùng
 */
const createAttempt = async (userId) => {
    const [result] = await pool.execute(
        "INSERT INTO quiz_attempts (user_id) VALUES (?)",
        [userId]
    );
    return result;
};

/**
 * Tạo mới một câu hỏi thuộc quiz attempt
 * customQuestionId: ID của quiz_custom_questions nếu là câu hỏi Custom, ngược lại null
 */
const createQuestion = async ({ quizAttemptId, vocabularyId, questionType, questionOrder, customQuestionId = null }) => {
    const [result] = await pool.execute(
        `INSERT INTO quiz_questions (quiz_attempt_id, vocabulary_id, question_type, question_order, custom_question_id)
         VALUES (?, ?, ?, ?, ?)`,
        [quizAttemptId, vocabularyId, questionType, questionOrder, customQuestionId]
    );
    return result;
};

/**
 * Lấy danh sách câu hỏi của một quiz attempt theo thứ tự
 */
const getQuestionsByAttemptId = async (attemptId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_questions WHERE quiz_attempt_id = ? ORDER BY question_order ASC",
        [attemptId]
    );
    return rows;
};

/**
 * Tạo mới một câu trả lời của người dùng trong quiz attempt
 * questionId: ID của quiz_questions tương ứng (để phân biệt Auto và Custom cùng vocabulary)
 */
const createAnswer = async ({ quizAttemptId, questionId, vocabularyId, userAnswer, correctAnswer, isCorrect }) => {
    const [result] = await pool.execute(
        `INSERT INTO quiz_answers (quiz_attempt_id, question_id, vocabulary_id, user_answer, correct_answer, is_correct)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [quizAttemptId, questionId, vocabularyId, userAnswer, correctAnswer, isCorrect]
    );
    return result;
};

/**
 * Cập nhật kết quả của quiz attempt
 */
const updateAttempt = async (attemptId, { score, totalQuestions, correctAnswers, duration }) => {
    const [result] = await pool.execute(
        `UPDATE quiz_attempts
         SET score = ?, total_questions = ?, correct_answers = ?, duration = ?
         WHERE id = ?`,
        [score, totalQuestions, correctAnswers, duration, attemptId]
    );
    return result;
};

/**
 * Lấy quiz attempt theo id
 */
const getAttemptById = async (attemptId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_attempts WHERE id = ?",
        [attemptId]
    );
    return rows[0] || null;
};

/**
 * Lấy danh sách câu trả lời của một quiz attempt
 */
const getAnswersByAttemptId = async (attemptId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_answers WHERE quiz_attempt_id = ?",
        [attemptId]
    );
    return rows;
};

/**
 * Lấy quiz attempt chưa hoàn thành mới nhất của người dùng.
 * Một attempt được coi là chưa hoàn thành khi số câu hỏi (quiz_questions)
 * lớn hơn số câu trả lời (quiz_answers) của attempt đó,
 * tức là vẫn còn câu hỏi chưa được trả lời.
 * Nếu có nhiều attempt chưa hoàn thành, lấy attempt mới nhất (created_at DESC).
 */
const getIncompleteAttempt = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT qa.*
         FROM quiz_attempts qa
         WHERE qa.user_id = ?
           AND (
               SELECT COUNT(*)
               FROM quiz_questions qq
               WHERE qq.quiz_attempt_id = qa.id
           ) > (
               SELECT COUNT(*)
               FROM quiz_answers qans
               WHERE qans.quiz_attempt_id = qa.id
           )
         ORDER BY qa.created_at DESC
         LIMIT 1`,
        [userId]
    );
    return rows[0] || null;
};

module.exports = {
    createAttempt,
    createQuestion,
    getQuestionsByAttemptId,
    createAnswer,
    updateAttempt,
    getAttemptById,
    getAnswersByAttemptId,
    getIncompleteAttempt,
};