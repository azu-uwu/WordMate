const express = require("express");
const router = express.Router();

const userController = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");
const { uploadImage } = require("../../config/upload");

// Middleware xử lý lỗi upload (file quá lớn, định dạng sai)
const handleUploadError = (err, req, res, next) => {
    if (err) {
        if (err.code === "LIMIT_FILE_SIZE") {
            return res.status(400).json({
                success: false,
                message: "File vượt quá dung lượng cho phép"
            });
        }
        // File filter error (sai định dạng)
        return res.status(400).json({
            success: false,
            message: err.message || "Định dạng file không hợp lệ"
        });
    }
    next();
};

// GET profile (requires auth)
router.get("/profile", authMiddleware, userController.getProfile);

// PUT update profile (requires auth) - hỗ trợ upload avatar (multipart/form-data, field: avatar)
router.put("/profile", authMiddleware, uploadImage.single("avatar"), handleUploadError, userController.updateProfile);

// PUT update roadmap (requires auth)
router.put("/profile/roadmap", authMiddleware, userController.updateRoadmap);

module.exports = router;