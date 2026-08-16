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

/**
 * Lấy tất cả Topic cho Admin (bao gồm is_active = 0)
 * Sắp xếp theo sort_order ASC, id ASC
 * Hỗ trợ lọc theo roadmap
 */
const getAllForAdmin = async (roadmapId = null) => {
    let sql = "SELECT * FROM topics";
    const params = [];

    if (roadmapId !== null && roadmapId !== undefined) {
        sql += " WHERE roadmap_id = ?";
        params.push(roadmapId);
    }

    sql += " ORDER BY sort_order ASC, id ASC";

    const [rows] = await pool.execute(sql, params);
    return rows;
};

/**
 * Lấy Topic theo id
 */
const findById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM topics WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

/**
 * Kiểm tra xem Topic name đã tồn tại chưa (cho tạo và cập nhật)
 * @param {string} name - Tên Topic
 * @param {number} [exceptId] - ID Topic cần loại trừ (cho cập nhật)
 */
const findByName = async (name, exceptId) => {
    if (exceptId) {
        const [rows] = await pool.execute(
            "SELECT id, name FROM topics WHERE name = ? AND id <> ?",
            [name, exceptId]
        );
        return rows[0] || null;
    }
    const [rows] = await pool.execute(
        "SELECT id, name FROM topics WHERE name = ?",
        [name]
    );
    return rows[0] || null;
};

/**
 * Tạo mới Topic
 * @param {object} data - { roadmap_id, name, description, image, sort_order, is_active }
 * @returns {object} Kết quả insert
 */
const create = async ({ roadmap_id, name, description, image, sort_order, is_active }) => {
    // Kiểm tra roadmap_id hợp lệ
    const [roadmaps] = await pool.execute(
        "SELECT id FROM roadmaps WHERE id = ?",
        [roadmap_id]
    );
    if (roadmaps.length === 0) {
        throw new Error("Roadmap không tồn tại");
    }

    const [result] = await pool.execute(
        `INSERT INTO topics (roadmap_id, name, description, image, sort_order, is_active)
         VALUES (?, ?, ?, ?, ?, ?)`,
        [roadmap_id, name, description, image, sort_order, is_active]
    );
    return result;
};

/**
 * Cập nhật Topic theo id
 * @param {number} id - ID Topic
 * @param {object} data - { roadmap_id, name, description, image, sort_order, is_active }
 * @returns {object} Kết quả update
 */
const update = async (id, { roadmap_id, name, description, image, sort_order, is_active }) => {
    // Kiểm tra roadmap_id hợp lệ nếu được cung cấp
    if (roadmap_id !== undefined) {
        const [roadmaps] = await pool.execute(
            "SELECT id FROM roadmaps WHERE id = ?",
            [roadmap_id]
        );
        if (roadmaps.length === 0) {
            throw new Error("Roadmap không tồn tại");
        }
    }

    // Kiểm tra trùng tên, loại trừ chính Topic đang cập nhật
    if (name) {
        const existingByName = await findByName(name, id);
        if (existingByName) {
            throw new Error("Tên Topic đã tồn tại");
        }
    }

    const [result] = await pool.execute(
        `UPDATE topics
         SET roadmap_id = ?, name = ?, description = ?, image = ?, sort_order = ?, is_active = ?
         WHERE id = ?`,
        [roadmap_id, name, description, image, sort_order, is_active, id]
    );
    return result;
};

/**
 * Cập nhật image cho Topic theo id
 * @param {number} id - ID Topic
 * @param {string} imagePath - Đường dẫn file ảnh
 */
const updateImage = async (id, imagePath) => {
    const [result] = await pool.execute(
        "UPDATE topics SET image = ? WHERE id = ?",
        [imagePath, id]
    );
    return result;
};

/**
 * Xóa Topic theo id (soft delete bằng is_active = 0)
 * @param {number} id - ID Topic
 * @returns {object} Kết quả delete
 */
const remove = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM topics WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    getByRoadmapId,
    getUserTopics,
    getAllForAdmin,
    findById,
    findByName,
    create,
    update,
    updateImage,
    remove,
};
