const mysql = require("mysql2/promise");
require("dotenv").config();

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    // thêm để deploy trên raiway
    port: process.env.DB_PORT,

    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

const testConnection = async () => {
    try {
        const connection = await pool.getConnection();
        console.log("Kết nối MySQL thành công!!!");
        connection.release();
    } catch (err) {
        if (err.code === "ECONNREFUSED") {
            console.error("❌ MySQL connection refused: Database server is not running or port is blocked");
        } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
            console.error("❌ MySQL access denied: Check DB_USER and DB_PASSWORD in .env");
        } else {
            console.error("❌ MySQL connection failed:", err.message);
        }
    }
};

module.exports = pool;
module.exports.testConnection = testConnection;
