/**
 * Quiz Page - WordMate
 *
 * Handles the multiple-choice Quiz flow.
 *
 * Flow:
 * 1. Check authentication and load shared components
 * 2. Call GET /api/quiz/continue to detect an incomplete quiz
 *    - Incomplete quiz → show Continue state (no "Bắt đầu Quiz mới")
 *    - No incomplete quiz → show Start state
 * 3. "Bắt đầu ôn tập" → POST /api/quiz/start, store quiz_id + questions, show first question
 * 4. Render a question (WORD_TO_MEANING / MEANING_TO_WORD / FILL_IN_BLANK) with 4 options
 * 5. On option click → POST /api/quiz/answer { attemptId, questionId, userAnswer }
 *    - isCorrect=true  → highlight answer Emerald-500 + correct feedback
 *    - isCorrect=false → highlight user answer Rose-500 + show correct answer from Backend
 * 6. "Câu tiếp theo" → next question, update progress
 * 7. Last question → POST /api/quiz/complete { attemptId, duration }, show Result state
 * 8. "Bắt đầu Quiz mới" (only after completion) → POST /api/quiz/start again
 *
 * Backend is the only source of truth for correctness / scoring / SRS.
 * Frontend never sends correctAnswer or isCorrect.
 */

import api from '../../services/api.js';
import * as authService from '../../services/authService.js';
import { loadAllComponents } from '../../js/components/nav.js';

// ============================================================
// CONSTANTS
// ============================================================

/** Default quiz subtitle (matches quiz.html) */
const DEFAULT_SUBTITLE = 'Kiểm tra và củng cố vốn từ vựng của bạn';

/** Loading message shown while an API call is in flight */
const LOADING_MESSAGE = 'Đang tải...';

/** Question type metadata: badge icon + label */
const QUESTION_TYPE_META = {
    WORD_TO_MEANING: { icon: 'fa-language', label: 'Word → Meaning' },
    MEANING_TO_WORD: { icon: 'fa-language', label: 'Meaning → Word' },
    FILL_IN_BLANK: { icon: 'fa-pen-to-square', label: 'Fill in the blank' }
};

/** Fallback metadata for unknown question types */
const FALLBACK_META = { icon: 'fa-question', label: 'Câu hỏi' };

/** Option letters shown next to each choice */
const OPTION_LETTERS = ['A', 'B', 'C', 'D'];

// ============================================================
// DOM ELEMENTS
// ============================================================

const quizSubtitle = document.querySelector('.quiz-subtitle');

// States
const startState = document.getElementById('quiz-start-state');
const continueState = document.getElementById('quiz-continue-state');
const questionState = document.getElementById('quiz-question-state');
const resultState = document.getElementById('quiz-result-state');

// Start
const btnStart = startState.querySelector('.btn-quiz-primary');

// Continue
const btnContinue = continueState.querySelector('.btn-quiz-primary');
const continueCount = continueState.querySelector('.quiz-continue-progress-count');
const continueBarWrapper = continueState.querySelector('.progress-bar-wrapper');
const continueBarFill = continueState.querySelector('.progress-bar-fill');

// Question
const questionProgressCount = questionState.querySelector('.quiz-progress-count');
const questionProgressWrapper = questionState.querySelector('.progress-bar-wrapper');
const questionProgressFill = questionState.querySelector('.progress-bar-fill');

// All question templates inside the question card (we hide all but the working one)
const questionElements = questionState.querySelectorAll('.quiz-question');

// Working template: the FILL_IN_BLANK block has a clean listener-ready structure
const workingQuestion = questionState.querySelector('.quiz-question[data-question-type="FILL_IN_BLANK"]');
const workingBadge = workingQuestion.querySelector('.quiz-question-type-badge');
const workingQuestionText = workingQuestion.querySelector('.quiz-question-text');
const workingOptions = workingQuestion.querySelectorAll('.quiz-option');
const workingFeedbackCorrect = workingQuestion.querySelector('.quiz-feedback.is-correct');
const workingFeedbackIncorrect = workingQuestion.querySelector('.quiz-feedback.is-incorrect');
const workingFeedbackCorrectText = workingFeedbackCorrect.querySelector('span');
const workingFeedbackIncorrectText = workingFeedbackIncorrect.querySelector('span');
const workingNextBtn = workingQuestion.querySelector('.quiz-question-actions .btn-quiz-primary');

