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

/**
 * API Đưa từ đã thuộc về luyện tập
 * POST /api/notebook/review/:vocabulary_id
 *
 * - Lấy userId từ JWT (authMiddleware)
 * - Lấy vocabulary_id từ req.params
 * - Chỉ vocabulary có status = 'mastered' mới được đưa về 'learning'
 * - Cập nhật: status = 'learning', next_review_at = NOW()
 * - Không thay đổi review_count, last_reviewed_at hay các field khác
 */
const reviewVocabulary = async (req, res) => {
    try {
        const userId = req.user.id;
        const { vocabulary_id } = req.params;

        // Validate vocabulary_id là số nguyên dương
        const parsedVocabularyId = Number(vocabulary_id);
        if (!Number.isInteger(parsedVocabularyId) || parsedVocabularyId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Gọi Model: UPDATE chỉ tác động khi user_id + vocabulary_id + status = 'mastered'
        const result = await Notebook.reviewVocabulary(userId, parsedVocabularyId);

        // Thành công: có row được cập nhật
        if (result.affectedRows > 0) {
            return res.status(200).json({
                success: true,
                message: "Đưa từ vựng về luyện tập thành công",
                data: {
                    vocabulary_id: parsedVocabularyId,
                    status: "learning",
                    next_review_at: new Date()
                }
            });
        }

        // Không có row nào được cập nhật → phân biệt nguyên nhân
        // Trường hợp D: vocabulary không tồn tại
        const vocabulary = await Notebook.findVocabularyById(parsedVocabularyId);
        if (!vocabulary) {
            return res.status(404).json({
                success: false,
                message: "Từ vựng không tồn tại"
            });
        }

        // Trường hợp B: vocabulary không thuộc user hiện tại
        const userVocabulary = await Notebook.findUserVocabulary(userId, parsedVocabularyId);
        if (!userVocabulary) {
            return res.status(404).json({
                success: false,
                message: "Từ vựng không tồn tại trong sổ tay của bạn"
            });
        }

        // Trường hợp C: vocabulary không ở trạng thái mastered
        return res.status(400).json({
            success: false,
            message: "Chỉ từ vựng ở trạng thái mastered mới có thể đưa về luyện tập"
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
    getNotebook,
    reviewVocabulary
};
