const pool = require("../../config/db");

const findAllActive = async () => {
    const [rows] = await pool.execute(
        "SELECT * FROM roadmaps WHERE is_active = 1 ORDER BY sort_order ASC"
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


module.exports = {
    findAllActive,
    findById,
};