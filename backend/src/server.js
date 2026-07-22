const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("../config/db");

// auth
const authRoutes = require("./routes/authRoutes");
console.log("authRoutes =", authRoutes);

const app = express();

app.use(cors());
app.use(express.json());

// Trang chủ
app.get("/", (req, res) => {
    res.send("WordMate Backend Running");
});

// Kiểm tra kết nối MySQL
app.get("/test-db", async (req, res) => {
    try {
        const [rows] = await db.query("select * from users");
        res.json({
            success: true,
            data: rows
        });
    } catch (err) {
        res.status(500).json({
            success: false,
            message: err.message
        });
    }
});

// auth
app.use("/api/auth", authRoutes);

app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`);
});

// // Đăng ký route auth
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);
