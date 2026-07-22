const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const register = async (req, res) => {

    try {

        const {
            username,
            email,
            password,
            fullname
        } = req.body;

        // Kiểm tra thiếu dữ liệu
        if (!username || !email || !password || !fullname) {

            return res.status(400).json({
                success: false,
                message: "Vui lòng nhập đầy đủ thông tin"
            });

        }

        // Email tồn tại
        const emailExist = await User.findByEmail(email);

        if (emailExist) {

            return res.status(400).json({
                success: false,
                message: "Email đã tồn tại"
            });

        }

        // Username tồn tại
        const usernameExist = await User.findByUsername(username);

        if (usernameExist) {

            return res.status(400).json({
                success: false,
                message: "Username đã tồn tại"
            });

        }

        // Mã hóa mật khẩu
        const hashPassword = await bcrypt.hash(password, 10);

        // Lưu database
        await User.createUser({

            username,
            email,
            password: hashPassword,
            fullname

        });

        return res.status(201).json({

            success: true,
            message: "Đăng ký thành công"

        });

    } catch (err) {

        console.log(err);

        return res.status(500).json({

            success: false,
            message: err.message

        });

    }

};

module.exports = {
    register
};

