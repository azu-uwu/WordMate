const AI = require("../models/aiModel");

/**
 * API Tạo conversation mới
 * POST /api/ai/conversations
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Không cho phép client truyền userId từ body
 * - Trả về conversation_id của conversation vừa tạo
 */
const createConversation = async (req, res) => {
    try {
        const userId = req.user.id;

        // Gọi Model để tạo conversation mới
        const result = await AI.createConversation(userId);

        return res.status(201).json({
            success: true,
            message: "Tạo conversation thành công",
            data: {
                conversation_id: result.insertId
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
 * API Lấy danh sách conversation gần nhất của user
 * GET /api/ai/conversations
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Chỉ trả về conversation thuộc user hiện tại
 * - Tối đa 5 conversation gần nhất
 * - Không xóa conversation cũ khỏi database
 */
const getConversations = async (req, res) => {
    try {
        const userId = req.user.id;

        // Gọi Model để lấy tối đa 5 conversation gần nhất của user
        const conversations = await AI.getConversationsByUser(userId, 5);

        return res.status(200).json({
            success: true,
            data: conversations
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
    createConversation,
    getConversations
};