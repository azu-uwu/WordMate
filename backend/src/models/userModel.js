const pool = require("../../config/db");

const findByEmail = async (email) => {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0] || null;
};

const findByUsername = async (username) => {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0] || null;
};

const findById = async (id) => {
    const [rows] = await pool.execute(
        "SELECT * FROM users WHERE id = ?",
        [id]
    );
    return rows[0] || null;
};

const create = async ({ username, email, password, fullname }) => {
    const [result] = await pool.execute(
        "INSERT INTO users (username, email, password, fullname) VALUES (?, ?, ?, ?)",
        [username, email, password, fullname]
    );
    return result;
};

const updatePassword = async (id, newPasswordHash) => {
    const [result] = await pool.execute(
        "UPDATE users SET password = ? WHERE id = ?",
        [newPasswordHash, id]
    );
    return result;
};

const updateProfile = async (id, { fullname, avatar }) => {
    const [result] = await pool.execute(
        "UPDATE users SET fullname = ?, avatar = ? WHERE id = ?",
        [fullname, avatar, id]
    );
    return result;
};

const updateRoadmap = async (id, roadmapId) => {
    const [result] = await pool.execute(
        "UPDATE users SET roadmap_id = ? WHERE id = ?",
        [roadmapId, id]
    );
    return result;
};

const updateStreak = async (id, streak, lastStudyDate) => {
    const [result] = await pool.execute(
        "UPDATE users SET streak = ?, last_study_date = ? WHERE id = ?",
        [streak, lastStudyDate, id]
    );
    return result;
};

module.exports = {
    findByEmail,
    findByUsername,
    findById,
    create,
    updatePassword,
    updateProfile,
    updateRoadmap,
    updateStreak,
};
