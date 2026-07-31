const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách Topic theo roadmap_id (yêu cầu đăng nhập)
router.get("/", authMiddleware, topicController.getByRoadmap);

module.exports = router;