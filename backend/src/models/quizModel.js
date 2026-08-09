const pool = require("../../config/db");

/**
 * Tạo mới một quiz_attempt cho người dùng.
 * Trả về result (chứa insertId) để lấy ID của attempt vừa tạo.
 */
const createAttempt = async (userId) => {
    const [result] = await pool.execute(
        "INSERT INTO quiz_attempts (user_id) VALUES (?)",
        [userId]
    );
    return result;
};

/**
 * Lưu một câu trả lời vào quiz_answers.
 * Chỉ lưu giá trị isCorrect được truyền vào, không tự chấm đáp án.
 */
const createAnswer = async ({ quizAttemptId, vocabularyId, userAnswer, correctAnswer, isCorrect }) => {
    const [result] = await pool.execute(
        "INSERT INTO quiz_answers (quiz_attempt_id, vocabulary_id, user_answer, correct_answer, is_correct) VALUES (?, ?, ?, ?, ?)",
        [quizAttemptId, vocabularyId, userAnswer, correctAnswer, isCorrect]
    );
    return result;
};

/**
 * Cập nhật kết quả của một quiz_attempt.
 */
const updateAttempt = async (attemptId, { score, totalQuestions, correctAnswers }) => {
    const [result] = await pool.execute(
        "UPDATE quiz_attempts SET score = ?, total_questions = ?, correct_answers = ? WHERE id = ?",
        [score, totalQuestions, correctAnswers, attemptId]
    );
    return result;
};

/**
 * Lấy thông tin một quiz_attempt theo ID.
 */
const getAttemptById = async (attemptId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_attempts WHERE id = ?",
        [attemptId]
    );
    return rows[0] || null;
};

/**
 * Lấy danh sách câu trả lời của một quiz_attempt.
 */
const getAnswersByAttemptId = async (attemptId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_answers WHERE quiz_attempt_id = ?",
        [attemptId]
    );
    return rows;
};

/**
 * Lấy quiz_attempt chưa hoàn thành của người dùng.
 * Dựa trên schema hiện tại: attempt chưa hoàn thành là attempt có total_questions = 0
 * (chưa được cập nhật kết quả qua updateAttempt).
 */
const getIncompleteAttempt = async (userId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_attempts WHERE user_id = ? AND total_questions = 0 ORDER BY created_at DESC LIMIT 1",
        [userId]
    );
    return rows[0] || null;
};

module.exports = {
    createAttempt,
    createAnswer,
    updateAttempt,
    getAttemptById,
    getAnswersByAttemptId,
    getIncompleteAttempt,
};