const express = require("express");
const router = express.Router();

const topicController = require("../controllers/topicController");
const authMiddleware = require("../middleware/authMiddleware");

// GET danh sách Topic theo roadmap_id (yêu cầu đăng nhập), lấy theo roadmap, ko lquan đến user
router.get("/", authMiddleware, topicController.getByRoadmap);

// GET danh sách Topic mà user hiện tại thực sự có vocabulary (learning/mastered)
router.get("/user", authMiddleware, topicController.getUserTopics);

console.log("topicRoutes.js loaded");

module.exports = router;