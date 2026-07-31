const express = require("express");
const router = express.Router();

const vocabularyController = require("../controllers/vocabularyController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách Vocabulary theo topic_id (yêu cầu đăng nhập)
router.get("/", authMiddleware, vocabularyController.getByTopic);

module.exports = router;