// Result
const resultScore = resultState.querySelector('.quiz-result-score-value');
const resultScoreMax = resultState.querySelector('.quiz-result-score-unit');
const correctStat = resultState.querySelector('.quiz-result-stat-correct');
const timeStat = resultState.querySelectorAll('.quiz-result-stat-value')[1];
const btnNewQuiz = resultState.querySelector('.btn-quiz-primary');

// ============================================================
// STATE
// ============================================================

let quizId = null;
let questions = [];
let currentIndex = 0;
let totalQuestions = 0;

let isAnswering = false;
let isSubmittingComplete = false;

// Duration tracking (seconds)
let elapsedBefore = 0;
let startTime = null;

// Data for the Continue card before the user clicks "Tiếp tục"
let pendingContinueData = null;

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * Check if user is authenticated.
 * Redirects to login page if not authenticated.
 * @returns {boolean}
 */
function checkAuth() {
    if (!authService.isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// ============================================================
// STATE VIEW HELPERS
// ============================================================

/**
 * Hide all quiz states.
 */
function hideAllStates() {
    startState.hidden = true;
    continueState.hidden = true;
    questionState.hidden = true;
    resultState.hidden = true;
}

/**
 * Show the Start state only.
 */
function showStartState() {
    hideAllStates();
    resetLoading();
    startState.hidden = false;
}

/**
 * Enable/disable the primary action buttons and toggle the loading message.
 * @param {boolean} isLoading
 */
function setLoading(isLoading) {
    btnStart.disabled = isLoading;
    btnContinue.disabled = isLoading;
    btnNewQuiz.disabled = isLoading;
    quizSubtitle.textContent = isLoading ? LOADING_MESSAGE : DEFAULT_SUBTITLE;
}

/**
 * Reset the loading state (restore subtitle, enable buttons).
 */
function resetLoading() {
    btnStart.disabled = false;
    btnContinue.disabled = false;
    btnNewQuiz.disabled = false;
    quizSubtitle.textContent = DEFAULT_SUBTITLE;
}

// ============================================================
// ERROR HANDLING
// ============================================================

/**
 * Extract a user-friendly message from an error.
 * @param {Error} error - The caught error
 * @param {string} fallback - Fallback message
 * @returns {string}
 */
function getErrorMessage(error, fallback) {
    return (error && error.message && typeof error.message === 'string') ? error.message : fallback;
}

/**
 * Handle API errors from initialisation flows.
 * On 401 → logout + redirect. Otherwise show the start state and alert the message.
 * @param {Error} error - The caught error
 * @param {string} fallbackMessage - Fallback message
 */
function handleApiError(error, fallbackMessage) {
    if (error && error.status === 401) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return;
    }
    showStartState();
    alert(getErrorMessage(error, fallbackMessage));
}

/**
 * Handle API errors from action flows (answer / complete).
 * Keeps the current quiz state intact.
 * @param {Error} error - The caught error
 * @param {string} fallbackMessage - Fallback message
 */
function handleActionError(error, fallbackMessage) {
    if (error && error.status === 401) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return;
    }
    alert(getErrorMessage(error, fallbackMessage));
}

// ============================================================
// DURATION
// ============================================================

/**
 * Format a duration in seconds to a human-readable string.
 * @param {number} seconds
 * @returns {string}
 */
function formatDuration(seconds) {
    const totalSeconds = Math.max(0, Math.floor(seconds || 0));
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    if (minutes > 0) {
        return `${minutes} phút ${secs} giây`;
    }
    return `${secs} giây`;
}

// ============================================================
// OPTION ICON HELPERS
// ============================================================

/**
 * Add (or update) the state icon on an option button.
 * @param {HTMLElement} btn - The option button
 * @param {string} iconClass - Font Awesome icon class (e.g. 'fa-circle-check')
 */
function addOptionIcon(btn, iconClass) {
    let icon = btn.querySelector('.quiz-option-icon');
    if (!icon) {
        icon = document.createElement('span');
        icon.className = 'quiz-option-icon';
        icon.setAttribute('aria-hidden', 'true');
        btn.appendChild(icon);
    }
    icon.innerHTML = `<i class="fa-solid ${iconClass}"></i>`;
}

/**
 * Remove the state icon from an option button (reset).
 * @param {HTMLElement} btn - The option button
 */
function removeOptionIcon(btn) {
    const icon = btn.querySelector('.quiz-option-icon');
    if (icon) {
        icon.remove();
    }
}

