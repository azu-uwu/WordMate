const express = require("express");
const router = express.Router();

const notebookController = require("../controllers/notebookController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách sổ tay từ vựng của user hiện tại (yêu cầu đăng nhập)
// Query params: search, topic_id, status, page, limit
router.get("/", authMiddleware, notebookController.getNotebook);

// POST đưa từ đã thuộc (mastered) về luyện tập (learning) (yêu cầu đăng nhập)
// Params: vocabulary_id
router.post("/review/:vocabulary_id", authMiddleware, notebookController.reviewVocabulary);

module.exports = router;
