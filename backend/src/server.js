// backend/server.js
const express = require('express');
const mysql = require('mysql2/promise');
const cors = require('cors');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();

// -------------------------------------------------------------
// 1. CẤU HÌNH MIDDLEWARE
// -------------------------------------------------------------
app.use(cors()); // Cho phép các domain khác (Front-end) gọi tới API này
app.use(express.json()); // Cho phép Express đọc dữ liệu JSON gửi lên từ body request

// -------------------------------------------------------------
// 2. KẾT NỐI CƠ SỞ DỮ LIỆU MYSQL (phpMyAdmin)
// -------------------------------------------------------------
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test nhanh kết nối khi bật server
pool.getConnection()
    .then(() => console.log('=== KẾT NỐI MYSQL QUA PHPMYADMIN THÀNH CÔNG ==='))
    .catch(err => {
        console.error('!!! LỖI KẾT NỐI MYSQL !!! Hãy chắc chắn bạn đã bật XAMPP/MySQL.');
        console.error(err);
    });

// -------------------------------------------------------------
// 3. API ĐĂNG KÝ TÀI KHOẢN (POST http://localhost:5000/api/register)
// -------------------------------------------------------------
app.post('/api/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;

        // Bước A: Kiểm tra dữ liệu đầu vào cơ bản từ FE gửi lên
        if (!username || !email || !password) {
            return res.status(400).json({ message: 'Vui lòng nhập đầy đủ thông tin!' });
        }

        // Bước B: Kiểm tra xem username hoặc email đã bị ai khác đăng ký chưa
        const checkQuery = 'SELECT id FROM users WHERE username = ? OR email = ?';
        const [existingUsers] = await pool.execute(checkQuery, [username, email]);

        if (existingUsers.length > 0) {
            return res.status(400).json({ message: 'Tên đăng nhập hoặc Email đã tồn tại trên hệ thống!' });
        }

        // Bước C: Bảo mật dữ liệu - Mã hóa mật khẩu thành chuỗi hash ngẫu nhiên
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Bước D: Chèn bản ghi người dùng mới vào cơ sở dữ liệu MySQL
        const insertQuery = 'INSERT INTO users (username, email, password) VALUES (?, ?, ?)';
        await pool.execute(insertQuery, [username, email, hashedPassword]);

        // Trả phản hồi thành công về cho Front-end nhận diện
        return res.status(201).json({ message: 'Đăng ký tài khoản thành công!' });

    } catch (error) {
        console.error('Lỗi trong quá trình đăng ký:', error);
        return res.status(500).json({ message: 'Có lỗi xảy ra ở hệ thống Back-end, vui lòng thử lại sau.' });
    }
});

// -------------------------------------------------------------
// 4. KHỞI CHẠY SERVER
// -------------------------------------------------------------
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server Back-end đang chạy tại: http://localhost:${PORT}`);
});