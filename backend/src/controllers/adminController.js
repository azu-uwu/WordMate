const Roadmap = require("../models/roadmapModel");
const Topic = require("../models/topicModel");
const Vocabulary = require("../models/vocabularyModel");
const CustomQuestion = require("../models/customQuestionModel");
const pool = require("../../config/db");
const { uploadImage, uploadAudio } = require("../../config/upload");
const { parse } = require("csv-parse/sync");

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

/**
 * Lấy danh sách tất cả Topics (bao gồm cả is_active = 0) cho Admin
 * GET /api/admin/topics
 */
const getAllTopics = async (req, res) => {
    try {
        const { roadmap_id } = req.query;

        let roadmapId = null;

        if (roadmap_id !== undefined) {
            roadmapId = Number(roadmap_id);

            if (!Number.isInteger(roadmapId) || roadmapId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "roadmap_id không hợp lệ"
                });
            }
        }

        const topics = await Topic.getAllForAdmin(roadmapId);

        return res.status(200).json({
            success: true,
            data: topics
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
 * Tạo Topic mới
 * POST /api/admin/topics
 * Body: { roadmap_id, name, description, image, sort_order, is_active }
 */
const createTopic = async (req, res) => {
    try {
        const { roadmap_id, name, description, image, sort_order, is_active } = req.body;

        // Validate name là chuỗi không rỗng
        if (name === undefined || name === null || typeof name !== "string" || name.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu name"
            });
        }

        // Kiểm tra roadmap_id hợp lệ
        const roadmap = await Roadmap.findById(roadmap_id);
        if (!roadmap) {
            return res.status(400).json({
                success: false,
                message: "Roadmap không tồn tại"
            });
        }

        // Kiểm tra trùng tên Topic trong cùng roadmap
        const trimmedName = name.trim();
        const [rows] = await pool.execute(
            "SELECT id FROM topics WHERE name = ? AND roadmap_id = ? AND is_active = 1",
            [trimmedName, roadmap_id]
        );
        if (rows.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Tên Topic đã tồn tại trong roadmap này"
            });
        }

        // Gọi Model để tạo dữ liệu
        const result = await Topic.create({
            roadmap_id,
            name: trimmedName,
            description: description !== undefined && description !== null ? description : null,
            image: image !== undefined && image !== null ? image : null,
            sort_order: sort_order !== undefined ? sort_order : 0,
            is_active: is_active !== undefined ? (is_active ? 1 : 0) : 1
        });

        const newTopic = await Topic.findById(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Tạo Topic thành công",
            data: newTopic
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
 * Cập nhật Topic theo id
 * PUT /api/admin/topics/:id
 * Body: { roadmap_id, name, description, image, sort_order, is_active }
 */
const updateTopic = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Topic ID không hợp lệ"
            });
        }

        // Kiểm tra Topic tồn tại
        const existing = await Topic.findById(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Topic không tồn tại"
            });
        }

        const { roadmap_id, name, description, image, sort_order, is_active } = req.body;

        // Kiểm tra roadmap_id hợp lệ nếu được cung cấp
        if (roadmap_id !== undefined) {
            const roadmap = await Roadmap.findById(roadmap_id);
            if (!roadmap) {
                return res.status(400).json({
                    success: false,
                    message: "Roadmap không tồn tại"
                });
            }
        }

        // Kiểm tra trùng tên, loại trừ chính Topic đang cập nhật
        if (name) {
            const trimmedName = name.trim();
            const existingByName = await Topic.findByName(trimmedName, parsedId);
            if (existingByName) {
                return res.status(400).json({
                    success: false,
                    message: "Tên Topic đã tồn tại"
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

        // Validate sort_order (nếu có)
        let updatedSortOrder = sort_order !== undefined ? sort_order : existing.sort_order;
        if (sort_order !== undefined && sort_order !== null && sort_order !== "") {
            if (!Number.isInteger(sort_order)) {
                return res.status(400).json({
                    success: false,
                    message: "sort_order phải là số nguyên"
                });
            }
            updatedSortOrder = sort_order;
        }

        // Validate is_active (nếu có)
        let updatedIsActive = is_active !== undefined ? (is_active ? 1 : 0) : existing.is_active;
        if (is_active !== undefined && is_active !== null) {
            if (typeof is_active === "boolean") {
                updatedIsActive = is_active ? 1 : 0;
            } else if (is_active === 0 || is_active === 1) {
                updatedIsActive = is_active;
            } else {
                return res.status(400).json({
                    success: false,
                    message: "is_active phải là boolean (true/false) hoặc 0/1"
                });
            }
        }

        // Gọi Model để cập nhật
        await Topic.update(parsedId, {
            roadmap_id: roadmap_id !== undefined ? roadmap_id : existing.roadmap_id,
            name: name !== undefined ? name.trim() : existing.name,
            description: updatedDescription,
            image: updatedImage,
            sort_order: updatedSortOrder,
            is_active: updatedIsActive
        });

        const updatedTopic = await Topic.findById(parsedId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật Topic thành công",
            data: updatedTopic
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
 * Xóa Topic theo id
 * DELETE /api/admin/topics/:id
 */
const deleteTopic = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Topic ID không hợp lệ"
            });
        }

        // Kiểm tra Topic tồn tại
        const existing = await Topic.findById(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Topic không tồn tại"
            });
        }

        // Gọi Model để xóa (soft delete)
        await Topic.remove(parsedId);

        return res.status(200).json({
            success: true,
            message: "Xóa Topic thành công"
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
 * Lấy danh sách tất cả Vocabulary cho Admin
 * Hỗ trợ lọc theo topic_id
 * GET /api/admin/vocabularies
 * Query: topic_id (optional)
 */
const getAllVocabularies = async (req, res) => {
    try {
        const { topic_id } = req.query;

        let topicId = null;

        if (topic_id !== undefined) {
            topicId = Number(topic_id);

            if (!Number.isInteger(topicId) || topicId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "topic_id không hợp lệ"
                });
            }
        }

        const vocabularies = await Vocabulary.getAllForAdmin(topicId);

        return res.status(200).json({
            success: true,
            data: vocabularies
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
 * Tạo Vocabulary mới
 * POST /api/admin/vocabularies
 * Body: { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }
 */
const createVocabulary = async (req, res) => {
    try {
        const { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image } = req.body;

        // Validate topic_id (bắt buộc)
        if (topic_id === undefined || topic_id === null || topic_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu topic_id"
            });
        }

        const parsedTopicId = Number(topic_id);
        if (!Number.isInteger(parsedTopicId) || parsedTopicId <= 0) {
            return res.status(400).json({
                success: false,
                message: "topic_id không hợp lệ"
            });
        }

        // Kiểm tra Topic tồn tại
        const topic = await Topic.findById(parsedTopicId);
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic không tồn tại"
            });
        }

        // Validate word (bắt buộc)
        if (word === undefined || word === null || typeof word !== "string" || word.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu word"
            });
        }

        const trimmedWord = word.trim();

        // Validate meaning (bắt buộc)
        if (meaning === undefined || meaning === null || typeof meaning !== "string" || meaning.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu meaning"
            });
        }

        const trimmedMeaning = meaning.trim();

        // Validate pronunciation (tùy chọn, string hoặc null)
        if (pronunciation !== undefined && pronunciation !== null && typeof pronunciation !== "string") {
            return res.status(400).json({
                success: false,
                message: "pronunciation phải là chuỗi hoặc null"
            });
        }

        // Validate part_of_speech (tùy chọn, mặc định 'other')
        const validPos = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'phrasal_verb', 'idiom', 'other'];
        let pos = 'other';
        if (part_of_speech !== undefined && part_of_speech !== null && part_of_speech !== "") {
            if (!validPos.includes(part_of_speech)) {
                return res.status(400).json({
                    success: false,
                    message: "part_of_speech không hợp lệ"
                });
            }
            pos = part_of_speech;
        }

        // Validate example (tùy chọn, string hoặc null)
        if (example !== undefined && example !== null && typeof example !== "string") {
            return res.status(400).json({
                success: false,
                message: "example phải là chuỗi hoặc null"
            });
        }

        // Validate example_meaning (tùy chọn, string hoặc null)
        if (example_meaning !== undefined && example_meaning !== null && typeof example_meaning !== "string") {
            return res.status(400).json({
                success: false,
                message: "example_meaning phải là chuỗi hoặc null"
            });
        }

        // Validate audio (tùy chọn, string hoặc null - chỉ lưu đường dẫn/reference)
        if (audio !== undefined && audio !== null && typeof audio !== "string") {
            return res.status(400).json({
                success: false,
                message: "audio phải là chuỗi hoặc null"
            });
        }

        // Validate image (tùy chọn, string hoặc null - chỉ lưu đường dẫn/reference)
        if (image !== undefined && image !== null && typeof image !== "string") {
            return res.status(400).json({
                success: false,
                message: "image phải là chuỗi hoặc null"
            });
        }

        // Kiểm tra trùng word trong cùng Topic (unique index: topic_id + word)
        const existing = await Vocabulary.findByTopicAndWord(parsedTopicId, trimmedWord);
        if (existing) {
            return res.status(400).json({
                success: false,
                message: "Từ vựng đã tồn tại trong Topic này"
            });
        }

        // Gọi Model để tạo dữ liệu
        const result = await Vocabulary.create({
            topic_id: parsedTopicId,
            word: trimmedWord,
            pronunciation: pronunciation !== undefined && pronunciation !== null ? pronunciation : null,
            part_of_speech: pos,
            meaning: trimmedMeaning,
            example: example !== undefined && example !== null ? example : null,
            example_meaning: example_meaning !== undefined && example_meaning !== null ? example_meaning : null,
            audio: audio !== undefined && audio !== null ? audio : null,
            image: image !== undefined && image !== null ? image : null
        });

        const newVocabulary = await Vocabulary.findByIdForAdmin(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Tạo Vocabulary thành công",
            data: newVocabulary
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
 * Cập nhật Vocabulary theo id
 * PUT /api/admin/vocabularies/:id
 * Body: { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image }
 * Hỗ trợ partial update: giữ nguyên giá trị cũ nếu field không được gửi
 */
const updateVocabulary = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra Vocabulary tồn tại
        const existing = await Vocabulary.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        const { topic_id, word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image } = req.body;

        // Validate topic_id (nếu có)
        let updatedTopicId = existing.topic_id;
        if (topic_id !== undefined) {
            if (topic_id === null || topic_id === "") {
                return res.status(400).json({
                    success: false,
                    message: "topic_id không được để null"
                });
            }
            const parsedNewTopicId = Number(topic_id);
            if (!Number.isInteger(parsedNewTopicId) || parsedNewTopicId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "topic_id không hợp lệ"
                });
            }
            // Kiểm tra Topic mới tồn tại
            const topic = await Topic.findById(parsedNewTopicId);
            if (!topic) {
                return res.status(400).json({
                    success: false,
                    message: "Topic không tồn tại"
                });
            }
            updatedTopicId = parsedNewTopicId;
        }

        // Validate word (nếu có)
        let updatedWord = existing.word;
        if (word !== undefined) {
            if (word === null || typeof word !== "string" || word.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "word phải là chuỗi không rỗng"
                });
            }
            updatedWord = word.trim();

            // Kiểm tra trùng word trong cùng Topic (loại trừ chính Vocabulary đang cập nhật)
            const existingByWord = await Vocabulary.findByTopicAndWord(updatedTopicId, updatedWord, parsedId);
            if (existingByWord) {
                return res.status(400).json({
                    success: false,
                    message: "Từ vựng đã tồn tại trong Topic này"
                });
            }
        }

        // Validate pronunciation (nếu có, cho phép null để xóa giá trị)
        let updatedPronunciation = existing.pronunciation;
        if (pronunciation !== undefined) {
            if (pronunciation !== null && typeof pronunciation !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "pronunciation phải là chuỗi hoặc null"
                });
            }
            updatedPronunciation = pronunciation;
        }

        // Validate part_of_speech (nếu có)
        const validPos = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'phrasal_verb', 'idiom', 'other'];
        let updatedPos = existing.part_of_speech;
        if (part_of_speech !== undefined && part_of_speech !== null && part_of_speech !== "") {
            if (!validPos.includes(part_of_speech)) {
                return res.status(400).json({
                    success: false,
                    message: "part_of_speech không hợp lệ"
                });
            }
            updatedPos = part_of_speech;
        }

        // Validate meaning (nếu có)
        let updatedMeaning = existing.meaning;
        if (meaning !== undefined) {
            if (meaning === null || typeof meaning !== "string" || meaning.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "meaning phải là chuỗi không rỗng"
                });
            }
            updatedMeaning = meaning.trim();
        }

        // Validate example (nếu có, cho phép null để xóa giá trị)
        let updatedExample = existing.example;
        if (example !== undefined) {
            if (example !== null && typeof example !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "example phải là chuỗi hoặc null"
                });
            }
            updatedExample = example;
        }

        // Validate example_meaning (nếu có, cho phép null để xóa giá trị)
        let updatedExampleMeaning = existing.example_meaning;
        if (example_meaning !== undefined) {
            if (example_meaning !== null && typeof example_meaning !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "example_meaning phải là chuỗi hoặc null"
                });
            }
            updatedExampleMeaning = example_meaning;
        }

        // Validate audio (nếu có, cho phép null để xóa giá trị - chỉ lưu đường dẫn/reference)
        let updatedAudio = existing.audio;
        if (audio !== undefined) {
            if (audio !== null && typeof audio !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "audio phải là chuỗi hoặc null"
                });
            }
            updatedAudio = audio;
        }

        // Validate image (nếu có, cho phép null để xóa giá trị - chỉ lưu đường dẫn/reference)
        let updatedImage = existing.image;
        if (image !== undefined) {
            if (image !== null && typeof image !== "string") {
                return res.status(400).json({
                    success: false,
                    message: "image phải là chuỗi hoặc null"
                });
            }
            updatedImage = image;
        }

        // Gọi Model để cập nhật
        await Vocabulary.update(parsedId, {
            topic_id: updatedTopicId,
            word: updatedWord,
            pronunciation: updatedPronunciation,
            part_of_speech: updatedPos,
            meaning: updatedMeaning,
            example: updatedExample,
            example_meaning: updatedExampleMeaning,
            audio: updatedAudio,
            image: updatedImage
        });

        const updatedVocabulary = await Vocabulary.findByIdForAdmin(parsedId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật Vocabulary thành công",
            data: updatedVocabulary
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
 * Xóa Vocabulary theo id
 * DELETE /api/admin/vocabularies/:id
 */
const deleteVocabulary = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra Vocabulary tồn tại
        const existing = await Vocabulary.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        // Gọi Model để xóa
        const result = await Vocabulary.remove(parsedId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa Vocabulary thành công"
        });
    } catch (err) {
        // Nếu có lỗi ràng buộc khóa ngoại
        if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa Vocabulary vì đang có dữ liệu liên quan"
            });
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Xóa nhiều Vocabulary cùng lúc
 * DELETE /api/admin/vocabularies/bulk
 * Body: { ids: [1, 2, 3] }
 */
