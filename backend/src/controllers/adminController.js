const Roadmap = require("../models/roadmapModel");

/**
 * Lấy danh sách tất cả Roadmap (bao gồm cả is_active = 0) cho Admin
 * GET /api/admin/roadmaps
 */
const getAllRoadmaps = async (req, res) => {
    try {
        // Gọi Model để lấy dữ liệu
        const roadmaps = await Roadmap.findAllForAdmin();

        return res.status(200).json({
            success: true,
            data: roadmaps
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Tạo Roadmap mới
 * POST /api/admin/roadmaps
 * Body: { name, description, image, is_active, sort_order }
 */
const createRoadmap = async (req, res) => {
    try {
        const { name, description, image, is_active, sort_order } = req.body;

        // Validate name là chuỗi không rỗng
        if (name === undefined || name === null || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu name"
            });
        }

        // Kiểm tra trùng tên (so sánh sau khi trim)
        const trimmedName = name.trim();
        const existingByName = await Roadmap.findByName(trimmedName);
        if (existingByName) {
            return res.status(400).json({
                success: false,
                message: "Tên Roadmap đã tồn tại"
            });
        }

        // Validate is_active (nếu có)
        let active = 1;
        if (is_active !== undefined && is_active !== null) {
            if (typeof is_active === "boolean") {
                active = is_active ? 1 : 0;
            } else if (is_active === 0 || is_active === 1) {
                active = is_active;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "is_active phải là boolean (true/false) hoặc 0/1"
                });
            }
        }

        // Validate description (nếu có)
        if (description !== undefined && description !== null && typeof description !== "string") {
            return res.status(400).json({
                success: false,
                message: "Description phải là chuỗi hoặc null"
            });
        }

        // Validate image (nếu có)
        if (image !== undefined && image !== null && typeof image !== "string") {
            return res.status(400).json({
                success: false,
                message: "Image phải là chuỗi hoặc null"
            });
        }

        // Validate sort_order (nếu có)
        let order = 0;
        if (sort_order !== undefined && sort_order !== null && sort_order !== "") {
            if (!Number.isInteger(sort_order)) {
                return res.status(400).json({
                    success: false,
                    message: "sort_order phải là số nguyên"
                });
            }
            order = sort_order;
        }

        // Gọi Model để tạo dữ liệu
        const result = await Roadmap.create({
            name: trimmedName,
            description: description !== undefined && description !== null ? description : null,
            image: image !== undefined && image !== null ? image : null,
            is_active: active,
            sort_order: order
        });

        const newRoadmap = await Roadmap.findById(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Tạo Roadmap thành công",
            data: newRoadmap
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Cập nhật Roadmap theo id
 * PUT /api/admin/roadmaps/:id
 * Body: { name, description, image, is_active, sort_order }
 */
const updateRoadmap = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Roadmap ID không hợp lệ"
            });
        }

        // Kiểm tra Roadmap tồn tại
        const existing = await Roadmap.findById(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Roadmap không tồn tại"
            });
        }

        const { name, description, image, is_active, sort_order } = req.body;

        // Validate name (nếu có)
        let updatedName = existing.name;
        if (name !== undefined) {
            if (name === null || typeof name !== "string" || name.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "Name phải là chuỗi không rỗng"
                });
            }
            updatedName = name.trim();

            // Kiểm tra trùng tên, loại trừ chính Roadmap đang cập nhật
            const existingByName = await Roadmap.findByNameExceptId(updatedName, parsedId);
            if (existingByName) {
                return res.status(400).json({
                    success: false,
                    message: "Tên Roadmap đã tồn tại"
                });
            }
        }

        // Validate description (nếu có, cho phép null để xóa giá trị)
        let updatedDescription = existing.description;
        if (description !== undefined) {
            if (description !== null && typeof description !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Description phải là chuỗi hoặc null"
                });
            }
            updatedDescription = description;
        }

        // Validate image (nếu có, cho phép null để xóa giá trị)
        let updatedImage = existing.image;
        if (image !== undefined) {
            if (image !== null && typeof image !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "Image phải là chuỗi hoặc null"
                });
            }
            updatedImage = image;
        }

        // Validate is_active (nếu có)
        let updatedActive = existing.is_active;
        if (is_active !== undefined && is_active !== null) {
            if (typeof is_active === "boolean") {
                updatedActive = is_active ? 1 : 0;
            } else if (is_active === 0 || is_active === 1) {
                updatedActive = is_active;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "is_active phải là boolean (true/false) hoặc 0/1"
                });
            }
        }

        // Validate sort_order (nếu có)
        let updatedOrder = existing.sort_order;
        if (sort_order !== undefined && sort_order !== null && sort_order !== "") {
            if (!Number.isInteger(sort_order)) {
                return res.status(400).json({
                    success: false,
                    message: "sort_order phải là số nguyên"
                });
            }
            updatedOrder = sort_order;
        }

        // Gọi Model để cập nhật
        await Roadmap.update(parsedId, {
            name: updatedName,
            description: updatedDescription,
            image: updatedImage,
            is_active: updatedActive,
            sort_order: updatedOrder
        });

        const updatedRoadmap = await Roadmap.findById(parsedId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật Roadmap thành công",
            data: updatedRoadmap
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Xóa Roadmap theo id
 * DELETE /api/admin/roadmaps/:id
 */
const deleteRoadmap = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Roadmap ID không hợp lệ"
            });
        }

        // Kiểm tra Roadmap tồn tại
        const existing = await Roadmap.findById(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Roadmap không tồn tại"
            });
        }

        // Gọi Model để xóa
        const result = await Roadmap.remove(parsedId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Roadmap không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa Roadmap thành công"
        });
    } catch (err) {
        // Nếu có lỗi ràng buộc khóa ngoại (VD: user vẫn đang tham chiếu roadmap)
        if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa Roadmap vì đang có dữ liệu liên quan"
            });
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = {
    getAllRoadmaps,
    createRoadmap,
    updateRoadmap,
    deleteRoadmap
};