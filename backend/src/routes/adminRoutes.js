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

/**
 * CRUD Topics
 */
router.get("/topics", adminController.getAllTopics);
router.post("/topics", adminController.createTopic);
router.put("/topics/:id", adminController.updateTopic);
router.delete("/topics/:id", adminController.deleteTopic);

// Hỗ trợ lọc: GET /topics?roadmap_id=:roadmapId
// Query params roadmap_id sẽ được truyền qua req.query và sử dụng trong getAllTopics

/**
 * CRUD Vocabularies
 */
router.get("/vocabularies", adminController.getAllVocabularies);
router.post("/vocabularies", adminController.createVocabulary);
router.put("/vocabularies/:id", adminController.updateVocabulary);
router.delete("/vocabularies/:id", adminController.deleteVocabulary);

// Hỗ trợ lọc: GET /vocabularies?topic_id=:topicId
// Query params topic_id sẽ được truyền qua req.query và sử dụng trong getAllVocabularies

module.exports = router;
