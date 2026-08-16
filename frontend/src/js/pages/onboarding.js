/**
 * Onboarding page logic.
 * Handles roadmap selection for new users or users changing their roadmap.
 * Uses api service for API calls.
 * 
 * Flow:
 * 1. GET /api/roadmaps - Fetch list of active roadmaps
 * 2. Render roadmap cards
 * 3. User clicks card → PUT /api/profile/roadmap
 * 4. Success → Redirect to dashboard.html
 * 5. Error (401) → Redirect to login.html
 */

import { get, put, getMediaUrl } from '../../services/api.js';

// ============================================================
// DOM ELEMENTS
// ============================================================

const roadmapGrid = document.getElementById('roadmapGrid');
const loadingState = document.getElementById('loadingState');
const errorState = document.getElementById('errorState');
const retryBtn = document.getElementById('retryBtn');
const userFullnameElement = document.getElementById('user-fullname');

// ============================================================
// STATE MANAGEMENT
// ============================================================

let roadmaps = [];

// ============================================================
// API FUNCTIONS
// ============================================================

/**
 * Fetch all active roadmaps from the API.
 * @returns {Promise<Array>} List of roadmaps
 */
async function fetchRoadmaps() {
    const response = await get('/roadmaps');
    return response.data || [];
}

/**
 * Fetch user profile to get fullname.
 * @returns {Promise<Object>} Profile data
 */
async function fetchUserProfile() {
    const response = await get('/profile');
    return response.data;
}

/**
 * Update user's selected roadmap.
 * @param {number} roadmapId - The ID of the selected roadmap
 * @returns {Promise<Object>} API response
 */
async function updateUserRoadmap(roadmapId) {
    const response = await put('/profile/roadmap', { roadmap_id: roadmapId });
    return response.data;
}

// ============================================================
// RENDER FUNCTIONS
// ============================================================

/**
 * Show loading state, hide other states.
 */
function showLoading() {
    roadmapGrid.classList.add('d-none');
    errorState.classList.add('d-none');
    loadingState.classList.remove('d-none');
}

/**
 * Show error state, hide other states.
 */
function showError() {
    loadingState.classList.add('d-none');
    roadmapGrid.classList.add('d-none');
    errorState.classList.remove('d-none');
}

/**
 * Show roadmap grid, hide other states.
 */
function showRoadmapGrid() {
    loadingState.classList.add('d-none');
    errorState.classList.add('d-none');
    roadmapGrid.classList.remove('d-none');
}

/**
 * Create a roadmap card HTML element.
 * @param {Object} roadmap - Roadmap data
 * @returns {HTMLElement} Card element
 */
function createRoadmapCard(roadmap) {
    const card = document.createElement('div');
    card.className = 'roadmap-card';
    card.setAttribute('data-roadmap-id', roadmap.id);
    card.setAttribute('role', 'button');
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `Chọn lộ trình: ${roadmap.name}`);

    // Card image section
    const imageDiv = document.createElement('div');
    imageDiv.className = 'roadmap-card-image';
    
    if (roadmap.image) {
        const img = document.createElement('img');
        img.src = getMediaUrl(roadmap.image);
        img.alt = roadmap.name;
        img.loading = 'lazy';
        imageDiv.appendChild(img);
    } else {
        // Default icon based on roadmap name
        const icon = document.createElement('i');
        icon.className = getDefaultIcon(roadmap.name);
        imageDiv.appendChild(icon);
    }

    // Card body section
    const bodyDiv = document.createElement('div');
    bodyDiv.className = 'roadmap-card-body';

    // Title
    const title = document.createElement('h2');
    title.className = 'roadmap-card-title';
    title.textContent = roadmap.name;
    bodyDiv.appendChild(title);

    // Description
    if (roadmap.description) {
        const desc = document.createElement('p');
        desc.className = 'roadmap-card-desc';
        desc.textContent = roadmap.description;
        bodyDiv.appendChild(desc);
    }

    // Card footer section
    const footerDiv = document.createElement('div');
    footerDiv.className = 'roadmap-card-footer';

    const hint = document.createElement('span');
    hint.className = 'roadmap-card-hint';
    hint.innerHTML = 'Chọn lộ trình <i class="fa-solid fa-arrow-right"></i>';
    footerDiv.appendChild(hint);

    // Assemble card
    card.appendChild(imageDiv);
    card.appendChild(bodyDiv);
    card.appendChild(footerDiv);

    // Add click event
    card.addEventListener('click', () => handleRoadmapSelect(roadmap.id));

    // Add keyboard support (Enter key)
    card.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleRoadmapSelect(roadmap.id);
        }
    });

    return card;
}

