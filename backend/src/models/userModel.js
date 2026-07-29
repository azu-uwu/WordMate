const pool = require("../../config/db");

const findByEmail = (email) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "SELECT * FROM users WHERE email = ?",
            [email],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            }
        );
    });
};

const findById = (id) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "SELECT * FROM users WHERE id = ?",
            [id],
            (err, rows) => {
                if (err) return reject(err);
                resolve(rows[0] || null);
            }
        );
    });
};

const create = ({ username, email, password, fullname }) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "INSERT INTO users (username, email, password, fullname) VALUES (?, ?, ?, ?)",
            [username, email, password, fullname],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const updatePassword = (id, newPasswordHash) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "UPDATE users SET password = ? WHERE id = ?",
            [newPasswordHash, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const updateProfile = (id, { fullname, avatar }) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "UPDATE users SET fullname = ?, avatar = ? WHERE id = ?",
            [fullname, avatar, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const updateRoadmap = (id, roadmapId) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "UPDATE users SET roadmap_id = ? WHERE id = ?",
            [roadmapId, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

const updateStreak = (id, streak, lastStudyDate) => {
    return new Promise((resolve, reject) => {
        pool.execute(
            "UPDATE users SET streak = ?, last_study_date = ? WHERE id = ?",
            [streak, lastStudyDate, id],
            (err, result) => {
                if (err) return reject(err);
                resolve(result);
            }
        );
    });
};

module.exports = {
    findByEmail,
    findById,
    create,
    updatePassword,
    updateProfile,
    updateRoadmap,
    updateStreak,
};