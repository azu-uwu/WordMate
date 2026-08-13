const Topic = require("../models/topicModel");

/**
 * Lấy danh sách Topic theo roadmap_id
 * GET /api/topics?roadmap_id={id}
 */
const getByRoadmap = async (req, res) => {
    try {
        const { roadmap_id } = req.query;

        // Validate required roadmap_id
        if (!roadmap_id) {
            return res.status(400).json({
                success: false,
                message: "Thiếu roadmap_id"
            });
        }

        // Gọi Model để lấy dữ liệu
        const topics = await Topic.getByRoadmapId(roadmap_id);

        return res.status(200).json({
            success: true,
            data: topics
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
 * Lấy danh sách Topic mà user hiện tại thực sự có vocabulary (learning/mastered)
 * GET /api/topics/user
 */
const getUserTopics = async (req, res) => {
    try {
        const userId = req.user.id;

        // Gọi Model để lấy dữ liệu
        const topics = await Topic.getUserTopics(userId);

        return res.status(200).json({
            success: true,
            data: topics
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
    getByRoadmap,
    getUserTopics
};