const deleteMultipleVocabularies = async (req, res) => {
    try {
        const { ids } = req.body;

        // Validate ids là array
        if (ids === undefined || ids === null || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "ids phải là một mảng"
            });
        }

        // Validate array không rỗng
        if (ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ids không được rỗng"
            });
        }

        // Validate tất cả phần tử là số nguyên dương
        for (const id of ids) {
            if (!Number.isInteger(id) || id <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "Vocabulary ID không hợp lệ"
                });
            }
        }

        // Loại bỏ ID trùng lặp
        const uniqueIds = [...new Set(ids)];

        // Kiểm tra tất cả Vocabulary tồn tại
        const existingVocabularies = await Vocabulary.findByIdsForAdmin(uniqueIds);
        if (existingVocabularies.length !== uniqueIds.length) {
            return res.status(404).json({
                success: false,
                message: "Một hoặc nhiều Vocabulary không tồn tại"
            });
        }

        // Gọi Model để xóa nhiều Vocabulary cùng lúc
        const result = await Vocabulary.removeMany(uniqueIds);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa các từ vựng thành công",
            deletedCount: result.affectedRows
        });
    } catch (err) {
        // Nếu có lỗi ràng buộc khóa ngoại
        if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa Vocabulary vì đang có dữ liệu liên quan"
            });
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Import Vocabulary hàng loạt từ file CSV
 * POST /api/admin/vocabularies/import
 * Multipart/form-data: topic_id (text), file (CSV)
 * CSV có header: word, pronunciation, part_of_speech, meaning, example, example_meaning, audio, image
 * - word, meaning bắt buộc
 * - image, audio tùy chọn, chỉ lưu đường dẫn string (không upload/kiểm tra file)
 * - Dòng không hợp lệ sẽ bị bỏ qua và được báo lỗi theo số dòng
 */
