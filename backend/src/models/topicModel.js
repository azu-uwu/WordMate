const pool = require("../../config/db");

/**
 * Lấy danh sách Topic theo roadmap_id
 * Chỉ lấy Topic có is_active = 1, sắp xếp theo sort_order ASC
 */
const getByRoadmapId = async (roadmapId) => {
    const [rows] = await pool.execute(
        "SELECT * FROM topics WHERE is_active = 1 AND roadmap_id = ? ORDER BY sort_order ASC",
        [roadmapId]
    );
    return rows;
};

module.exports = {
    getByRoadmapId,
};