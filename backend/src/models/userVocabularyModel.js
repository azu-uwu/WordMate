const pool = require("../../config/db");

/**
 * Tìm bản ghi user_vocabularies theo user_id và vocabulary_id
 */
const findByUserAndVocab = async (userId, vocabularyId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM user_vocabularies WHERE user_id = ? AND vocabulary_id = ?",
        [userId, vocabularyId]
    );
    return rows[0] || null;
};

/**
 * Tạo mới nếu chưa tồn tại, cập nhật nếu đã tồn tại
 * (dựa trên UNIQUE(user_id, vocabulary_id))
 */
const upsert = async (userId, vocabularyId, data) => {
    const [result] = await pool.execute(
        `INSERT INTO user_vocabularies (user_id, vocabulary_id, status, review_count, next_review_at, last_reviewed_at)
         VALUES (?, ?, ?, ?, ?, ?)
         ON DUPLICATE KEY UPDATE
            status = VALUES(status),
            review_count = VALUES(review_count),
            next_review_at = VALUES(next_review_at),
            last_reviewed_at = VALUES(last_reviewed_at)`,
        [
            userId,
            vocabularyId,
            data.status,
            data.review_count,
            data.next_review_at,
            data.last_reviewed_at
        ]
    );
    return result;
};

/**
 * Lấy danh sách user_vocabularies theo user_id và status
 */
const getByUserAndStatus = async (userId, status) => {
    const [rows] = await pool.execute(
        "SELECT * FROM user_vocabularies WHERE user_id = ? AND status = ?",
        [userId, status]
    );
    return rows;
};

/**
 * Cập nhật thông tin học tập (chỉ status, review_count, next_review_at, last_reviewed_at)
 */
const updateStudySession = async (userId, vocabularyId, data) => {
    const [result] = await pool.execute(
        `UPDATE user_vocabularies
         SET status = ?, review_count = ?, next_review_at = ?, last_reviewed_at = ?
         WHERE user_id = ? AND vocabulary_id = ?`,
        [
            data.status,
            data.review_count,
            data.next_review_at,
            data.last_reviewed_at,
            userId,
            vocabularyId
        ]
    );
    return result;
};

module.exports = {
    findByUserAndVocab,
    upsert,
    getByUserAndStatus,
    updateStudySession,
};