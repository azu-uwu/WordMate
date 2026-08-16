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

/**
 * Lấy danh sách tất cả Custom Question cho Admin
 * Hỗ trợ lọc theo vocabulary_id
 * @param {number|null} vocabularyId - ID Vocabulary (tùy chọn)
 */
const getAllForAdmin = async (vocabularyId = null) => {
    let sql = "SELECT * FROM quiz_custom_questions";
    const params = [];

    if (vocabularyId !== null && vocabularyId !== undefined) {
        sql += " WHERE vocabulary_id = ?";
        params.push(vocabularyId);
    }

    sql += " ORDER BY id ASC";

    const [rows] = await pool.execute(sql, params);
    return rows;
};

/**
 * Lấy Custom Question theo id cho Admin (trả về tất cả cột)
 * @param {number} id - ID Custom Question
 */
const findByIdForAdmin = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM quiz_custom_questions WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

/**
 * Tạo mới Custom Question
 * @param {object} data - { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }
 * @returns {object} Kết quả insert
 */
const create = async ({ vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }) => {
    const [result] = await pool.execute(
        `INSERT INTO quiz_custom_questions (vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active]
    );
    return result;
};

/**
 * Cập nhật Custom Question theo id
 * @param {number} id - ID Custom Question
 * @param {object} data - { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }
 * @returns {object} Kết quả update
 */
const update = async (id, { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }) => {
    const [result] = await pool.execute(
        `UPDATE quiz_custom_questions
         SET vocabulary_id = ?,
             question = ?,
             option_a = ?,
             option_b = ?,
             option_c = ?,
             option_d = ?,
             correct_option = ?,
             is_active = ?
         WHERE id = ?`,
        [vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active, id]
    );
    return result;
};

/**
 * Xóa Custom Question theo id
 * @param {number} id - ID Custom Question
 * @returns {object} Kết quả delete
 */
const remove = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM quiz_custom_questions WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getActiveByVocabularyIds,
    findById,
    getAllForAdmin,
    findByIdForAdmin,
    create,
    update,
    remove
};
