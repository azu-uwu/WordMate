/**
 * Notebook Page - WordMate
 *
 * Handles the vocabulary notebook (Sổ tay từ vựng).
 *
 * Flow:
 * 1. Check authentication and load shared components
 * 2. Call GET /api/notebook to load the vocabulary list (search, topic_id, status, page, limit)
 * 3. Render vocabulary items
 * 4. Search with debounce → re-fetch with search=<keyword>, reset page to 1
 * 5. Pagination → re-fetch with page=<page>&limit=<limit>, keep filters
 * 6. Action by status:
 *    - learning  → POST /api/learning/mastered { vocabulary_id }  (M4-T3 endpoint)
 *    - mastered  → POST /api/notebook/review/:vocabulary_id        (M6-T3 endpoint)
 * 7. Reload the current list after a successful status change
 *
 * NOTE: GET /api/notebook/topics does NOT exist in the backend.
 * Per M6-T5 scope, no backend is created, so the topic filter is not wired to an API.
 */

import api from '../../services/api.js';
import * as authService from '../../services/authService.js';
import { loadAllComponents } from '../../js/components/nav.js';

// ============================================================
// CONSTANTS
// ============================================================

/** Default number of items per page (matches backend default) */
const DEFAULT_LIMIT = 10;

/** Debounce delay for the search input (ms) */
const SEARCH_DEBOUNCE_MS = 400;

// ============================================================
// DOM ELEMENTS
// ============================================================

const notebookSubtitle = document.querySelector('.notebook-subtitle');
const searchInput = document.querySelector('.notebook-search-input');
const listSection = document.querySelector('.notebook-list-section');
const listHeader = document.querySelector('.notebook-list-header');
const listCount = document.querySelector('.notebook-list-count');

// ============================================================
// STATE
// ============================================================

let currentPage = 1;
let currentSearch = '';
let currentTopicId = null;
let isFetching = false;
let debounceTimer = null;

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
 * Handle API errors.
 * On 401 → logout + redirect. Otherwise alert the message.
 * @param {Error} error - The caught error
 * @param {string} fallbackMessage - Fallback message
 */
