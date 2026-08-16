const express = require("express");
const multer = require("multer");
const router = express.Router();

const adminController = require("../controllers/adminController");
const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");
const { uploadImage, uploadAudio } = require("../../config/upload");

// Upload CSV cho import vocabulary (lưu vào memory, không ghi file)
const uploadCsv = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB
});

// Tất cả route admin đều yêu cầu xác thực và role admin
router.use(authMiddleware);
router.use(adminMiddleware);

// Middleware xử lý lỗi multer (file quá lớn, định dạng sai)
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

// CRUD Roadmaps
router.get("/roadmaps", adminController.getAllRoadmaps);
router.post("/roadmaps", adminController.createRoadmap);
router.put("/roadmaps/:id", adminController.updateRoadmap);
router.delete("/roadmaps/:id", adminController.deleteRoadmap);

// Upload image cho Roadmap
router.post("/roadmaps/:id/image", uploadImage.single("image"), handleUploadError, adminController.uploadRoadmapImage);

/**
 * CRUD Topics
 */
router.get("/topics", adminController.getAllTopics);
router.post("/topics", adminController.createTopic);
router.put("/topics/:id", adminController.updateTopic);
router.delete("/topics/:id", adminController.deleteTopic);

// Upload image cho Topic
router.post("/topics/:id/image", uploadImage.single("image"), handleUploadError, adminController.uploadTopicImage);

// Hỗ trợ lọc: GET /topics?roadmap_id=:roadmapId
// Query params roadmap_id sẽ được truyền qua req.query và sử dụng trong getAllTopics

/**
 * CRUD Vocabularies
 */
router.get("/vocabularies", adminController.getAllVocabularies);
router.post("/vocabularies", adminController.createVocabulary);
router.put("/vocabularies/:id", adminController.updateVocabulary);
router.delete("/vocabularies/:id", adminController.deleteVocabulary);

// Import Vocabulary hàng loạt từ file CSV
router.post("/vocabularies/import", uploadCsv.single("file"), handleUploadError, adminController.importVocabularies);

// Upload image cho Vocabulary
router.post("/vocabularies/:id/image", uploadImage.single("image"), handleUploadError, adminController.uploadVocabularyImage);

// Upload audio cho Vocabulary
router.post("/vocabularies/:id/audio", uploadAudio.single("audio"), handleUploadError, adminController.uploadVocabularyAudio);

// Hỗ trợ lọc: GET /vocabularies?topic_id=:topicId
// Query params topic_id sẽ được truyền qua req.query và sử dụng trong getAllVocabularies

/**
 * CRUD Custom Questions
 */
router.get("/custom-questions", adminController.getAllCustomQuestions);
router.get("/custom-questions/:id", adminController.getCustomQuestionById);
router.post("/custom-questions", adminController.createCustomQuestion);
router.put("/custom-questions/:id", adminController.updateCustomQuestion);
router.delete("/custom-questions/:id", adminController.deleteCustomQuestion);

// Hỗ trợ lọc: GET /custom-questions?vocabulary_id=:vocabularyId
// Query params vocabulary_id sẽ được truyền qua req.query và sử dụng trong getAllCustomQuestions

module.exports = router;
