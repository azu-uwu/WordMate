const User = require("../models/userModel");
const Roadmap = require("../models/roadmapModel");

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

        // Fetch roadmap name if user has a roadmap_id
        let roadmapName = null;
        if (user.roadmap_id) {
            const roadmap = await Roadmap.findById(user.roadmap_id);
            roadmapName = roadmap ? roadmap.name : null;
        }

        return res.status(200).json({
            success: true,
            data: {
                id: user.id,
                username: user.username,
                email: user.email,
                fullname: user.fullname,
                avatar: user.avatar,
                role: user.role,
                roadmap_id: user.roadmap_id,
                roadmap_name: roadmapName,
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

const updateProfile = async (req, res) => {
    try {
        const { fullname } = req.body;
        const userId = req.user.id;

        // Validate fullname is not empty or whitespace only
        if (!fullname || fullname.trim().length === 0) {
            return res.status(400).json({
                success: false,
                message: "Họ tên không được để trống"
            });
        }

        // Get current user to preserve existing avatar
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({
                success: false,
                message: "Người dùng không tồn tại"
            });
        }

        // Update profile with new fullname and existing avatar
        await User.updateProfile(userId, {
            fullname: fullname.trim(),
            avatar: user.avatar
        });

        return res.status(200).json({
            success: true,
            message: "Cập nhật thông tin thành công"
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

const updateRoadmap = async (req, res) => {
    try {
        const { roadmap_id } = req.body;
        const userId = req.user.id;

        // Validate roadmap_id is an integer and > 0
        if (!Number.isInteger(roadmap_id) || roadmap_id <= 0) {
            return res.status(400).json({
                success: false,
                message: "Roadmap ID không hợp lệ"
            });
        }

        // Check if roadmap exists
        const roadmap = await Roadmap.findById(roadmap_id);
        if (!roadmap) {
            return res.status(404).json({
                success: false,
                message: "Roadmap không tồn tại"
            });
        }

        // Update user's roadmap
        await User.updateRoadmap(userId, roadmap_id);

        return res.status(200).json({
            success: true,
            data: {
                user_id: userId,
                roadmap_id: roadmap_id
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
    getProfile,
    updateProfile,
    updateRoadmap
};
