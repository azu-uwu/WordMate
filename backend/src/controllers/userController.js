const User = require("../models/userModel");

const getProfile = async (req, res) => {
    try {
        const userId = req.user.id;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar,
                role: user.role,
                roadmap_id: user.roadmap_id,
                streak: user.streak,
                last_study_date: user.last_study_date
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
    getProfile
};