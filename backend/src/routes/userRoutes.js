const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

// GET profile (requires auth)
router.get("/profile", authMiddleware, userController.getProfile);

// PUT update profile (requires auth)
router.put("/profile", authMiddleware, userController.updateProfile);

// PUT update roadmap (requires auth)
router.put("/profile/roadmap", authMiddleware, userController.updateRoadmap);

module.exports = router;