// ============================================================
// QUESTION RENDER
// ============================================================

/**
 * Reset all options to the neutral state.
 */
function resetOptions() {
    workingOptions.forEach((btn) => {
        btn.className = 'quiz-option';
        btn.disabled = false;
        removeOptionIcon(btn);
    });
}

/**
 * Render a question onto the working template.
 * @param {Object} question - Question data from the API
 */
function renderQuestion(question) {
    const meta = QUESTION_TYPE_META[question.question_type] || FALLBACK_META;

    // Hide all question templates, show only the working one
    questionElements.forEach((el) => {
        el.hidden = true;
    });
    workingQuestion.hidden = false;

    // Badge
    workingBadge.innerHTML = `<i class="fa-solid ${meta.icon}" aria-hidden="true"></i> ${meta.label}`;

    // Question text
    workingQuestionText.textContent = question.question || '';

    // Options
    workingOptions.forEach((btn, i) => {
        btn.querySelector('.quiz-option-text').textContent =
            (question.options && question.options[i]) || '';
    });
    resetOptions();

    // Feedback
    workingFeedbackCorrect.hidden = true;
    workingFeedbackIncorrect.hidden = true;

    // Next button label + state
    const isLastQuestion = currentIndex >= questions.length - 1;
    workingNextBtn.querySelector('span').textContent = isLastQuestion ? 'Hoàn thành' : 'Câu tiếp theo';
    workingNextBtn.hidden = true;
    workingNextBtn.disabled = false;
}

// ============================================================
// PROGRESS
// ============================================================

/**
 * Get the current 1-based position of the question within the whole quiz.
 * For continue, uses the question_order returned by the Backend so that
 * an unanswered question in position 3 is shown as "Câu 3", not "Câu 1".
 * @returns {number}
 */
function getCurrentPosition() {
    const question = questions[currentIndex];
    if (question && question.question_order) {
        return question.question_order;
    }
    return currentIndex + 1;
}

/**
 * Update the question progress bar and counter.
 */
function updateProgress() {
    const position = getCurrentPosition();
    const percent = totalQuestions > 0 ? Math.round((position / totalQuestions) * 100) : 0;

    questionProgressCount.textContent = `Câu ${position} / ${totalQuestions}`;
    questionProgressFill.style.width = `${percent}%`;
    questionProgressWrapper.setAttribute('aria-valuenow', String(percent));
}

// ============================================================
// ANSWER HANDLING
// ============================================================

/**
 * Handle an option click.
 * Sends the answer to Backend immediately; Backend decides correctness.
 * @param {Event} event - The click event
 */
async function handleOptionClick(event) {
    if (isAnswering) return;

    const btn = event.currentTarget;
    if (btn.disabled) return;

    const question = questions[currentIndex];
    if (!question) return;

    // Lock the question to prevent duplicate answer requests
    isAnswering = true;
    workingOptions.forEach((b) => {
        b.disabled = true;
    });

    const userAnswer = btn.querySelector('.quiz-option-text').textContent;

    try {
        const response = await api.post('/quiz/answer', {
            attemptId: quizId,
            questionId: question.id,
            userAnswer
        });
        showAnswerResult(btn, response.data);
    } catch (error) {
        // Re-enable options so the user can try again (state is preserved)
        workingOptions.forEach((b) => {
            b.disabled = false;
        });
        console.error('Answer submission error:', error);
        handleActionError(error, 'Không thể gửi câu trả lời. Vui lòng thử lại.');
    } finally {
        isAnswering = false;
    }
}

/**
 * Show the feedback (correct / incorrect) using the Backend response.
 * @param {HTMLElement} selectedBtn - The option the user chose
 * @param {Object} data - The answer API response data
 */
