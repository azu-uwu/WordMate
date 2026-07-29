const express = require("express");
const router = express.Router();

const authController = require("../controllers/authController");

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
// router.post("/login", authController.login);

module.exports = router;