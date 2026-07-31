const Roadmap = require("../models/roadmapModel");

/**
 * Lấy danh sách tất cả Roadmap đang hoạt động
 * GET /api/roadmaps
 */
const getAll = async (req, res) => {
    try {
        // Gọi Model để lấy dữ liệu
        const roadmaps = await Roadmap.findAllActive();

        return res.status(200).json({
            success: true,
            data: roadmaps
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
    getAll
};