const express = require("express");
const router = express.Router();

const quizController = require("../controllers/quizController");
const authMiddleware = require("../middleware/authMiddleware");

// Bắt đầu Quiz (yêu cầu đăng nhập)
router.post("/start", authMiddleware, quizController.startQuiz);

// Trả lời Quiz (yêu cầu đăng nhập)
router.post("/answer", authMiddleware, quizController.answerQuestion);

// Hoàn thành Quiz (yêu cầu đăng nhập)
router.post("/complete", authMiddleware, quizController.completeQuiz);

// Tiếp tục Quiz (yêu cầu đăng nhập)
router.get("/continue", authMiddleware, quizController.continueQuiz);

module.exports = router;