/**
 * Get default icon class based on roadmap name.
 * @param {string} name - Roadmap name
 * @returns {string} Font Awesome icon class
 */
function getDefaultIcon(name) {
    const nameLower = name.toLowerCase();
    
    if (nameLower.includes('cơ bản') || nameLower.includes('basic')) {
        return 'fa-solid fa-book-open';
    } else if (nameLower.includes('toeic')) {
        return 'fa-solid fa-graduation-cap';
    } else if (nameLower.includes('ielts') || nameLower.includes('iel')) {
        return 'fa-solid fa-globe';
    } else if (nameLower.includes('phrasal') || nameLower.includes('idiom')) {
        return 'fa-solid fa-comments';
    } else {
        return 'fa-solid fa-road';
    }
}

/**
 * Render all roadmap cards.
 * @param {Array} roadmapsList - List of roadmap objects
 */
function renderRoadmaps(roadmapsList) {
    roadmapGrid.innerHTML = '';
    
    if (roadmapsList.length === 0) {
        // No roadmaps available
        const emptyState = document.createElement('div');
        emptyState.className = 'empty-state';
        emptyState.style.cssText = 'text-align: center; padding: 4rem 2rem;';
        emptyState.innerHTML = `
            <i class="fa-solid fa-folder-open" style="font-size: 3rem; color: var(--wm-text-muted); margin-bottom: 1rem;"></i>
            <p style="font-size: 1rem; color: var(--wm-text-secondary);">Hiện tại chưa có lộ trình học tập nào.</p>
        `;
        roadmapGrid.appendChild(emptyState);
        showRoadmapGrid();
        return;
    }

    // Create and append cards
    roadmapsList.forEach((roadmap, index) => {
        const card = createRoadmapCard(roadmap);
        // Add staggered animation delay
        card.style.animationDelay = `${index * 0.1}s`;
        roadmapGrid.appendChild(card);
    });

    showRoadmapGrid();
}

// ============================================================
// EVENT HANDLERS
// ============================================================

/**
 * Handle roadmap selection by user.
 * @param {number} roadmapId - Selected roadmap ID
 */
async function handleRoadmapSelect(roadmapId) {
    // Disable all cards during API call
    const cards = document.querySelectorAll('.roadmap-card');
    cards.forEach(card => {
        card.style.pointerEvents = 'none';
        card.style.opacity = '0.6';
    });

    try {
        // Call API to update user's roadmap
        await updateUserRoadmap(roadmapId);

        // Success - redirect to dashboard
        window.location.href = '../dashboard/dashboard.html';
    } catch (error) {
        // Re-enable cards
        cards.forEach(card => {
            card.style.pointerEvents = 'auto';
            card.style.opacity = '1';
        });

        // Handle error
        if (error.status === 401) {
            // Unauthorized - redirect to login
            window.location.href = '../auth/login.html';
        } else {
            // Show error message
            console.error('Failed to update roadmap:', error);
            alert('Không thể cập nhật lộ trình. Vui lòng thử lại.');
        }
    }
}

/**
 * Handle retry button click.
 */
async function handleRetry() {
    await initializePage();
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the onboarding page.
 */
async function initializePage() {
    try {
        showLoading();

        // Fetch user profile and roadmaps concurrently
        const [profile, roadmapsData] = await Promise.all([
            fetchUserProfile(),
            fetchRoadmaps()
        ]);

        // Update user fullname in header
        if (userFullnameElement && profile.fullname) {
            userFullnameElement.textContent = profile.fullname;
        }

        // Store roadmaps and render
        roadmaps = roadmapsData;
        renderRoadmaps(roadmaps);
    } catch (error) {
        console.error('Failed to load onboarding page:', error);
        
        // Set default text if profile fetch fails
        if (userFullnameElement) {
            userFullnameElement.textContent = 'bạn';
        }
        
        showError();
    }
}

/**
 * Main entry point - Set up event listeners and initialize page.
 */
document.addEventListener('DOMContentLoaded', () => {
    // Retry button event listener
    if (retryBtn) {
        retryBtn.addEventListener('click', handleRetry);
    }

    // Initialize page
    initializePage();
});