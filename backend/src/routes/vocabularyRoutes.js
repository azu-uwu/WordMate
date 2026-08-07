const express = require("express");
const router = express.Router();

const vocabularyController = require("../controllers/vocabularyController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách Vocabulary theo topic_id (yêu cầu đăng nhập)
router.get("/", authMiddleware, vocabularyController.getByTopic);

// Khởi tạo phiên học Flashcard (yêu cầu đăng nhập)
router.post("/start", authMiddleware, vocabularyController.startLearning);

// Đánh dấu từ vựng đã thuộc (yêu cầu đăng nhập)
router.post("/mastered", authMiddleware, vocabularyController.markAsMastered);

// Lấy dữ liệu luyện viết cho từ vựng hiện tại (yêu cầu đăng nhập)
router.post("/writing", authMiddleware, vocabularyController.getWritingData);

// Nộp bài luyện viết (yêu cầu đăng nhập)
router.post("/writing/submit", authMiddleware, vocabularyController.submitWriting);

console.log("vocabularyRoutes.js loaded");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "OK"
    });
});

module.exports = router;