function showAnswerResult(selectedBtn, data) {
    const isCorrect = data.isCorrect === true;
    const correctAnswer = data.correctAnswer;

    // Keep all options locked after answering
    workingOptions.forEach((btn) => {
        btn.disabled = true;
    });

    if (isCorrect) {
        // Highlight the chosen (correct) answer with Emerald-500
        selectedBtn.classList.add('is-correct');
        addOptionIcon(selectedBtn, 'fa-circle-check');

        workingFeedbackIncorrect.hidden = true;
        workingFeedbackCorrectText.textContent = 'Chính xác!';
        workingFeedbackCorrect.hidden = false;
    } else {
        // Highlight the user's wrong choice with Rose-500
        selectedBtn.classList.add('is-incorrect');
        addOptionIcon(selectedBtn, 'fa-circle-xmark');

        // Highlight the correct answer returned by Backend (Emerald-500)
        const correctBtn = Array.from(workingOptions).find(
            (btn) => btn.querySelector('.quiz-option-text').textContent === correctAnswer
        );
        if (correctBtn) {
            correctBtn.classList.add('is-correct-answer');
            addOptionIcon(correctBtn, 'fa-circle-check');
        }

        workingFeedbackCorrect.hidden = true;
        workingFeedbackIncorrectText.textContent = `Sai rồi! Đáp án đúng: ${correctAnswer}`;
        workingFeedbackIncorrect.hidden = false;
    }

    // Allow moving to the next question
    workingNextBtn.hidden = false;
}

// ============================================================
// NEXT QUESTION / COMPLETE
// ============================================================

/**
 * Handle the "Câu tiếp theo" / "Hoàn thành" button.
 */
function handleNext() {
    if (isAnswering) return;

    currentIndex++;

    if (currentIndex >= questions.length) {
        completeQuiz();
    } else {
        renderQuestion(questions[currentIndex]);
        updateProgress();
    }
}

/**
 * Complete the quiz.
 * POST /api/quiz/complete with the duration in seconds.
 * Backend calculates score / correct answers / total questions.
 */
async function completeQuiz() {
    if (isSubmittingComplete) return;
    isSubmittingComplete = true;
    workingNextBtn.disabled = true;

    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    const duration = elapsedSeconds + elapsedBefore;

    try {
        const response = await api.post('/quiz/complete', {
            attemptId: quizId,
            duration
        });
        showResult(response.data);
    } catch (error) {
        console.error('Complete quiz error:', error);
        workingNextBtn.disabled = false;
        handleActionError(error, 'Không thể hoàn thành Quiz. Vui lòng thử lại.');
    } finally {
        isSubmittingComplete = false;
    }
}

// ============================================================
// RESULT
// ============================================================

/**
 * Show the Result state with data returned by the Backend.
 * @param {Object} data - The complete API response data
 */
function showResult(data) {
    resultScore.textContent = data.score;
    resultScoreMax.textContent = `/ ${data.total_questions}`;
    correctStat.textContent = `${data.correct_answers} / ${data.total_questions}`;
    timeStat.innerHTML = `<i class="fa-regular fa-clock" aria-hidden="true"></i> ${formatDuration(data.duration)}`;

    hideAllStates();
    resetLoading();
    resultState.hidden = false;
}

// ============================================================
// QUIZ SETUP
// ============================================================

/**
 * Reset all quiz state fields.
 */
function resetQuizState() {
    quizId = null;
    questions = [];
    currentIndex = 0;
    totalQuestions = 0;
    isAnswering = false;
    isSubmittingComplete = false;
    elapsedBefore = 0;
    startTime = null;
    pendingContinueData = null;
}

/**
 * Configure the quiz session from an API response (start or continue).
 * @param {Object} data - The start/continue API response data
 * @param {Object} [options]
 * @param {boolean} [options.isContinue] - Whether this came from the continue flow
 */
function setupQuiz(data, { isContinue = false } = {}) {
    quizId = data.quiz_id;
    questions = data.questions || [];
    totalQuestions = data.total_questions || questions.length;
    currentIndex = 0;
    isAnswering = false;
    isSubmittingComplete = false;

    // Duration: the Backend continue API does not currently return elapsed
    // duration, so we start timing from now. elapsedBefore stays 0.
    elapsedBefore = 0;
    startTime = Date.now();

    if (questions.length === 0) {
        showStartState();
        return;
    }

    renderQuestion(questions[currentIndex]);
    updateProgress();
    hideAllStates();
    resetLoading();
    questionState.hidden = false;
}

// ============================================================
// START / CONTINUE FLOWS
// ============================================================

/**
 * Start a new quiz.
 * POST /api/quiz/start — Backend generates the questions.
 * If the Backend reports an incomplete quiz, switch to the Continue flow.
 */
