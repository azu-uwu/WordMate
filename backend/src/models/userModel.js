const db = require("../../config/db");

// Tìm user theo email
const findByEmail = async (email) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE email = ?",
        [email]
    );
    return rows[0];
};

// Tìm user theo username
const findByUsername = async (username) => {
    const [rows] = await db.query(
        "SELECT * FROM users WHERE username = ?",
        [username]
    );
    return rows[0];
};

// Thêm user mới
const createUser = async (user) => {
    const sql = `
        INSERT INTO users
        (username,email,password,fullname)
        VALUES(?,?,?,?)
    `;

    const [result] = await db.query(sql, [
        user.username,
        user.email,
        user.password,
        user.fullname
    ]);

    return result;
};

module.exports = {
    findByEmail,
    findByUsername,
    createUser
};

// Đăng nhập
