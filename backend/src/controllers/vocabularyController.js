const Vocabulary = require("../models/vocabularyModel");
const Topic = require("../models/topicModel");
const User = require("../models/userModel");

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

module.exports = {
    getByTopic,
    startLearning
};
