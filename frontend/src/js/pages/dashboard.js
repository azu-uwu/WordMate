/**
 * Dashboard Page - WordMate
 * Displays list of topics for the user's selected roadmap.
 * Uses api service for API calls and authService for authentication.
 * 
 * Flow:
 * 1. Check authentication - redirect to login if not authenticated
 * 2. Load user profile to get roadmap_id
 * 3. Load topics for the roadmap
 * 4. Render topic cards
 * 5. Highlight "Trang chủ" in bottom navigation
 */

import api from '../../services/api.js';
import * as authService from '../../services/authService.js';
import { loadAllComponents } from '../../js/components/nav.js';

// ============================================================
// DOM ELEMENTS
// ============================================================

const topicGrid = document.querySelector('.topic-grid');
const topicCount = document.querySelector('.topic-count');
const streakNumber = document.querySelector('.streak-number');
const dashboardTitle = document.querySelector('.dashboard-title');
const dashboardSubtitle = document.querySelector('.dashboard-subtitle');

// ============================================================
// STATE
// ============================================================

let currentProfile = null;

// ============================================================
// TOAST NOTIFICATIONS
// ============================================================

/**
 * Show toast notification message
 * @param {string} message - Message to display
 * @param {string} type - 'success' | 'error' | 'info'
 */
function showToast(message, type = 'info') {
    const toastContainer = document.getElementById('toast-container');
    if (!toastContainer) return;

    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    
    const icon = type === 'success' ? 'fa-check-circle' : 
                 type === 'error' ? 'fa-exclamation-circle' : 
                 'fa-info-circle';
    
    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;
    
    toastContainer.appendChild(toast);
    
    // Auto remove after 3 seconds
    setTimeout(() => {
        toast.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
            if (toast.parentNode) {
                toast.parentNode.removeChild(toast);
            }
        }, 300);
    }, 3000);
}

// ============================================================
// LOADING STATE
// ============================================================

/**
 * Show loading skeleton in topic grid
 */
function showLoading() {
    if (!topicGrid) return;
    
    topicGrid.innerHTML = '';
    
    // Create skeleton cards
    for (let i = 0; i < 3; i++) {
        const skeleton = document.createElement('div');
        skeleton.className = 'topic-card-skeleton';
        skeleton.innerHTML = `
            <div class="skeleton-image"></div>
            <div class="skeleton-body">
                <div class="skeleton-title"></div>
                <div class="skeleton-text"></div>
                <div class="skeleton-text skeleton-text-short"></div>
            </div>
        `;
        topicGrid.appendChild(skeleton);
    }
}

/**
 * Hide loading state
 */
function hideLoading() {
    if (!topicGrid) return;
    topicGrid.innerHTML = '';
}

// ============================================================
// AUTHENTICATION
// ============================================================

/**
 * Check if user is authenticated.
 * Redirects to login page if not authenticated.
 */
