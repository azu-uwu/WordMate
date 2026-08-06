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

module.exports = {
    getByTopicId,
    findById
};
