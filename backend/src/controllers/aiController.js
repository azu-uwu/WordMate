const AI = require("../models/aiModel");
const aiService = require("../services/aiService");

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

/**
 * API Lấy lịch sử message của một conversation
 * GET /api/ai/conversations/:conversationId/messages
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Kiểm tra conversation tồn tại và thuộc user hiện tại
 * - Trả về danh sách message theo thứ tự thời gian từ cũ đến mới
 * - Không cho phép xem message của conversation thuộc user khác
 */
const getConversationMessages = async (req, res) => {
    try {
        const userId = req.user.id;
        const conversationId = Number(req.params.conversationId);

        const conversation = await AI.getConversationById(conversationId);
        if (!conversation) {
            return res.status(404).json({
                success: false,
                message: "Conversation không tồn tại"
            });
        }

        if (conversation.user_id !== userId) {
            return res.status(403).json({
                success: false,
                message: "Không có quyền truy cập conversation này"
            });
        }

        const messages = await AI.getMessagesByConversation(conversationId);

        return res.status(200).json({
            success: true,
            data: messages
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
 * API Chat với AI Assistant
 * POST /api/ai/chat
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Nhận message, conversation_id (optional), context (optional) từ req.body
 * - Gọi aiService.chat() để xử lý logic AI/out-of-scope/lưu tin nhắn
 * - Không gọi Gemini trực tiếp, không xử lý logic AI trong Controller
 */
const chat = async (req, res) => {
    try {
        const userId = req.user.id;
        const { message, conversation_id, context } = req.body;

        // Gọi AI Service xử lý chat (service tự tạo conversation nếu cần,
        // tự xử lý out-of-scope và lưu tin nhắn)
        const result = await aiService.chat({
            userId,
            message,
            conversationId: conversation_id,
            context
        });

        return res.status(200).json({
            success: true,
            data: result
        });
    } catch (err) {
        console.error(err);
        const status = err.status || 500;
        const message = err.message || "Lỗi máy chủ";
        return res.status(status).json({
            success: false,
            message
        });
    }
};

module.exports = {
    createConversation,
    getConversations,
    getConversationMessages,
    chat
};