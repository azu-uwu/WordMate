const pool = require("../../config/db");

/**
 * Tạo mới một conversation cho user.
 *
 * @param {number} userId - ID người dùng
 * @returns {Promise<object>} Kết quả INSERT (chứa insertId)
 */
const createConversation = async (userId) => {
    const [result] = await pool.execute(
        "INSERT INTO ai_conversations (user_id) VALUES (?)",
        [userId]
    );
    return result;
};

/**
 * Lấy danh sách conversation gần nhất của user theo limit.
 * Chỉ lấy conversation thuộc đúng user được truyền vào.
 *
 * @param {number} userId - ID người dùng
 * @param {number} limit - Số lượng conversation tối đa cần lấy
 * @returns {Promise<object[]>} Danh sách conversation
 */
const getConversationsByUser = async (userId, limit) => {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 20;

    const [rows] = await pool.query(
        `SELECT id, user_id, title, created_at, updated_at
         FROM ai_conversations
         WHERE user_id = ?
         ORDER BY updated_at DESC, id DESC
         LIMIT ?`,
        [userId, safeLimit]
    );
    return rows;
};

/**
 * Tạo mới một message trong conversation.
 *
 * @param {object} data - { conversationId, role, content }
 * @param {number} data.conversationId - ID conversation
 * @param {string} data.role - Vai trò: 'user' hoặc 'assistant'
 * @param {string} data.content - Nội dung message
 * @returns {Promise<object>} Kết quả INSERT (chứa insertId)
 */
const createMessage = async ({ conversationId, role, content }) => {
    const [result] = await pool.execute(
        "INSERT INTO ai_messages (conversation_id, role, content) VALUES (?, ?, ?)",
        [conversationId, role, content]
    );
    return result;
};

/**
 * Lấy các message gần nhất của conversation theo limit.
 * Kết quả trả về được sắp xếp theo thứ tự thời gian tăng dần
 * để phù hợp với lịch sử hội thoại.
 *
 * @param {number} conversationId - ID conversation
 * @param {number} limit - Số lượng message tối đa cần lấy
 * @returns {Promise<object[]>} Danh sách message theo thứ tự thời gian
 */
const getMessagesByConversation = async (conversationId, limit) => {
    const safeLimit = Number.isInteger(limit) && limit > 0 ? limit : 50;

    const [rows] = await pool.query(
        `SELECT * FROM (
             SELECT id, conversation_id, role, content, created_at
             FROM ai_messages
             WHERE conversation_id = ?
             ORDER BY created_at DESC, id DESC
             LIMIT ?
         ) AS recent_messages
         ORDER BY created_at ASC, id ASC`,
        [conversationId, safeLimit]
    );
    return rows;
};

/**
 * Lấy conversation theo ID.
 * Trả về đầy đủ thông tin bao gồm user_id để tầng trên kiểm tra ownership.
 *
 * @param {number} conversationId - ID conversation
 * @returns {Promise<object|null>} Bản ghi conversation hoặc null nếu không tồn tại
 */
const getConversationById = async (conversationId) => {
    const [rows] = await pool.execute(
        "SELECT id, user_id, title, created_at, updated_at FROM ai_conversations WHERE id = ?",
        [conversationId]
    );
    return rows[0] || null;
};

module.exports = {
    createConversation,
    getConversationsByUser,
    createMessage,
    getMessagesByConversation,
    getConversationById,
};