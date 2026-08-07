/**
 * Learn Flashcard Page - WordMate
 *
 * Handles the flashcard learning session for a topic.
 *
 * Flow:
 * 1. Check authentication and load shared components
 * 2. Validate topic_id from URL query parameters
 * 3. Call POST /api/learning/start to load topic + vocabularies
 * 4. Display the first flashcard and update the progress bar
 * 5. Toggle CSS class to flip the flashcard (3D animation handled by CSS from M4-T7)
 * 6. Handle "Đã thuộc" - call POST /api/learning/mastered, move to next vocabulary
 * 7. Handle "Tiếp tục" - call POST /api/learning/writing, show writing exercise placeholder
 * 8. Show completion message when all vocabularies are learned (no navigation)
 */

import api from '../../services/api.js';
import * as authService from '../../services/authService.js';
import { loadAllComponents } from '../../js/components/nav.js';

// ============================================================
// CONSTANTS
// ============================================================

/** CSS class toggled to flip the flashcard (defined in learn.css from M4-T7) */
const FLIP_CLASS = 'is-flipped';

/** Default subtitle text (matches learn.html) */
const DEFAULT_SUBTITLE = 'Nhấn vào thẻ để xem nghĩa của từ';

// ============================================================
// DOM ELEMENTS
// ============================================================

const learnTitle = document.querySelector('.learn-title');
const learnSubtitle = document.querySelector('.learn-subtitle');

const progressCount = document.querySelector('.progress-count');
const progressBarWrapper = document.querySelector('.progress-bar-wrapper');
const progressBarFill = document.querySelector('.progress-bar-fill');

const flashcardSection = document.querySelector('.flashcard-section');
const learnActions = document.querySelector('.learn-actions');
const flashcard = document.querySelector('.flashcard');

const flashcardFront = document.querySelector('.flashcard-front');
const flashcardBack = document.querySelector('.flashcard-back');

const flashcardImage = flashcardFront.querySelector('.flashcard-image-placeholder');
const flashcardPronunciation = flashcardFront.querySelector('.flashcard-pronunciation');
const flashcardFrontWord = flashcardFront.querySelector('.flashcard-word');
const flashcardAudioBtn = flashcardFront.querySelector('.flashcard-audio');

const flashcardPartOfSpeech = flashcardBack.querySelector('.flashcard-part-of-speech');
const flashcardBackWord = flashcardBack.querySelector('.flashcard-word');
const flashcardMeaning = flashcardBack.querySelector('.flashcard-meaning');
const flashcardExampleText = flashcardBack.querySelector('.flashcard-example-text');
const flashcardExampleMeaning = flashcardBack.querySelector('.flashcard-example-meaning');

const btnMastered = document.querySelector('.btn-learn-complete');
const btnContinue = document.querySelector('.btn-learn-continue');

const writingExercise = document.querySelector('.writing-exercise');

// ============================================================
// STATE
// ============================================================

let vocabularies = [];
let currentIndex = 0;
let isFlipped = false;

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
// URL UTILS
// ============================================================

/**
 * Get and validate topic_id from URL query parameters.
 * @returns {number|null} Valid topic_id, or null if missing/invalid
 */
function getTopicIdFromUrl() {
    const raw = new URLSearchParams(window.location.search).get('topic_id');
    if (raw === null || raw === '') return null;
    const id = Number(raw);
    return Number.isInteger(id) && id > 0 ? id : null;
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Initialize a learning session for a topic.
 * POST /api/learning/start
 * @param {number} topicId - The topic ID
 * @returns {Promise<Object>} { topic, vocabularies }
 */
async function startLearning(topicId) {
    const response = await api.post('/learning/start', { topic_id: topicId });
    return response.data;
}

/**
 * Mark a vocabulary as mastered.
 * POST /api/learning/mastered
 * @param {number} vocabularyId - The vocabulary ID
 * @returns {Promise<Object>} Response data
 */
async function markAsMastered(vocabularyId) {
    const response = await api.post('/learning/mastered', { vocabulary_id: vocabularyId });
    return response.data;
}

/**
 * Get writing exercise data for a vocabulary.
 * POST /api/learning/writing
 * @param {number} vocabularyId - The vocabulary ID
 * @returns {Promise<Object>} Response data
 */
async function getWritingData(vocabularyId) {
    const response = await api.post('/learning/writing', { vocabulary_id: vocabularyId });
    return response.data;
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
 * Show a fatal error state - hides learning content and shows the message.
 * @param {string} title - Error title
 * @param {string} message - Error message
 */
function showErrorState(title, message) {
    learnTitle.textContent = title;
    learnSubtitle.textContent = message;
    flashcardSection.hidden = true;
    learnActions.hidden = true;
    writingExercise.hidden = true;
}

/**
 * Show an error message for an action without hiding the learning UI.
 * @param {string} message - Error message
 */
function showActionError(message) {
    learnSubtitle.textContent = message;
}

/**
 * Handle API errors from initialization flows.
 * @param {Error} error - The caught error
 * @param {string} fallbackMessage - Fallback message for non-401 errors
 */
function handleApiError(error, fallbackMessage) {
    if (error && error.status === 401) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return;
    }
    showErrorState('Không thể tải phiên học', getErrorMessage(error, fallbackMessage));
}

/**
 * Handle API errors from action flows (mastered / continue).
 * Keeps the learning UI visible.
 * @param {Error} error - The caught error
 * @param {string} fallbackMessage - Fallback message for non-401 errors
 */
function handleActionError(error, fallbackMessage) {
    if (error && error.status === 401) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return;
    }
    showActionError(getErrorMessage(error, fallbackMessage));
}

