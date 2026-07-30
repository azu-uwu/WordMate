const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/userModel");

const register = async (req, res) => {
    console.log(">>> NEW REGISTER CONTROLLER");
    try {
        const { username, email, password, fullname } = req.body;

        // Validate required fields
        if (!username || !fullname || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return res.status(400).json({
                success: false,
                message: "Email không hợp lệ"
            });
        }

        // Validate password length
        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Mật khẩu phải tối thiểu 8 ký tự"
            });
        }

        // Check if username already exists
        const existingUsername = await User.findByUsername(username);
        if (existingUsername) {
            return res.status(409).json({
                success: false,
                message: "Username đã tồn tại"
            });
        }

        // Check if email already exists
        const existingEmail = await User.findByEmail(email);
        if (existingEmail) {
            return res.status(409).json({
                success: false,
                message: "Email đã tồn tại"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const result = await User.create({
            username,
            email,
            password: hashedPassword,
            fullname
        });

        // Get created user to retrieve user_id
        const user = await User.findByEmail(email);

        // Generate JWT token (HS256, 24h)
        const token = jwt.sign(
            { id: user.id, email: user.email, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "24h" }
        );

        // log sửa lỗi
        // console.log({
        //     success: true,
        //     message: "Đăng ký thành công",
        //     data: {
        //         user_id: user.id,
        //         username: user.username,
        //         fullname: user.fullname,
        //         email: user.email,
        //         token
        //     }
        // });

        // Format response per spec 7.1
        return res.status(201).json({
            success: true,
            message: "Đăng ký thành công",
            data: {
                user_id: user.id,
                username: user.username,
                fullname: user.fullname,
                email: user.email,
                token
            }
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = {
    register
};