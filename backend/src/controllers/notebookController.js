const Notebook = require("../models/notebookModel");

/**
 * API Lấy Sổ tay từ vựng
 * GET /api/notebook
 * Query params: search, topic_id, status, page, limit
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Chỉ lấy status 'learning' hoặc 'mastered'
 * - Search trên cả word và meaning
 * - Hỗ trợ filter topic_id, status
 * - Hỗ trợ pagination (page, limit)
 * - Không phụ thuộc roadmap
 */
const getNotebook = async (req, res) => {
    try {
        const userId = req.user.id;
        const { search, topic_id, status, page, limit } = req.query;

        // Parse và validate page (mặc định: 1)
        const parsedPage = page ? Number(page) : 1;
        if (!Number.isInteger(parsedPage) || parsedPage < 1) {
            return res.status(400).json({
                success: false,
                message: "Page phải là số nguyên dương"
            });
        }

        // Parse và validate limit (mặc định: 10)
        const parsedLimit = limit ? Number(limit) : 10;
        if (!Number.isInteger(parsedLimit) || parsedLimit < 1) {
            return res.status(400).json({
                success: false,
                message: "Limit phải là số nguyên dương"
            });
        }

        // Validate status (chỉ chấp nhận 'learning' hoặc 'mastered')
        if (status && !["learning", "mastered"].includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Status không hợp lệ. Chỉ chấp nhận 'learning' hoặc 'mastered'"
            });
        }

        // Parse và validate topic_id (nếu có)
        let parsedTopicId = null;
        if (topic_id !== undefined && topic_id !== null && topic_id !== "") {
            parsedTopicId = Number(topic_id);
            if (!Number.isInteger(parsedTopicId) || parsedTopicId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Topic ID không hợp lệ"
                });
            }
        }

        // Trim search (nếu có)
        const trimmedSearch = search ? search.trim() : undefined;

        // Gọi Model để lấy dữ liệu
        const items = await Notebook.getAll(userId, {
            search: trimmedSearch,
            topicId: parsedTopicId,
            status,
            page: parsedPage,
            limit: parsedLimit
        });

        const total = await Notebook.getTotal(userId, {
            search: trimmedSearch,
            topicId: parsedTopicId,
            status
        });

        const totalPages = Math.ceil(total / parsedLimit);

        return res.status(200).json({
            success: true,
            data: {
                total,
                page: parsedPage,
                limit: parsedLimit,
                total_pages: totalPages,
                items
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
    getNotebook
};