const importVocabularies = async (req, res) => {
    try {
        const { topic_id } = req.body;

        // Validate topic_id (bắt buộc)
        if (topic_id === undefined || topic_id === null || topic_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu topic_id"
            });
        }

        const parsedTopicId = Number(topic_id);
        if (!Number.isInteger(parsedTopicId) || parsedTopicId <= 0) {
            return res.status(400).json({
                success: false,
                message: "topic_id không hợp lệ"
            });
        }

        // Kiểm tra Topic tồn tại
        const topic = await Topic.findById(parsedTopicId);
        if (!topic) {
            return res.status(400).json({
                success: false,
                message: "Topic không tồn tại"
            });
        }

        // Kiểm tra file CSV đã được upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Không có file CSV nào được tải lên"
            });
        }

        // Parse CSV (header là dòng đầu tiên)
        let records;
        try {
            records = parse(req.file.buffer.toString("utf8"), {
                columns: true,
                skip_empty_lines: true,
                trim: true
            });
        } catch (err) {
            return res.status(400).json({
                success: false,
                message: "File CSV không hợp lệ"
            });
        }

        const validPos = ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'phrasal_verb', 'idiom', 'other'];
        const validRows = [];
        const errors = [];
        const seenWords = new Set();

        for (let i = 0; i < records.length; i++) {
            const row = records[i];
            const lineNumber = i + 2; // Dòng 1 là header
            const rowErrors = [];

            // word (bắt buộc)
            const word = row.word !== undefined && row.word !== null ? String(row.word).trim() : "";
            if (!word) {
                rowErrors.push("Thiếu word");
            }

            // meaning (bắt buộc)
            const meaning = row.meaning !== undefined && row.meaning !== null ? String(row.meaning).trim() : "";
            if (!meaning) {
                rowErrors.push("Thiếu meaning");
            }

            // part_of_speech (tùy chọn, mặc định 'other')
            let pos = "other";
            if (row.part_of_speech !== undefined && row.part_of_speech !== null && String(row.part_of_speech).trim() !== "") {
                const rawPos = String(row.part_of_speech).trim();
                if (!validPos.includes(rawPos)) {
                    rowErrors.push("part_of_speech không hợp lệ");
                } else {
                    pos = rawPos;
                }
            }

            // Các trường tùy chọn: chỉ lưu đường dẫn string, rỗng -> null
            const pronunciation = row.pronunciation !== undefined && row.pronunciation !== null && String(row.pronunciation).trim() !== ""
                ? String(row.pronunciation).trim()
                : null;
            const example = row.example !== undefined && row.example !== null && String(row.example).trim() !== ""
                ? String(row.example).trim()
                : null;
            const example_meaning = row.example_meaning !== undefined && row.example_meaning !== null && String(row.example_meaning).trim() !== ""
                ? String(row.example_meaning).trim()
                : null;
            const audio = row.audio !== undefined && row.audio !== null && String(row.audio).trim() !== ""
                ? String(row.audio).trim()
                : null;
            const image = row.image !== undefined && row.image !== null && String(row.image).trim() !== ""
                ? String(row.image).trim()
                : null;

            // Kiểm tra trùng word trong cùng topic (unique index: topic_id + word)
            if (word) {
                if (seenWords.has(word)) {
                    rowErrors.push("Từ vựng trùng lặp trong file CSV");
                } else {
                    const existing = await Vocabulary.findByTopicAndWord(parsedTopicId, word);
                    if (existing) {
                        rowErrors.push("Từ vựng đã tồn tại trong Topic này");
                    }
                }
            }

            if (rowErrors.length > 0) {
                errors.push({
                    line: lineNumber,
                    errors: rowErrors
                });
            } else {
                seenWords.add(word);
                validRows.push({
                    topic_id: parsedTopicId,
                    word,
                    pronunciation,
                    part_of_speech: pos,
                    meaning,
                    example,
                    example_meaning,
                    audio,
                    image
                });
            }
        }

        // Import tất cả dòng hợp lệ
        let importedCount = 0;
        if (validRows.length > 0) {
            const result = await Vocabulary.createMany(validRows);
            importedCount = result.affectedRows;
        }

        return res.status(200).json({
            success: true,
            message: "Import hoàn tất",
            data: {
                imported: importedCount,
                errors
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
 * Upload image cho Roadmap
 * POST /api/admin/roadmaps/:id/image
 * File: image (JPG/JPEG/PNG, tối đa 5MB)
 */
const uploadRoadmapImage = async (req, res) => {
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

        // Kiểm tra file đã được upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Không có file nào được tải lên"
            });
        }

        // Cập nhật đường dẫn file vào database
        const filePath = `/uploads/images/${req.file.filename}`;
        await Roadmap.updateImage(parsedId, filePath);

        const updated = await Roadmap.findById(parsedId);

        return res.status(200).json({
            success: true,
            message: "Upload ảnh thành công",
            data: {
                image: filePath,
                roadmap: updated
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
 * Upload image cho Topic
 * POST /api/admin/topics/:id/image
 * File: image (JPG/JPEG/PNG, tối đa 5MB)
 */
const uploadTopicImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Topic ID không hợp lệ"
            });
        }

        // Kiểm tra Topic tồn tại
        const existing = await Topic.findById(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Topic không tồn tại"
            });
        }

        // Kiểm tra file đã được upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Không có file nào được tải lên"
            });
        }

        // Cập nhật đường dẫn file vào database
        const filePath = `/uploads/images/${req.file.filename}`;
        await Topic.updateImage(parsedId, filePath);

        const updated = await Topic.findById(parsedId);

        return res.status(200).json({
            success: true,
            message: "Upload ảnh thành công",
            data: {
                image: filePath,
                topic: updated
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
 * Upload image cho Vocabulary
 * POST /api/admin/vocabularies/:id/image
 * File: image (JPG/JPEG/PNG, tối đa 5MB)
 */
const uploadVocabularyImage = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra Vocabulary tồn tại
        const existing = await Vocabulary.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        // Kiểm tra file đã được upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Không có file nào được tải lên"
            });
        }

        // Cập nhật đường dẫn file vào database
        const filePath = `/uploads/images/${req.file.filename}`;
        await Vocabulary.updateImage(parsedId, filePath);

        const updated = await Vocabulary.findByIdForAdmin(parsedId);

        return res.status(200).json({
            success: true,
            message: "Upload ảnh thành công",
            data: {
                image: filePath,
                vocabulary: updated
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
 * Upload audio cho Vocabulary
 * POST /api/admin/vocabularies/:id/audio
 * File: audio (MP3, tối đa 2MB)
 */
const uploadVocabularyAudio = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary ID không hợp lệ"
            });
        }

        // Kiểm tra Vocabulary tồn tại
        const existing = await Vocabulary.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        // Kiểm tra file đã được upload
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: "Không có file nào được tải lên"
            });
        }

        // Cập nhật đường dẫn file vào database
        const filePath = `/uploads/audio/${req.file.filename}`;
        await Vocabulary.updateAudio(parsedId, filePath);

        const updated = await Vocabulary.findByIdForAdmin(parsedId);

        return res.status(200).json({
            success: true,
            message: "Upload âm thanh thành công",
            data: {
                audio: filePath,
                vocabulary: updated
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
 * Lấy danh sách tất cả Custom Question cho Admin
 * Hỗ trợ lọc theo vocabulary_id
 * GET /api/admin/custom-questions
 * Query: vocabulary_id (optional)
 */
const getAllCustomQuestions = async (req, res) => {
    try {
        const { vocabulary_id } = req.query;

        let vocabularyId = null;

        if (vocabulary_id !== undefined) {
            vocabularyId = Number(vocabulary_id);

            if (!Number.isInteger(vocabularyId) || vocabularyId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "vocabulary_id không hợp lệ"
                });
            }
        }

        const customQuestions = await CustomQuestion.getAllForAdmin(vocabularyId);

        return res.status(200).json({
            success: true,
            data: customQuestions
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
 * Lấy Custom Question theo id cho Admin
 * GET /api/admin/custom-questions/:id
 */
const getCustomQuestionById = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Custom Question ID không hợp lệ"
            });
        }

        // Kiểm tra Custom Question tồn tại
        const customQuestion = await CustomQuestion.findByIdForAdmin(parsedId);
        if (!customQuestion) {
            return res.status(404).json({
                success: false,
                message: "Custom Question không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            data: customQuestion
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
 * Tạo Custom Question mới
 * POST /api/admin/custom-questions
 * Body: { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }
 */
const createCustomQuestion = async (req, res) => {
    try {
        const { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active } = req.body;

        // Validate vocabulary_id (bắt buộc)
        if (vocabulary_id === undefined || vocabulary_id === null || vocabulary_id === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu vocabulary_id"
            });
        }

        const parsedVocabularyId = Number(vocabulary_id);
        if (!Number.isInteger(parsedVocabularyId) || parsedVocabularyId <= 0) {
            return res.status(400).json({
                success: false,
                message: "vocabulary_id không hợp lệ"
            });
        }

        // Kiểm tra Vocabulary tồn tại
        const vocabulary = await Vocabulary.findByIdForAdmin(parsedVocabularyId);
        if (!vocabulary) {
            return res.status(400).json({
                success: false,
                message: "Vocabulary không tồn tại"
            });
        }

        // Validate question (bắt buộc)
        if (question === undefined || question === null || typeof question !== "string" || question.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu question"
            });
        }

        const trimmedQuestion = question.trim();

        // Validate option_a (bắt buộc)
        if (option_a === undefined || option_a === null || typeof option_a !== "string" || option_a.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu option_a"
            });
        }

        const trimmedOptionA = option_a.trim();

        // Validate option_b (bắt buộc)
        if (option_b === undefined || option_b === null || typeof option_b !== "string" || option_b.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu option_b"
            });
        }

        const trimmedOptionB = option_b.trim();

        // Validate option_c (bắt buộc)
        if (option_c === undefined || option_c === null || typeof option_c !== "string" || option_c.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu option_c"
            });
        }

        const trimmedOptionC = option_c.trim();

        // Validate option_d (bắt buộc)
        if (option_d === undefined || option_d === null || typeof option_d !== "string" || option_d.trim() === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu option_d"
            });
        }

        const trimmedOptionD = option_d.trim();

        // Validate correct_option (bắt buộc, chỉ nhận A/B/C/D)
        if (correct_option === undefined || correct_option === null || correct_option === "") {
            return res.status(400).json({
                success: false,
                message: "Thiếu correct_option"
            });
        }

        const normalizedCorrectOption = String(correct_option).trim().toUpperCase();
        if (!["A", "B", "C", "D"].includes(normalizedCorrectOption)) {
            return res.status(400).json({
                success: false,
                message: "correct_option chỉ nhận A, B, C hoặc D"
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

        // Gọi Model để tạo dữ liệu
        const result = await CustomQuestion.create({
            vocabulary_id: parsedVocabularyId,
            question: trimmedQuestion,
            option_a: trimmedOptionA,
            option_b: trimmedOptionB,
            option_c: trimmedOptionC,
            option_d: trimmedOptionD,
            correct_option: normalizedCorrectOption,
            is_active: active
        });

        const newCustomQuestion = await CustomQuestion.findByIdForAdmin(result.insertId);

        return res.status(201).json({
            success: true,
            message: "Tạo Custom Question thành công",
            data: newCustomQuestion
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
 * Cập nhật Custom Question theo id
 * PUT /api/admin/custom-questions/:id
 * Body: { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active }
 * Hỗ trợ partial update: giữ nguyên giá trị cũ nếu field không được gửi
 */
const updateCustomQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Custom Question ID không hợp lệ"
            });
        }

        // Kiểm tra Custom Question tồn tại
        const existing = await CustomQuestion.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Custom Question không tồn tại"
            });
        }

        const { vocabulary_id, question, option_a, option_b, option_c, option_d, correct_option, is_active } = req.body;

        // Validate vocabulary_id (nếu có)
        let updatedVocabularyId = existing.vocabulary_id;
        if (vocabulary_id !== undefined) {
            if (vocabulary_id === null || vocabulary_id === "") {
                return res.status(400).json({
                    success: false,
                    message: "vocabulary_id không được để null"
                });
            }
            const parsedNewVocabularyId = Number(vocabulary_id);
            if (!Number.isInteger(parsedNewVocabularyId) || parsedNewVocabularyId <= 0) {
                return res.status(400).json({
                    success: false,
                    message: "vocabulary_id không hợp lệ"
                });
            }
            // Kiểm tra Vocabulary mới tồn tại
            const vocabulary = await Vocabulary.findByIdForAdmin(parsedNewVocabularyId);
            if (!vocabulary) {
                return res.status(400).json({
                    success: false,
                    message: "Vocabulary không tồn tại"
                });
            }
            updatedVocabularyId = parsedNewVocabularyId;
        }

        // Validate question (nếu có)
        let updatedQuestion = existing.question;
        if (question !== undefined) {
            if (question === null || typeof question !== "string" || question.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "question phải là chuỗi không rỗng"
                });
            }
            updatedQuestion = question.trim();
        }

        // Validate option_a (nếu có)
        let updatedOptionA = existing.option_a;
        if (option_a !== undefined) {
            if (option_a === null || typeof option_a !== "string" || option_a.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "option_a phải là chuỗi không rỗng"
                });
            }
            updatedOptionA = option_a.trim();
        }

        // Validate option_b (nếu có)
        let updatedOptionB = existing.option_b;
        if (option_b !== undefined) {
            if (option_b === null || typeof option_b !== "string" || option_b.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "option_b phải là chuỗi không rỗng"
                });
            }
            updatedOptionB = option_b.trim();
        }

        // Validate option_c (nếu có)
        let updatedOptionC = existing.option_c;
        if (option_c !== undefined) {
            if (option_c === null || typeof option_c !== "string" || option_c.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "option_c phải là chuỗi không rỗng"
                });
            }
            updatedOptionC = option_c.trim();
        }

        // Validate option_d (nếu có)
        let updatedOptionD = existing.option_d;
        if (option_d !== undefined) {
            if (option_d === null || typeof option_d !== "string" || option_d.trim() === "") {
                return res.status(400).json({
                    success: false,
                    message: "option_d phải là chuỗi không rỗng"
                });
            }
            updatedOptionD = option_d.trim();
        }

        // Validate correct_option (nếu có, chỉ nhận A/B/C/D)
        let updatedCorrectOption = existing.correct_option;
        if (correct_option !== undefined) {
            if (correct_option === null || correct_option === "") {
                return res.status(400).json({
                    success: false,
                    message: "correct_option không được để null"
                });
            }
            const normalizedCorrectOption = String(correct_option).trim().toUpperCase();
            if (!["A", "B", "C", "D"].includes(normalizedCorrectOption)) {
                return res.status(400).json({
                    success: false,
                    message: "correct_option chỉ nhận A, B, C hoặc D"
                });
            }
            updatedCorrectOption = normalizedCorrectOption;
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

        // Gọi Model để cập nhật
        await CustomQuestion.update(parsedId, {
            vocabulary_id: updatedVocabularyId,
            question: updatedQuestion,
            option_a: updatedOptionA,
            option_b: updatedOptionB,
            option_c: updatedOptionC,
            option_d: updatedOptionD,
            correct_option: updatedCorrectOption,
            is_active: updatedActive
        });

        const updatedCustomQuestion = await CustomQuestion.findByIdForAdmin(parsedId);

        return res.status(200).json({
            success: true,
            message: "Cập nhật Custom Question thành công",
            data: updatedCustomQuestion
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
 * Xóa Custom Question theo id
 * DELETE /api/admin/custom-questions/:id
 */
const deleteCustomQuestion = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate id là số nguyên dương
        const parsedId = Number(id);
        if (!Number.isInteger(parsedId) || parsedId <= 0) {
            return res.status(400).json({
                success: false,
                message: "Custom Question ID không hợp lệ"
            });
        }

        // Kiểm tra Custom Question tồn tại
        const existing = await CustomQuestion.findByIdForAdmin(parsedId);
        if (!existing) {
            return res.status(404).json({
                success: false,
                message: "Custom Question không tồn tại"
            });
        }

        // Gọi Model để xóa
        const result = await CustomQuestion.remove(parsedId);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Custom Question không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa Custom Question thành công"
        });
    } catch (err) {
        // Nếu có lỗi ràng buộc khóa ngoại (VD: đã được gắn vào Quiz)
        if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa Custom Question vì đang có dữ liệu liên quan"
            });
        }

        console.error(err);
        return res.status(500).json({
            success: false,
            message: "Lỗi máy chủ"
        });
    }
};