// ============================================================
// FLASHCARD RENDER
// ============================================================

/**
 * Render a vocabulary onto the flashcard (both faces).
 * @param {Object} vocabulary - Vocabulary data from the API
 */
function renderFlashcard(vocabulary) {
    flashcardFrontWord.textContent = vocabulary.word;
    flashcardBackWord.textContent = vocabulary.word;

    flashcardPronunciation.textContent = vocabulary.pronunciation || '';

    // Image
    if (vocabulary.image) {
        flashcardImage.src = vocabulary.image;
        flashcardImage.hidden = false;
    } else {
        flashcardImage.removeAttribute('src');
        flashcardImage.hidden = true;
    }

    // Audio
    if (vocabulary.audio) {
        flashcardAudioBtn.disabled = false;
        flashcardAudioBtn.dataset.audioUrl = vocabulary.audio;
    } else {
        flashcardAudioBtn.disabled = true;
        flashcardAudioBtn.removeAttribute('data-audio-url');
    }

    // Back face
    flashcardPartOfSpeech.textContent = vocabulary.part_of_speech || '';
    flashcardMeaning.textContent = vocabulary.meaning || '';
    flashcardExampleText.textContent = vocabulary.example || '';
    flashcardExampleMeaning.textContent = vocabulary.example_meaning || '';

    // Reset subtitle and show the front of the new card
    learnSubtitle.textContent = DEFAULT_SUBTITLE;
    resetFlip();
}

// ============================================================
// PROGRESS BAR
// ============================================================

/**
 * Update the progress bar to reflect the current position.
 */
function updateProgress() {
    const total = vocabularies.length;
    const current = Math.min(currentIndex + 1, total);
    const percent = total > 0 ? Math.round((current / total) * 100) : 0;

    progressCount.textContent = `${current} / ${total}`;
    progressBarFill.style.width = `${percent}%`;
    progressBarWrapper.setAttribute('aria-valuenow', String(percent));
}

/**
 * Set the progress bar to the completed state.
 */
function setProgressComplete() {
    const total = vocabularies.length;
    progressCount.textContent = `${total} / ${total}`;
    progressBarFill.style.width = '100%';
    progressBarWrapper.setAttribute('aria-valuenow', '100');
}

// ============================================================
// FLASHCARD FLIP
// ============================================================

/**
 * Toggle the CSS class that triggers the flip animation.
 * The 3D animation itself is handled by CSS (M4-T7).
 */
function flipCard() {
    isFlipped = !isFlipped;
    flashcard.classList.toggle(FLIP_CLASS, isFlipped);
}

/**
 * Reset the flashcard to show the front face.
 */
function resetFlip() {
    isFlipped = false;
    flashcard.classList.remove(FLIP_CLASS);
}

/**
 * Play the pronunciation audio for the current vocabulary.
 * @param {Event} event - The click event
 */
function handlePlayAudio(event) {
    event.stopPropagation();

    const audioUrl = flashcardAudioBtn.dataset.audioUrl;
    if (!audioUrl) return;

    const audio = new Audio(audioUrl);
    audio.play().catch(() => {
        console.warn('Unable to play pronunciation audio:', audioUrl);
    });
}

// ============================================================
// ACTION BUTTONS
// ============================================================

/**
 * Disable action buttons to prevent duplicate API calls.
 */
function disableActionButtons() {
    btnMastered.disabled = true;
    btnContinue.disabled = true;
}

