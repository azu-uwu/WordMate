const pool = require("../../config/db");

/**
 * Xây dựng mảng conditions và params cho WHERE clause.
 * Điều kiện cơ bản luôn bao gồm:
 *   - uv.user_id = userId (đảm bảo chỉ lấy dữ liệu của user hiện tại)
 *   - uv.status IN ('learning', 'mastered') (không lấy status 'new')
 *
 * Điều kiện tùy chọn:
 *   - search: tìm kiếm trên v.word và v.meaning (LIKE)
 *   - topicId: lọc theo topic (t.id = ?)
 *   - status: lọc theo status cụ thể (uv.status = ?)
 *
 * Hàm này đảm bảo điều kiện WHERE của getAll() và getTotal() nhất quán.
 *
 * @param {number} userId - ID người dùng
 * @param {object} filters - { search, topicId, status }
 * @returns {{ conditions: string[], params: any[] }}
 */
function buildWhereClause(userId, { search, topicId, status }) {
    const conditions = ["uv.user_id = ?", "uv.status IN ('learning', 'mastered')"];
    const params = [userId];

    if (search) {
        conditions.push("(v.word LIKE ? OR v.meaning LIKE ?)");
        params.push(`%${search}%`, `%${search}%`);
    }

    if (topicId) {
        conditions.push("t.id = ?");
        params.push(topicId);
    }

    if (status) {
        conditions.push("uv.status = ?");
        params.push(status);
    }

    return { conditions, params };
}

/**
 * Lấy danh sách từ vựng trong sổ tay của user (có phân trang).
 * JOIN user_vocabularies + vocabularies + topics.
 * Chỉ lấy status 'learning' hoặc 'mastered'.
 * Không phụ thuộc roadmap.
 *
 * @param {number} userId - ID người dùng
 * @param {object} options - { search, topicId, status, page, limit }
 * @returns {Promise<object[]>} Danh sách từ vựng
 */
const getAll = async (userId, { search, topicId, status, page, limit }) => {
    const { conditions, params } = buildWhereClause(userId, { search, topicId, status });

    const offset = (page - 1) * limit;

    const [rows] = await pool.query(
        `SELECT 
            uv.id,
            uv.user_id,
            uv.vocabulary_id,
            uv.status,
            uv.review_count,
            uv.last_reviewed_at,
            uv.next_review_at,
            v.word,
            v.pronunciation,
            v.part_of_speech,
            v.meaning,
            v.example,
            v.example_meaning,
            v.audio,
            v.image,
            v.topic_id,
            t.name AS topic_name
        FROM user_vocabularies uv
        INNER JOIN vocabularies v ON v.id = uv.vocabulary_id
        INNER JOIN topics t ON t.id = v.topic_id
        WHERE ${conditions.join(" AND ")}
        ORDER BY uv.id ASC
        LIMIT ? OFFSET ?`,
        [...params, limit, offset]
    );
    return rows;
};

/**
 * Đếm tổng số từ vựng trong sổ tay của user (phục vụ pagination).
 * Sử dụng cùng điều kiện lọc với getAll().
 *
 * @param {number} userId - ID người dùng
 * @param {object} options - { search, topicId, status }
 * @returns {Promise<number>} Tổng số kết quả
 */
const getTotal = async (userId, { search, topicId, status }) => {
    const { conditions, params } = buildWhereClause(userId, { search, topicId, status });

    const [rows] = await pool.execute(
        `SELECT COUNT(*) AS total
        FROM user_vocabularies uv
        INNER JOIN vocabularies v ON v.id = uv.vocabulary_id
        INNER JOIN topics t ON t.id = v.topic_id
        WHERE ${conditions.join(" AND ")}`,
        params
    );
    return rows[0].total;
};

/**
 * Đưa vocabulary của user từ trạng thái 'mastered' về 'learning' để ôn tập lại.
 * Chỉ update khi bản ghi đồng thời thỏa:
 *   - user_id = userId (bảo vệ dữ liệu user, không cho user A sửa từ của user B)
 *   - vocabulary_id = vocabularyId
 *   - status = 'mastered' (chỉ từ đã thuộc mới được đưa về luyện tập)
 *
 * SET:
 *   - status = 'learning'
 *   - next_review_at = NOW()
 *
 * Không thay đổi review_count, last_reviewed_at hay các field khác.
 *
 * @param {number} userId - ID người dùng
 * @param {number} vocabularyId - ID từ vựng
 * @returns {Promise<object>} Kết quả UPDATE (chứa affectedRows)
 */
const reviewVocabulary = async (userId, vocabularyId) => {
    const [result] = await pool.execute(
        `UPDATE user_vocabularies
         SET
            status = 'learning',
            next_review_at = NOW()
         WHERE
            user_id = ?
            AND vocabulary_id = ?
            AND status = 'mastered'`,
        [userId, vocabularyId]
    );
    return result;
};

/**
 * Kiểm tra vocabulary có tồn tại trong bảng vocabularies hay không.
 * Dùng để phân biệt lỗi "không tồn tại" khi UPDATE reviewVocabulary không ảnh hưởng row nào.
 *
 * @param {number} vocabularyId - ID từ vựng
 * @returns {Promise<object|null>} Bản ghi vocabulary hoặc null
 */
const findVocabularyById = async (vocabularyId) => {
    const [rows] = await pool.execute(
        "SELECT id FROM vocabularies WHERE id = ?",
        [vocabularyId]
    );
    return rows[0] || null;
};

/**
 * Kiểm tra bản ghi user_vocabularies của user theo vocabulary_id.
 * Dùng để phân biệt lỗi "không thuộc user" khi UPDATE reviewVocabulary không ảnh hưởng row nào.
 *
 * @param {number} userId - ID người dùng
 * @param {number} vocabularyId - ID từ vựng
 * @returns {Promise<object|null>} Bản ghi user_vocabularies hoặc null
 */
const findUserVocabulary = async (userId, vocabularyId) => {
    const [rows] = await pool.execute(
        "SELECT id, status FROM user_vocabularies WHERE user_id = ? AND vocabulary_id = ?",
        [userId, vocabularyId]
    );
    return rows[0] || null;
};

module.exports = {
    getAll,
    getTotal,
    reviewVocabulary,
    findVocabularyById,
    findUserVocabulary
};
