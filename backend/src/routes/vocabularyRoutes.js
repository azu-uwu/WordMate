const express = require("express");
const router = express.Router();

const vocabularyController = require("../controllers/vocabularyController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách Vocabulary theo topic_id (yêu cầu đăng nhập)
router.get("/", authMiddleware, vocabularyController.getByTopic);

// Khởi tạo phiên học Flashcard (yêu cầu đăng nhập)
router.post("/start", authMiddleware, vocabularyController.startLearning);

console.log("vocabularyRoutes.js loaded");

router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "OK"
    });
});

module.exports = router;
