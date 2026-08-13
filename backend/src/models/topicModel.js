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

/**
 * Lấy danh sách Topic mà user thực sự có vocabulary (learning/mastered)
 * JOIN qua bảng vocabularies vì user_vocabularies không có topic_id
 */
const getUserTopics = async (userId) => {
    const [rows] = await pool.execute(
        `SELECT DISTINCT
            t.id,
            t.name
        FROM user_vocabularies uv
        INNER JOIN vocabularies v
            ON v.id = uv.vocabulary_id
        INNER JOIN topics t
            ON t.id = v.topic_id
        WHERE uv.user_id = ?
          AND uv.status IN ('learning', 'mastered')
        ORDER BY t.name ASC`,
        [userId]
    );
    return rows;
};

module.exports = {
    getByRoadmapId,
    getUserTopics,
};
