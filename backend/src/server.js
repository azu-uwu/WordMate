const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("../config/db");
const { testConnection } = require("../config/db");

// auth
const authRoutes = require("./routes/authRoutes");
// console.log("authRoutes =", authRoutes);

// user
const userRoutes = require("./routes/userRoutes");

// roadmap
const roadmapRoutes = require("./routes/roadmapRoutes");

// topic
const topicRoutes = require("./routes/topicRoutes");

// vocabulary
const vocabularyRoutes = require("./routes/vocabularyRoutes");

const app = express();

app.use(cors());
app.use(express.json());

// public folder fe/public
app.use(express.static("../frontend/public"));
// app.use(express.static(path.join(__dirname, "../../frontend/public")));

// Trang chủ
// Routes
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

// user
app.use("/api", userRoutes);

// roadmap
app.use("/api/roadmaps", roadmapRoutes);

// topic
app.use("/api/topics", topicRoutes);

// vocabulary
app.use("/api/vocabularies", vocabularyRoutes);

// learning
console.log("typeof vocabularyRoutes =", typeof vocabularyRoutes);
console.log(vocabularyRoutes);
app.use("/api/learning", vocabularyRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, async () => {
    console.log(`Server đang chạy tại http://localhost:${PORT}`);
    await testConnection();
});

// // Đăng ký route auth
// const authRoutes = require("./routes/authRoutes");
// app.use("/api/auth", authRoutes);