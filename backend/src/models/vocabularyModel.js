const pool = require("../../config/db");

/**
 * Lấy danh sách Vocabulary theo topic_id
 * Chỉ lấy các cột cần thiết cho Flashcard
 */
const getByTopicId = async (topicId) => {
    const [rows] = await pool.execute(
        `SELECT 
            id, 
            word, 
            pronunciation, 
            audio, 
            image, 
            part_of_speech, 
            meaning, 
            example, 
            example_meaning 
        FROM vocabularies 
        WHERE topic_id = ?`,
        [topicId]
    );
    return rows;
};

/**
 * Lấy Vocabulary theo id
 * Chỉ lấy các cột cần thiết cho Writing Exercise
 */
const findById = async (id) => {
    const [rows] = await pool.execute(
        `SELECT 
            id, 
            word, 
            meaning, 
            example, 
            example_meaning 
        FROM vocabularies 
        WHERE id = ?`,
        [id]
    );
    return rows[0] || null;
};

/**
 * Lấy tất cả Vocabulary cho Admin
 * Hỗ trợ lọc theo topic_id
 * @param {number|null} topicId - ID Topic (tùy chọn)
 */
const getAllForAdmin = async (topicId = null) => {
    let sql = "SELECT * FROM vocabularies";
    const params = [];

    if (topicId !== null && topicId !== undefined) {
        sql += " WHERE topic_id = ?";
        params.push(topicId);
    }

    sql += " ORDER BY id ASC";

    const [rows] = await pool.execute(sql, params);
    return rows;
};

/**
 * Lấy Vocabulary theo id cho Admin (trả về tất cả cột)
 * @param {number} id - ID Vocabulary
 */
const findByIdForAdmin = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM vocabularies WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

/**
 * Kiểm tra từ vựng đã tồn tại trong Topic chưa (dựa trên unique index topic_id + word)
 * @param {number} topicId - ID Topic
 * @param {string} word - Từ vựng (đã trim)
 * @param {number} [exceptId] - ID Vocabulary cần loại trừ (cho cập nhật)
 */
const findByTopicAndWord = async (topicId, word, exceptId = null) => {
    if (exceptId) {
        const [rows] = await pool.execute(
            "SELECT id, word FROM vocabularies WHERE topic_id = ? AND word = ? AND id <> ?",
            [topicId, word, exceptId]
        );
        return rows[0] || null;
    }
    const [rows] = await pool.execute(
        "SELECT id, word FROM vocabularies WHERE topic_id = ? AND word = ?",
        [topicId, word]
    );
    return rows[0] || null;
};

/**
 * Tạo mới Vocabulary
 * @param {object} data - { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }
 * @returns {object} Kết quả insert
 */
const create = async ({ topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }) => {
    const [result] = await pool.execute(
        `INSERT INTO vocabularies (topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image]
    );
    return result;
};

/**
 * Cập nhật Vocabulary theo id
 * @param {number} id - ID Vocabulary
 * @param {object} data - { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }
 * @returns {object} Kết quả update
 */
const update = async (id, { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }) => {
    const [result] = await pool.execute(
        `UPDATE vocabularies
         SET topic_id = ?, word = ?, pronunciation = ?, part_of_speech = ?, meaning = ?, example = ?, example_meaning = ?, audio = ?, image = ?
         WHERE id = ?`,
        [topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image, id]
    );
    return result;
};

/**
 * Cập nhật image cho Vocabulary theo id
 * @param {number} id - ID Vocabulary
 * @param {string} imagePath - Đường dẫn file ảnh
 */
const updateImage = async (id, imagePath) => {
    const [result] = await pool.execute(
        "UPDATE vocabularies SET image = ? WHERE id = ?",
        [imagePath, id]
    );
    return result;
};

/**
 * Cập nhật audio cho Vocabulary theo id
 * @param {number} id - ID Vocabulary
 * @param {string} audioPath - Đường dẫn file âm thanh
 */
const updateAudio = async (id, audioPath) => {
    const [result] = await pool.execute(
        "UPDATE vocabularies SET audio = ? WHERE id = ?",
        [audioPath, id]
    );
    return result;
};

/**
 * Xóa Vocabulary theo id
 * @param {number} id - ID Vocabulary
 * @returns {object} Kết quả delete
 */
const remove = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM vocabularies WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getByTopicId,
    findById,
    getAllForAdmin,
    findByIdForAdmin,
    findByTopicAndWord,
    create,
    update,
    updateImage,
    updateAudio,
    remove
};
