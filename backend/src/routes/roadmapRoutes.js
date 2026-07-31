const express = require("express");
const router = express.Router();

const roadmapController = require("../controllers/roadmapController");

// GET danh sách tất cả Roadmap đang hoạt động
router.get("/", roadmapController.getAll);

module.exports = router;