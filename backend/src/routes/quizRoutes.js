const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

// Bắt đầu Quiz (yêu cầu đăng nhập)
router.post("/start", authMiddleware, quizController.startQuiz);

// Trả lời Quiz (yêu cầu đăng nhập)
router.post("/answer", authMiddleware, quizController.answerQuestion);

module.exports = router;