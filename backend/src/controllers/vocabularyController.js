const Vocabulary = require("../models/vocabularyModel");

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

module.exports = {
    getByTopic
};