/**
 * Xóa nhiều Custom Question cùng lúc
 * DELETE /api/admin/custom-questions/bulk
 * Body: { ids: [1, 2, 3] }
 */
const bulkDeleteCustomQuestions = async (req, res) => {
    try {
        const { ids } = req.body;

        // Validate ids là array
        if (ids === undefined || ids === null || !Array.isArray(ids)) {
            return res.status(400).json({
                success: false,
                message: "ids phải là một mảng"
            });
        }

        // Validate array không rỗng
        if (ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: "ids không được rỗng"
            });
        }

        // Chuyển các ID về Number, loại bỏ ID không hợp lệ và ID trùng
        const validIds = [...new Set(
            ids
                .map((id) => Number(id))
                .filter((id) => Number.isInteger(id) && id > 0)
        )];

        // Nếu sau validation không còn ID hợp lệ
        if (validIds.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Custom Question ID không hợp lệ"
            });
        }

        // Kiểm tra tất cả Custom Question tồn tại
        const existingCustomQuestions = await CustomQuestion.findByIdsForAdmin(validIds);
        if (existingCustomQuestions.length !== validIds.length) {
            return res.status(404).json({
                success: false,
                message: "Một hoặc nhiều Custom Question không tồn tại"
            });
        }

        // Gọi Model để xóa nhiều Custom Question cùng lúc
        const result = await CustomQuestion.removeMany(validIds);

        if (result.affectedRows === 0) {
            return res.status(404).json({
                success: false,
                message: "Custom Question không tồn tại"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Xóa các câu hỏi tùy chỉnh thành công",
            deletedCount: result.affectedRows
        });
    } catch (err) {
        // Nếu có lỗi ràng buộc khóa ngoại
        if (err.code === "ER_ROW_IS_REFERENCED_2" || err.code === "ER_ROW_IS_REFERENCED") {
            return res.status(400).json({
                success: false,
                message: "Không thể xóa Custom Question vì đang có dữ liệu liên quan"
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
    deleteRoadmap,
    getAllTopics,
    createTopic,
    updateTopic,
    deleteTopic,
    getAllVocabularies,
    createVocabulary,
    updateVocabulary,
    deleteVocabulary,
    deleteMultipleVocabularies,
    importVocabularies,
    uploadRoadmapImage,
    uploadTopicImage,
    uploadVocabularyImage,
    uploadVocabularyAudio,
    getAllCustomQuestions,
    getCustomQuestionById,
    createCustomQuestion,
    updateCustomQuestion,
    deleteCustomQuestion,
    bulkDeleteCustomQuestions
};
