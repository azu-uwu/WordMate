const Vocabulary = require("../models/vocabularyModel");
const Topic = require("../models/topicModel");
const User = require("../models/userModel");
const UserVocabulary = require("../models/userVocabularyModel");
const srsService = require("../services/srsService");

/**
 * Lấy danh sách Vocabulary theo topic_id
 * GET /api/vocabularies?topic_id={id}
 */
const getByTopic = async (req, res) => {
    try {
        const { topic_id } = req.query;

        // Validate required topic_id
        if (!topic_id) {
            return res.status(400).json({
                success: false,
                message: "Thiếu topic_id"
            });
        }

        // Gọi Model để lấy dữ liệu
        const vocabularies = await Vocabulary.getByTopicId(topic_id);

        return res.status(200).json({
            success: true,
            data: vocabularies
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Khởi tạo dữ liệu phiên học Flashcard
 * POST /api/learning/start
 * Body: { topic_id: number }
 * Chỉ SELECT dữ liệu, không tạo study_session
 */
const startLearning = async (req, res) => {
    try {
        const userId = req.user.id;
        const { topic_id } = req.body;

        // Validate required topic_id
        if (topic_id === undefined || topic_id === null || topic_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu topic_id"
            });
        }

        // Validate topic_id is a positive integer
        if (!Number.isInteger(topic_id) || topic_id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Topic ID không hợp lệ"
            });
        }

        // Lấy user để xác định roadmap hiện tại (từ JWT, không nhận từ request)
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        if (!user.roadmap_id) {
            return res.status(403).json({
                success: false,
                message: "Người dùng chưa chọn lộ trình học"
            });
        }

        // Kiểm tra topic tồn tại và thuộc roadmap hiện tại của user
        const topics = await Topic.getByRoadmapId(user.roadmap_id);
        const topic = topics.find(t => t.id === topic_id);

        if (!topic) {
            return res.status(404).json({
                success: false,
                message: "Topic không tồn tại hoặc không thuộc lộ trình của bạn"
            });
        }

        // Lấy toàn bộ vocabulary thuộc topic (chỉ SELECT)
        const vocabularies = await Vocabulary.getByTopicId(topic_id);

        return res.status(200).json({
            success: true,
            message: "Khởi tạo phiên học thành công",
            data: {
                topic,
                vocabularies
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Đánh dấu từ vựng đã thuộc
 * POST /api/learning/mastered
 * Body: { vocabulary_id: number }
 */
const markAsMastered = async (req, res) => {
    try {
        const userId = req.user.id;
        const { vocabulary_id } = req.body;

        // Validate required vocabulary_id
        if (vocabulary_id === undefined || vocabulary_id === null || vocabulary_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu vocabulary_id"
            });
        }

        // Validate vocabulary_id is a positive integer
        if (!Number.isInteger(vocabulary_id) || vocabulary_id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra vocabulary tồn tại
        const vocabulary = await UserVocabulary.findVocabularyById(vocabulary_id);
        if (!vocabulary) {
            return res.status(404).json({
                success: false,
                message: "Từ vựng không tồn tại"
            });
        }

        // Lấy bản ghi học tập hiện tại (nếu chưa có, coi review_count = 0)
        const existingRecord = await UserVocabulary.findByUserAndVocab(userId, vocabulary_id);
        const currentReviewCount = existingRecord ? existingRecord.review_count : 0;

        // Tính toán SRS
        const srsResult = srsService.handleCorrectAnswer(currentReviewCount);

        // Lưu dữ liệu (upsert: tạo mới nếu chưa có, cập nhật nếu đã có)
        const now = new Date();
        await UserVocabulary.upsert(userId, vocabulary_id, {
            status: "mastered",
            review_count: srsResult.reviewCount,
            next_review_at: srsResult.nextReviewAt,
            last_reviewed_at: now
        });

        return res.status(200).json({
            success: true,
            message: "Đánh dấu từ vựng đã thuộc thành công",
            data: {
                vocabulary_id,
                status: "mastered",
                review_count: srsResult.reviewCount,
                next_review_at: srsResult.nextReviewAt,
                last_reviewed_at: now
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Lấy dữ liệu luyện viết cho từ vựng hiện tại
 * POST /api/learning/writing
 * Body: { vocabulary_id: number }
 * Chỉ SELECT dữ liệu, không cập nhật bất kỳ dữ liệu học tập nào
 */
const getWritingData = async (req, res) => {
    try {
        const { vocabulary_id } = req.body;

        // Validate required vocabulary_id
        if (vocabulary_id === undefined || vocabulary_id === null || vocabulary_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu vocabulary_id"
            });
        }

        // Validate vocabulary_id is a positive integer
        if (!Number.isInteger(vocabulary_id) || vocabulary_id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra vocabulary tồn tại và lấy dữ liệu
        const vocabulary = await Vocabulary.findById(vocabulary_id);
        if (!vocabulary) {
            return res.status(404).json({
                success: false,
                message: "Từ vựng không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Lấy dữ liệu luyện viết thành công",
            data: {
                word: vocabulary.word,
                meaning: vocabulary.meaning,
                example: vocabulary.example,
                example_meaning: vocabulary.example_meaning
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = {
    getByTopic,
    startLearning,
    markAsMastered,
    getWritingData
};
