/**
 * Service tính toán Spaced Repetition (SM-2 đơn giản hóa)
 * Chỉ chứa logic tính toán, không thao tác database.
 */

// Hằng số số ngày chờ đến lần ôn tập tiếp theo theo reviewCount
const REVIEW_INTERVALS_DAYS = {
    0: 1,
    1: 3,
    2: 7,
    3: 14
};

// Số ngày tối đa khi reviewCount >= 4
const MAX_REVIEW_INTERVAL_DAYS = 30;

/**
 * Tính ngày ôn tập tiếp theo dựa trên số lần ôn tập hiện tại.
 *
 * @param {number} reviewCount - Số lần ôn tập hiện tại (>= 0)
 * @returns {Date} Ngày ôn tập tiếp theo
 */
function calculateNextReview(reviewCount) {
    const daysToAdd =
        REVIEW_INTERVALS_DAYS[reviewCount] ??
        MAX_REVIEW_INTERVAL_DAYS;
    const nextReview = new Date();
    nextReview.setDate(nextReview.getDate() + daysToAdd);

    return nextReview;
}

/**
 * Xử lý khi người dùng trả lời đúng.
 * Tăng reviewCount lên 1 và tính ngày ôn tập tiếp theo.
 *
 * @param {number} reviewCount - Số lần ôn tập hiện tại (>= 0)
 * @returns {{ reviewCount: number, nextReviewAt: Date }} Kết quả sau khi trả lời đúng
 */
function handleCorrectAnswer(reviewCount) {
    const nextReviewAt = calculateNextReview(reviewCount);

    return {
        reviewCount: reviewCount + 1,
        nextReviewAt,
    };
}

/**
 * Xử lý khi người dùng trả lời sai.
 * Reset reviewCount về 0 và đặt ngày ôn tập tiếp theo là ngay lập tức.
 *
 * @returns {{ reviewCount: number, nextReviewAt: Date }} Kết quả sau khi trả lời sai
 */
function handleWrongAnswer() {
    const reviewCount = 0;
    const nextReviewAt = new Date();

    return {
        reviewCount,
        nextReviewAt,
    };
}

module.exports = {
    calculateNextReview,
    handleCorrectAnswer,
    handleWrongAnswer,
};