/**
 * Re-enable action buttons.
 */
function enableActionButtons() {
    btnMastered.disabled = false;
    btnContinue.disabled = false;
}

/**
 * Handle the "Đã thuộc" button click.
 * Calls POST /api/learning/mastered, then moves to the next vocabulary.
 */
async function handleMastered() {
    if (currentIndex >= vocabularies.length) return;

    const vocabulary = vocabularies[currentIndex];
    disableActionButtons();

    try {
        await markAsMastered(vocabulary.id);
        goToNextVocabulary();
    } catch (error) {
        console.error('Mark as mastered error:', error);
        handleActionError(error, 'Không thể cập nhật trạng thái từ vựng. Vui lòng thử lại.');
    } finally {
        enableActionButtons();
    }
}

/**
 * Handle the "Tiếp tục" button click.
 * Calls POST /api/learning/writing, then shows the writing exercise placeholder.
 */
async function handleContinue() {
    if (currentIndex >= vocabularies.length) return;

    const vocabulary = vocabularies[currentIndex];
    disableActionButtons();

    try {
        await getWritingData(vocabulary.id);
        showWritingExercise();
    } catch (error) {
        console.error('Get writing data error:', error);
        handleActionError(error, 'Không thể tải bài tập viết. Vui lòng thử lại.');
    } finally {
        enableActionButtons();
    }
}

// ============================================================
// SESSION NAVIGATION
// ============================================================

/**
 * Move to the next vocabulary.
 * Shows the completion message when there are no more vocabularies.
 */
function goToNextVocabulary() {
    currentIndex++;

    if (currentIndex >= vocabularies.length) {
        showSessionComplete();
        return;
    }

    renderFlashcard(vocabularies[currentIndex]);
    updateProgress();
}

// ============================================================
// VIEW CONTROL
// ============================================================

/**
 * Hide the flashcard and action buttons, show the writing exercise placeholder.
 */
function showWritingExercise() {
    flashcardSection.hidden = true;
    learnActions.hidden = true;
    writingExercise.hidden = false;

    learnSubtitle.textContent = DEFAULT_SUBTITLE;
}

/**
 * Show the session completion message when all vocabularies are done.
 * Does not navigate away.
 */
function showSessionComplete() {
    setProgressComplete();

    flashcardSection.hidden = true;
    learnActions.hidden = true;
    writingExercise.hidden = true;

    learnTitle.textContent = 'Hoàn thành phiên học!';
    learnSubtitle.textContent = 'Bạn đã học hết tất cả từ vựng trong chủ đề này.';
}

// ============================================================
// EVENT LISTENERS
// ============================================================

/**
 * Setup event listeners for the flashcard and action buttons.
 */
function setupEventListeners() {
    flashcard.addEventListener('click', flipCard);
    flashcard.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' || event.key === ' ') {
            event.preventDefault();
            event.stopPropagation();
            flipCard();
        }
    });
    flashcardAudioBtn.addEventListener('click', handlePlayAudio);
    btnMastered.addEventListener('click', handleMastered);
    btnContinue.addEventListener('click', handleContinue);
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the learn flashcard page.
 * Main entry point that orchestrates all loading steps.
 */
async function initLearn() {
    try {
        // Step 1: Check authentication
        if (!checkAuth()) {
            return;
        }

        // Load shared components (header, bottom-nav)
        await loadAllComponents();

        // Step 2: Validate topic_id from URL
        // Do NOT call API if topic_id is missing/invalid
        const topicId = getTopicIdFromUrl();
        if (!topicId) {
            showErrorState('Thiếu topic_id', 'Vui lòng quay lại trang chủ và chọn một chủ đề để học.');
            return;
        }

        // Step 3: Load the learning session
        learnSubtitle.textContent = 'Đang tải từ vựng...';
        const data = await startLearning(topicId);
        vocabularies = data.vocabularies || [];

        // Step 4: Handle empty topic
        if (vocabularies.length === 0) {
            showErrorState('Chưa có từ vựng', 'Chủ đề này hiện chưa có từ vựng nào.');
            return;
        }

        // Step 5: Display the first flashcard and progress bar
        currentIndex = 0;
        renderFlashcard(vocabularies[currentIndex]);
        updateProgress();

        // Step 6: Bind event listeners
        setupEventListeners();

    } catch (error) {
        console.error('Learn initialization error:', error);
        handleApiError(error, 'Không thể tải phiên học. Vui lòng thử lại.');
    }
}

// ============================================================
// START
// ============================================================

document.addEventListener('DOMContentLoaded', initLearn);