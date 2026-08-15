const pool = require("../../config/db");

/**
 * Lấy danh sách Custom Question đang active theo danh sách vocabulary_id.
 * Dùng khi tạo Quiz để lấy toàn bộ Custom Question active của các từ được chọn.
 */
const getActiveByVocabularyIds = async (vocabularyIds) => {
    if (!vocabularyIds || vocabularyIds.length === 0) return [];

    const placeholders = vocabularyIds.map(() => "?").join(", ");
    const [rows] = await pool.execute(
        `SELECT
            id,
            vocabulary_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            is_active
         FROM quiz_custom_questions
         WHERE vocabulary_id IN (${placeholders})
           AND is_active = TRUE`,
        vocabularyIds
    );
    return rows;
};

/**
 * Lấy Custom Question theo id (dùng khi chấm điểm hoặc tiếp tục Quiz).
 * Không lọc is_active vì câu hỏi đã được gắn vào Quiz.
 */
const findById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT
            id,
            vocabulary_id,
            question,
            option_a,
            option_b,
            option_c,
            option_d,
            correct_option,
            is_active
         FROM quiz_custom_questions
         WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
};

module.exports = {
    getActiveByVocabularyIds,
    findById
};