function handleApiError(error, fallbackMessage) {
    if (error && error.status === 401) {
        authService.logout();
        window.location.href = '../auth/login.html';
        return;
    }
    alert(getErrorMessage(error, fallbackMessage));
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Load the notebook vocabulary list.
 * GET /api/notebook with search, topic_id, status, page, limit.
 * @returns {Promise<Object>} { total, page, limit, total_pages, items }
 */
async function loadNotebook() {
    const params = new URLSearchParams();
    params.set('page', String(currentPage));
    params.set('limit', String(DEFAULT_LIMIT));
    if (currentSearch) params.set('search', currentSearch);
    if (currentTopicId) params.set('topic_id', String(currentTopicId));

    const response = await api.get(`/notebook?${params.toString()}`);
    return response.data;
}

/**
 * Mark a vocabulary as mastered (learning → mastered).
 * POST /api/learning/mastered (M4-T3 endpoint).
 * @param {number} vocabularyId - The vocabulary ID
 * @returns {Promise<Object>} Response data
 */
async function markAsMastered(vocabularyId) {
    const response = await api.post('/learning/mastered', { vocabulary_id: vocabularyId });
    return response.data;
}

/**
 * Move a mastered vocabulary back to learning.
 * POST /api/notebook/review/:vocabulary_id (M6-T3 endpoint).
 * @param {number} vocabularyId - The vocabulary ID
 * @returns {Promise<Object>} Response data
 */
async function reviewVocabulary(vocabularyId) {
    const response = await api.post(`/notebook/review/${vocabularyId}`);
    return response.data;
}

// ============================================================
// RENDER HELPERS
// ============================================================

/**
 * Create the status badge element for a vocabulary item.
 * @param {string} status - 'learning' | 'mastered'
 * @returns {HTMLElement}
 */
function createStatusBadge(status) {
    const badge = document.createElement('span');
    badge.className = `vocab-status-badge ${status === 'mastered' ? 'vocab-status-mastered' : 'vocab-status-learning'}`;
    badge.textContent = status === 'mastered' ? 'Đã thuộc' : 'Đang học';
    return badge;
}

/**
 * Create the action button for a vocabulary item based on its status.
 * @param {Object} item - Vocabulary item from the API
 * @returns {HTMLElement}
 */
function createActionButton(item) {
    const button = document.createElement('button');
    button.type = 'button';
    button.dataset.vocabularyId = String(item.vocabulary_id);
    button.dataset.action = item.status === 'mastered' ? 'review' : 'mastered';

    if (item.status === 'mastered') {
        button.className = 'btn-notebook btn-notebook-secondary';
        button.innerHTML = `
            <i class="fa-solid fa-rotate-left" aria-hidden="true"></i>
            <span>Đưa về luyện tập</span>
        `;
    } else {
        button.className = 'btn-notebook btn-notebook-primary';
        button.innerHTML = `
            <i class="fa-solid fa-check" aria-hidden="true"></i>
            <span>Đánh dấu đã thuộc</span>
        `;
    }
    return button;
}

/**
 * Create a vocabulary item element from API data.
 * @param {Object} item - Vocabulary item from the API
 * @returns {HTMLElement}
 */
function createVocabularyItem(item) {
    const article = document.createElement('article');
    article.className = 'vocab-item';
    article.dataset.status = item.status;

    const main = document.createElement('div');
    main.className = 'vocab-item-main';

    const info = document.createElement('div');
    info.className = 'vocab-item-info';

    const word = document.createElement('h3');
    word.className = 'vocab-word';
    word.textContent = item.word || '';
    info.appendChild(word);

    if (item.pronunciation) {
        const pronunciation = document.createElement('p');
        pronunciation.className = 'vocab-pronunciation';
        pronunciation.textContent = item.pronunciation;
        info.appendChild(pronunciation);
    }

    const meta = document.createElement('div');
    meta.className = 'vocab-meta';

    if (item.part_of_speech) {
        const pos = document.createElement('span');
        pos.className = 'vocab-part-of-speech';
        pos.textContent = item.part_of_speech;
        meta.appendChild(pos);
    }

    meta.appendChild(createStatusBadge(item.status));
    info.appendChild(meta);

    if (item.meaning) {
        const meaning = document.createElement('p');
        meaning.className = 'vocab-meaning';
        meaning.textContent = item.meaning;
        info.appendChild(meaning);
    }

    const actions = document.createElement('div');
    actions.className = 'vocab-item-actions';
    actions.appendChild(createActionButton(item));

    main.appendChild(info);
    main.appendChild(actions);
    article.appendChild(main);

    return article;
}

// ============================================================
// PAGINATION RENDER
// ============================================================

/**
 * Create a pagination control element.
 * @param {Object} data - { page, total_pages, total }
 * @returns {HTMLElement}
 */
function createPagination(data) {
    const totalPages = data.total_pages || 0;
    const page = data.page || 1;

    const container = document.createElement('div');
    container.className = 'notebook-pagination';
    container.style.cssText = 'display:flex;align-items:center;justify-content:center;gap:0.5rem;margin-top:1.5rem;flex-wrap:wrap;';

    if (totalPages <= 1) {
        return container;
    }

    const makeButton = (label, targetPage, disabled, isActive) => {
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.textContent = label;
        btn.disabled = disabled;
        btn.style.cssText = 'padding:0.5rem 0.875rem;border-radius:8px;border:1px solid #E2E8F0;background:#FFFFFF;color:#1E293B;font-family:inherit;font-size:0.875rem;font-weight:600;cursor:pointer;transition:background 150ms ease,color 150ms ease,border-color 150ms ease;';
        if (isActive) {
            btn.style.background = '#FFC300';
            btn.style.borderColor = '#FFC300';
            btn.style.color = '#1E293B';
        }
        if (disabled) {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
        }
        btn.addEventListener('click', () => {
            if (!disabled && !isActive) {
                handlePageChange(targetPage);
            }
        });
        return btn;
    };

    // Previous
    container.appendChild(makeButton('‹', page - 1, page <= 1, false));

    // Page numbers (window of pages around the current page)
    const start = Math.max(1, page - 2);
    const end = Math.min(totalPages, page + 2);
    for (let i = start; i <= end; i++) {
        container.appendChild(makeButton(String(i), i, false, i === page));
    }

    // Next
    container.appendChild(makeButton('›', page + 1, page >= totalPages, false));

    return container;
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

/**
 * Show a loading state in the list section.
 */
function showLoading() {
    if (!listSection) return;

    // Keep the list header, clear the items below it
    const existingItems = listSection.querySelectorAll('.vocab-item, .notebook-empty, .notebook-error, .notebook-pagination');
    existingItems.forEach((el) => el.remove());

    const loading = document.createElement('div');
    loading.className = 'notebook-empty';
    loading.style.cssText = 'text-align:center;padding:3rem 1rem;color:#94A3B8;font-family:inherit;';
    loading.innerHTML = `
        <i class="fa-solid fa-spinner fa-spin" aria-hidden="true" style="font-size:2rem;margin-bottom:1rem;"></i>
        <p style="margin:0;font-size:1rem;">Đang tải từ vựng...</p>
    `;
    listSection.appendChild(loading);
}

/**
 * Show an empty state when there are no results.
 */
function showEmptyState() {
    if (!listSection) return;

    const empty = document.createElement('div');
    empty.className = 'notebook-empty';
    empty.style.cssText = 'text-align:center;padding:3rem 1rem;color:#94A3B8;font-family:inherit;';
    empty.innerHTML = `
        <i class="fa-solid fa-book-open" aria-hidden="true" style="font-size:2rem;margin-bottom:1rem;"></i>
        <p style="margin:0;font-size:1rem;">Không có từ vựng nào trong sổ tay.</p>
    `;
    listSection.appendChild(empty);
}

/**
 * Show an error state in the list section.
 * @param {string} message - Error message
 */
function showErrorState(message) {
    if (!listSection) return;

    const error = document.createElement('div');
    error.className = 'notebook-error';
    error.style.cssText = 'text-align:center;padding:3rem 1rem;color:#F43F5E;font-family:inherit;';
    error.innerHTML = `
        <i class="fa-solid fa-circle-exclamation" aria-hidden="true" style="font-size:2rem;margin-bottom:1rem;"></i>
        <p style="margin:0 0 1rem;font-size:1rem;">${message}</p>
        <button type="button" class="btn-notebook btn-notebook-primary" style="margin:0 auto;">
            <i class="fa-solid fa-rotate-right" aria-hidden="true"></i>
            <span>Thử lại</span>
        </button>
    `;

    const retryBtn = error.querySelector('button');
    retryBtn.addEventListener('click', () => {
        fetchAndRender();
    });

    listSection.appendChild(error);
}

/**
 * Render the vocabulary list and pagination.
 * @param {Object} data - { total, page, limit, total_pages, items }
 */
function renderNotebook(data) {
    if (!listSection) return;

    // Remove previous items, pagination, and state blocks (keep the header)
    const existing = listSection.querySelectorAll('.vocab-item, .notebook-empty, .notebook-error, .notebook-pagination');
    existing.forEach((el) => el.remove());

    const items = data.items || [];

    // Update subtitle and count
    if (notebookSubtitle) {
        notebookSubtitle.textContent = `${data.total} từ`;
    }
    if (listCount) {
        listCount.textContent = `${data.total} từ`;
    }

    // Empty state
    if (items.length === 0) {
        showEmptyState();
        return;
    }

    // Render items
    items.forEach((item, index) => {
        const el = createVocabularyItem(item);
        el.style.animationDelay = `${index * 0.05}s`;
        listSection.appendChild(el);
    });

    // Render pagination
    const pagination = createPagination(data);
    if (pagination.children.length > 0) {
        listSection.appendChild(pagination);
    }
}

// ============================================================
// DATA LOADING
// ============================================================

/**
 * Fetch the notebook list and render it.
 * Handles loading, error, and empty states.
 */
async function fetchAndRender() {
    if (isFetching) return;
    isFetching = true;

    showLoading();

    try {
        const data = await loadNotebook();
        renderNotebook(data);
    } catch (error) {
        console.error('Notebook load error:', error);
        handleApiError(error, 'Không thể tải sổ tay từ vựng. Vui lòng thử lại.');
        showErrorState('Không thể tải sổ tay từ vựng.');
    } finally {
        isFetching = false;
    }
}

// ============================================================
// SEARCH (DEBOUNCED)
// ============================================================

/**
 * Handle the search input with debounce.
 * Resets page to 1 and re-fetches with the new keyword.
 */
function handleSearchInput() {
    clearTimeout(debounceTimer);

    debounceTimer = setTimeout(() => {
        const keyword = searchInput ? searchInput.value.trim() : '';
        if (keyword === currentSearch) return;

        currentSearch = keyword;
        currentPage = 1;
        fetchAndRender();
    }, SEARCH_DEBOUNCE_MS);
}

// ============================================================
// PAGINATION
// ============================================================

/**
 * Handle a page change.
 * Keeps the current search and topic filters.
 * @param {number} page - The target page
 */
function handlePageChange(page) {
    if (page < 1) return;
    currentPage = page;
    fetchAndRender();
}

// ============================================================
// ACTIONS (STATUS CHANGE)
// ============================================================

/**
 * Handle a status action button click (event delegation).
 * - learning  → POST /api/learning/mastered
 * - mastered  → POST /api/notebook/review/:vocabulary_id
 * Reloads the current list after a successful change.
 * @param {Event} event - The click event
 */
async function handleActionClick(event) {
    const button = event.target.closest('button[data-action]');
    if (!button) return;

    const vocabularyId = Number(button.dataset.vocabularyId);
    const action = button.dataset.action;
    if (!Number.isInteger(vocabularyId) || vocabularyId <= 0) return;

    // Prevent duplicate requests
    if (button.disabled) return;
    button.disabled = true;

    try {
        if (action === 'mastered') {
            await markAsMastered(vocabularyId);
        } else if (action === 'review') {
            await reviewVocabulary(vocabularyId);
        } else {
            return;
        }

        // Reload the current list to reflect the new status
        await fetchAndRender();
    } catch (error) {
        console.error('Notebook action error:', error);
        handleApiError(error, 'Không thể cập nhật trạng thái từ vựng. Vui lòng thử lại.');
        button.disabled = false;
    }
}

// ============================================================
// EVENT LISTENERS
// ============================================================

/**
 * Setup event listeners for the notebook page.
 */
function setupEventListeners() {
    if (searchInput) {
        searchInput.addEventListener('input', handleSearchInput);
    }

    if (listSection) {
        listSection.addEventListener('click', handleActionClick);
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the notebook page.
 * Main entry point that orchestrates all loading steps.
 */
async function initNotebook() {
    try {
        // Step 1: Check authentication
        if (!checkAuth()) {
            return;
        }

        // Step 2: Bind event listeners
        setupEventListeners();

        // Step 3: Load shared components (header, bottom-nav)
        await loadAllComponents();

        // Step 4: Load the notebook list
        await fetchAndRender();

    } catch (error) {
        console.error('Notebook initialization error:', error);
        handleApiError(error, 'Không thể tải sổ tay từ vựng. Vui lòng thử lại.');
    }
}

// ============================================================
// START
// ============================================================

document.addEventListener('DOMContentLoaded', initNotebook);