async function startNewQuiz() {
    setLoading(true);

    try {
        const response = await api.post('/quiz/start', {});
        const data = response.data;

        // Backend reports an incomplete quiz → do not start a new one
        if (data.hasIncompleteQuiz) {
            await loadContinueState();
            return;
        }

        // No eligible questions → stay on the Start state
        if (data.hasQuestions === false || !data.questions || data.questions.length === 0) {
            showStartState();
            alert(data.message || 'Chưa có từ vựng cần ôn tập.');
            return;
        }

        setupQuiz(data);
    } catch (error) {
        // Backend returns 409 with hasIncompleteQuiz when an attempt is in progress
        if (error && error.status === 409 &&
            error.data && error.data.data && error.data.data.hasIncompleteQuiz) {
            await loadContinueState();
            return;
        }
        console.error('Start quiz error:', error);
        handleApiError(error, 'Không thể bắt đầu Quiz. Vui lòng thử lại.');
    } finally {
        setLoading(false);
    }
}

/**
 * Detect whether a continue response represents an incomplete quiz.
 * The continue API payload contains quiz_id when there is an incomplete quiz,
 * and { hasIncompleteQuiz: false } when there is none.
 * @param {Object} data - The continue API payload
 * @returns {boolean}
 */
function hasIncompleteQuiz(data) {
    return !!(data && data.quiz_id !== undefined);
}

/**
 * Load the Continue state.
 * GET /api/quiz/continue — returns only unanswered questions.
 */
async function loadContinueState() {
    try {
        const response = await api.get('/quiz/continue');
        const data = response.data;

        if (!hasIncompleteQuiz(data)) {
            showStartState();
            return;
        }

        setupContinueState(data);
        hideAllStates();
        resetLoading();
        continueState.hidden = false;
    } catch (error) {
        console.error('Continue quiz error:', error);
        handleApiError(error, 'Không thể tải Quiz. Vui lòng thử lại.');
    }
}

/**
 * Configure the Continue card (progress) with the continue API response.
 * @param {Object} data - The continue API response data
 */
function setupContinueState(data) {
    pendingContinueData = data;

    const done = Math.max(0, (data.total_questions || 0) - (data.remaining_questions || 0));
    const percent = data.total_questions > 0 ? Math.round((done / data.total_questions) * 100) : 0;

    continueCount.textContent = `${done} / ${data.total_questions}`;
    continueBarFill.style.width = `${percent}%`;
    continueBarWrapper.setAttribute('aria-valuenow', String(percent));
}

/**
 * Handle the "Tiếp tục" button on the Continue card.
 * Uses the quiz data already fetched; does NOT create a new quiz.
 */
function handleContinueClick() {
    if (!pendingContinueData) return;
    const data = pendingContinueData;
    pendingContinueData = null;
    setupQuiz(data, { isContinue: true });
}

/**
 * Handle the "Bắt đầu ôn tập" button on the Start state.
 */
function handleStartClick() {
    startNewQuiz();
}

/**
 * Handle the "Bắt đầu Quiz mới" button on the Result state.
 * Only available after a quiz has been completed successfully.
 * Starts a fresh quiz (does not continue the old one).
 */
function handleNewQuiz() {
    resetQuizState();
    startNewQuiz();
}

// ============================================================
// EVENT LISTENERS
// ============================================================

/**
 * Setup event listeners for quiz controls.
 */
function setupEventListeners() {
    btnStart.addEventListener('click', handleStartClick);
    btnContinue.addEventListener('click', handleContinueClick);
    btnNewQuiz.addEventListener('click', handleNewQuiz);

    workingOptions.forEach((btn) => {
        btn.addEventListener('click', handleOptionClick);
    });
    workingNextBtn.addEventListener('click', handleNext);
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the quiz page.
 * Main entry point that orchestrates all loading steps.
 */
async function initQuiz() {
    try {
        // Step 1: Check authentication
        if (!checkAuth()) {
            return;
        }

        // Step 2: Bind event listeners (safe even before API calls)
        setupEventListeners();

        // Step 3: Load shared components (header, bottom-nav)
        await loadAllComponents();

        // Step 4: Check for an incomplete quiz
        // GET /api/quiz/continue — if there is one, show Continue state;
        // otherwise show Start state.
        setLoading(true);
        const response = await api.get('/quiz/continue');
        const data = response.data;

        if (hasIncompleteQuiz(data)) {
            setupContinueState(data);
            hideAllStates();
            continueState.hidden = false;
        } else {
            showStartState();
        }
        resetLoading();

    } catch (error) {
        console.error('Quiz initialization error:', error);
        handleApiError(error, 'Không thể tải Quiz. Vui lòng thử lại.');
    }
}

// ============================================================
// START
// ============================================================

document.addEventListener('DOMContentLoaded', initQuiz);