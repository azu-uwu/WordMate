const express = require("express");
const router = express.Router();

const aiController = require("../controllers/aiController");
const authMiddleware = require("../middleware/authMiddleware");

// POST tạo conversation mới (yêu cầu đăng nhập)
router.post("/conversations", authMiddleware, aiController.createConversation);

// GET danh sách conversation gần nhất của user hiện tại (yêu cầu đăng nhập)
router.get("/conversations", authMiddleware, aiController.getConversations);

// POST chat với AI Assistant (yêu cầu đăng nhập)
router.post("/chat", authMiddleware, aiController.chat);

module.exports = router;