function checkAuth() {
    if (!authService.isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Load user profile from API.
 * @returns {Promise<Object>} Profile data with roadmap_id
 */
async function loadProfile() {
    const response = await api.get('/profile');
    return response.data;
}

/**
 * Load topics for a specific roadmap.
 * @param {number} roadmapId - The roadmap ID
 * @returns {Promise<Array>} List of topics
 */
async function loadTopics(roadmapId) {
    const response = await api.get(`/topics?roadmap_id=${roadmapId}`);
    return response.data || [];
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

/**
 * Create a topic card HTML element.
 * @param {Object} topic - Topic data from API
 * @returns {HTMLElement} Card element
 */
function createTopicCard(topic) {
    const card = document.createElement('article');
    card.className = 'topic-card';
    card.setAttribute('data-topic-id', topic.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Chọn chủ đề: ${topic.name}`);

    // Topic image
    const imageDiv = document.createElement('div');
    imageDiv.className = 'topic-card-image';

    if (topic.image) {
        const img = document.createElement('img');
        // img.src = topic.image;
        img.src = api.getMediaUrl(topic.image);
        img.alt = topic.name;
        img.loading = 'lazy';
        imageDiv.appendChild(img);
    } else {
        // Default icon
        const icon = document.createElement('i');
        icon.className = 'fa-solid fa-book-open';
        imageDiv.appendChild(icon);
    }

    // Topic body
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'topic-card-body';

    const title = document.createElement('h3');
    title.className = 'topic-card-title';
    title.textContent = topic.name;
    bodyDiv.appendChild(title);

    if (topic.description) {
        const desc = document.createElement('p');
        desc.className = 'topic-card-desc';
        desc.textContent = topic.description;
        bodyDiv.appendChild(desc);
    }

    // Topic footer
    const footerDiv = document.createElement('div');
    footerDiv.className = 'topic-card-footer';

    const hint = document.createElement('span');
    hint.className = 'topic-card-hint';
    hint.innerHTML = 'Bắt đầu học <i class="fa-solid fa-arrow-right"></i>';
    footerDiv.appendChild(hint);

    // Assemble card
    card.appendChild(imageDiv);
    card.appendChild(bodyDiv);
    card.appendChild(footerDiv);

    // Click event - navigate to learn page
    card.addEventListener('click', () => {
        window.location.href = `../learn/learn.html?topic_id=${topic.id}`;
    });

    // Keyboard support
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            window.location.href = `../learn/learn.html?topic_id=${topic.id}`;
        }
    });

    return card;
}

/**
 * Render list of topics to the dashboard.
 * @param {Array} topics - List of topic objects
 */
function renderTopics(topics) {
    // Clear existing content
    topicGrid.innerHTML = '';

    // Update topic count
    if (topicCount) {
        topicCount.textContent = `${topics.length} chủ đề`;
    }

    // Handle empty state
    if (topics.length === 0) {
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.innerHTML = `
            <i class="fa-solid fa-folder-open"></i>
            <p>Hiện tại chưa có chủ đề nào trong lộ trình này.</p>
        `;
        topicGrid.appendChild(emptyState);
        return;
    }

    // Create and append topic cards
    topics.forEach((topic, index) => {
        const card = createTopicCard(topic);
        card.style.animationDelay = `${index * 0.1}s`;
        topicGrid.appendChild(card);
    });
}

/**
 * Update streak display in header.
 * @param {number} streak - Streak count
 */
function updateStreakDisplay(streak) {
    if (streakNumber) {
        streakNumber.textContent = streak != null ? streak : 0;
    }
}

/**
 * Highlight the "Trang chủ" tab in bottom navigation.
 */
function highlightActiveTab() {
    // Bottom navigation will be loaded via component
    // This function ensures the correct tab is highlighted
    const bottomNav = document.querySelector('.bottom-nav');
    if (bottomNav) {
        // Remove active class from all nav items
        const navItems = bottomNav.querySelectorAll('.nav-item');
        navItems.forEach(item => {
            item.classList.remove('active');
        });

        // Add active class to "Trang chủ" tab (first tab)
        const homeTab = bottomNav.querySelector('.nav-item:first-child');
        if (homeTab) {
            homeTab.classList.add('active');
        }
    }
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the dashboard page.
 * Main entry point that orchestrates all loading steps.
 */
async function initDashboard() {
    try {
        // Step 1: Check authentication
        if (!checkAuth()) {
            return;
        }

        // Load shared components (header, bottom-nav)
        await loadAllComponents();

        // Show loading state
        showLoading();

        // Step 2: Load user profile
        currentProfile = await loadProfile();

        // Update dashboard title with actual roadmap name
        if (dashboardTitle && currentProfile.roadmap_name) {
            dashboardTitle.textContent = currentProfile.roadmap_name;
        }

        // Update streak display
        if (currentProfile.streak !== undefined) {
            updateStreakDisplay(currentProfile.streak);
        }

        // Step 3: Validate roadmap_id
        const roadmapId = currentProfile.roadmap_id;
        if (!roadmapId) {
            // User hasn't selected a roadmap yet
            hideLoading();
            
            if (dashboardTitle) {
                dashboardTitle.textContent = 'Chọn Lộ Trình';
            }
            if (dashboardSubtitle) {
                dashboardSubtitle.textContent = 'Vui lòng chọn lộ trình học tập để bắt đầu';
            }

            // Show message in topic grid
            topicGrid.innerHTML = `
                <div class="empty-state">
                    <i class="fa-solid fa-road"></i>
                    <p>Bạn chưa chọn lộ trình học tập.</p>
                    <a href="../dashboard/onboarding.html" class="btn-select-roadmap">
                        Chọn Lộ Trình
                    </a>
                </div>
            `;
            return;
        }

        // Step 4: Load topics for the roadmap
        const topics = await loadTopics(roadmapId);

        // Step 5: Hide loading and render topics
        hideLoading();
        renderTopics(topics);

        // Step 6: Highlight active tab
        highlightActiveTab();

    } catch (error) {
        console.error('Dashboard initialization error:', error);
        hideLoading();

        // Handle 401 Unauthorized - token expired or invalid
        if (error.status === 401) {
            // Clear token and redirect to login
            authService.logout();
            window.location.href = '../auth/login.html';
            return;
        }

        // Handle other errors - show error state with toast
        showToast('Không thể tải danh sách chủ đề. Vui lòng thử lại.', 'error');
        
        if (topicGrid) {
            topicGrid.innerHTML = `
                <div class="empty-state empty-state-error">
                    <i class="fa-solid fa-circle-exclamation"></i>
                    <p>Không thể tải danh sách chủ đề.</p>
                    <button onclick="location.reload()" class="btn-retry">
                        Thử Lại
                    </button>
                </div>
            `;
        }
    }
}

// ============================================================
// START
// ============================================================

document.addEventListener('DOMContentLoaded', initDashboard);