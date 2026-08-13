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

/**
 * Cập nhật streak khi người dùng tham gia học tập.
 * Quy tắc tính streak (theo M6-T7):
 * - last_study_date null → streak = 1
 * - học hôm qua → streak + 1
 * - học hôm nay → giữ nguyên streak
 * - quá 1 ngày → streak = 1
 *
 * @param {number} userId - ID người dùng
 * @param {Date} currentDate - Ngày học hiện tại (mặc định: bây giờ)
 * @returns {Promise<number|null>} streak mới sau khi cập nhật, null nếu user không tồn tại
 */
const updateStudyStreak = async (userId, currentDate = new Date()) => {
    const user = await findById(userId);
    if (!user) {
        return null;
    }

    // Bỏ phần giờ để so sánh theo ngày
    const startOfDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const today = startOfDay(currentDate);
    const currentStreak = user.streak || 0;
    let newStreak = 1;

    if (user.last_study_date) {
        const lastStudy = startOfDay(user.last_study_date);
        const dayDiff = Math.round((today - lastStudy) / (1000 * 60 * 60 * 24));

        if (dayDiff === 1) {
            // Học liên tiếp: hôm qua → tăng streak
            newStreak = currentStreak + 1;
        } else if (dayDiff === 0) {
            // Đã học hôm nay → giữ nguyên streak
            newStreak = currentStreak;
        }
        // dayDiff > 1 hoặc dayDiff < 0 → reset streak = 1
    }

    await updateStreak(userId, newStreak, currentDate);

    return newStreak;
};

/**
 * Kiểm tra và reset streak nếu người dùng bỏ lỡ hơn 1 ngày học.
 * Quy tắc (theo yêu cầu):
 * - last_study_date null → không reset
 * - dayDiff > 1 → streak = 0 (không thay đổi last_study_date)
 * - dayDiff <= 1 → giữ nguyên
 *
 * Ví dụ:
 * - last_study_date = 14/8, today = 14/8 → giữ nguyên
 * - last_study_date = 14/8, today = 15/8 → giữ nguyên (user vẫn có thể học hôm nay)
 * - last_study_date = 14/8, today = 16/8 → streak = 0
 *
 * @param {number} userId - ID người dùng
 * @param {Date} currentDate - Ngày hiện tại (mặc định: bây giờ)
 * @returns {Promise<number|null>} streak sau khi kiểm tra, null nếu user không tồn tại
 */
const checkAndResetStreak = async (userId, currentDate = new Date()) => {
    const user = await findById(userId);
    if (!user) {
        return null;
    }

    // last_study_date null → không reset
    if (user.last_study_date === null) {
        return user.streak || 0;
    }

    // Bỏ phần giờ để so sánh theo ngày
    const startOfDay = (date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        return d;
    };

    const today = startOfDay(currentDate);
    const lastStudy = startOfDay(user.last_study_date);
    const dayDiff = Math.round((today - lastStudy) / (1000 * 60 * 60 * 24));

    // dayDiff > 1 → reset streak = 0, không thay đổi last_study_date
    if (dayDiff > 1) {
        await pool.execute(
            "UPDATE users SET streak = 0 WHERE id = ?",
            [userId]
        );
        return 0;
    }

    // dayDiff <= 1 → giữ nguyên
    return user.streak || 0;
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
    updateStudyStreak,
    checkAndResetStreak,
};
