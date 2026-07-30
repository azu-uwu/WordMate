const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

console.log("authRoutes.js loaded");

// GET test
router.get("/test", (req, res) => {
    res.json({
        success: true,
        message: "Auth Route OK"
    });
});

// POST register
router.post("/register", authController.register);
router.post("/login", authController.login);
// console.log(authController);

// PUT change password (requires auth)
router.put("/change-password", authMiddleware, authController.changePassword);

module.exports = router;
