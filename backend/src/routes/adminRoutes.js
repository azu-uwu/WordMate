const express = require("express");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Tất cả route admin đều yêu cầu xác thực và role admin
router.use(authMiddleware);
router.use(adminMiddleware);

// CRUD Roadmaps
router.get("/roadmaps", adminController.getAllRoadmaps);
router.post("/roadmaps", adminController.createRoadmap);
router.put("/roadmaps/:id", adminController.updateRoadmap);
router.delete("/roadmaps/:id", adminController.deleteRoadmap);

module.exports = router;