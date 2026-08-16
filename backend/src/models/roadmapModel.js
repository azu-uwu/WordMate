const pool = require("../../config/db");

const findAllActive = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM roadmaps WHERE is_active = 1 ORDER BY sort_order ASC"
    );
    return rows;
};

/**
 * Lấy toàn bộ Roadmap (kể cả is_active = 0) cho Admin
 * Sắp xếp theo sort_order ASC, id ASC
 */
const findAllForAdmin = async () => {
    const [rows] = await pool.execute(
        "SELECT id, name, description, image, is_active, sort_order, created_at, updated_at FROM roadmaps ORDER BY sort_order ASC, id ASC"
    );
    return rows;
};

const findById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM roadmaps WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

/**
 * Tìm Roadmap theo name (đã trim, so sánh chính xác)
 * Dùng để kiểm tra trùng tên khi tạo Roadmap
 * @param {string} name - Tên Roadmap
 */
const findByName = async (name) => {
    const [rows] = await pool.execute(
        "SELECT id, name FROM roadmaps WHERE name = ?",
        [name]
    );
    return rows[0] || null;
};

/**
 * Tìm Roadmap theo name nhưng loại trừ một id cụ thể.
 * Dùng để kiểm tra trùng tên khi cập nhật Roadmap
 * (tránh chính Roadmap đang cập nhật bị tính là trùng).
 * @param {string} name - Tên Roadmap
 * @param {number} exceptId - ID Roadmap cần loại trừ
 */
const findByNameExceptId = async (name, exceptId) => {
    const [rows] = await pool.execute(
        "SELECT id, name FROM roadmaps WHERE name = ? AND id <> ?",
        [name, exceptId]
    );
    return rows[0] || null;
};

/**
 * Tạo mới Roadmap
 * @param {object} data - { name, description, image, is_active, sort_order }
 */
const create = async ({ name, description, image, is_active, sort_order }) => {
    const [result] = await pool.execute(
        `INSERT INTO roadmaps (name, description, image, is_active, sort_order)
         VALUES (?, ?, ?, ?, ?)`,
        [name, description, image, is_active, sort_order]
    );
    return result;
};

/**
 * Cập nhật Roadmap theo id
 * @param {number} id - ID Roadmap
 * @param {object} data - { name, description, image, is_active, sort_order }
 */
const update = async (id, { name, description, image, is_active, sort_order }) => {
    const [result] = await pool.execute(
        `UPDATE roadmaps
         SET name = ?, description = ?, image = ?, is_active = ?, sort_order = ?
         WHERE id = ?`,
        [name, description, image, is_active, sort_order, id]
    );
    return result;
};

/**
 * Cập nhật image cho Roadmap theo id
 * @param {number} id - ID Roadmap
 * @param {string} imagePath - Đường dẫn file ảnh
 */
const updateImage = async (id, imagePath) => {
    const [result] = await pool.execute(
        "UPDATE roadmaps SET image = ? WHERE id = ?",
        [imagePath, id]
    );
    return result;
};

/**
 * Xóa Roadmap theo id
 */
const remove = async (id) => {
    const [result] = await pool.execute(
        "DELETE FROM roadmaps WHERE id = ?",
        [id]
    );
    return result;
};

module.exports = {
    findAllActive,
    findAllForAdmin,
    findById,
    findByName,
    findByNameExceptId,
    create,
    update,
    updateImage,
    remove,
};
