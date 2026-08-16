/**
 * Admin Dashboard Page - WordMate
 * Layout-only for Task M8-T7.
 * 
 * Responsibilities:
 * 1. Guard the page: only logged-in admin users can access.
 * 2. Render admin display name in the header.
 * 3. Switch between the 4 admin sections (Roadmaps, Topics,
 *    Vocabularies, Custom Questions) within admin.html.
 * 4. Logout handler.
 * 
 * Uses existing authService for authentication/role checks.
 * No CRUD/API calls are implemented in this task (M8-T8+).
 */

import * as authService from '../../services/authService.js';

// ============================================================
// DOM ELEMENTS
// ============================================================

const pageTitle = document.getElementById('adminPageTitle');
const pageSubtitle = document.getElementById('adminPageSubtitle');
const userNameEl = document.getElementById('adminUserName');
const logoutBtn = document.getElementById('adminLogoutBtn');
const logoutBtnMobile = document.getElementById('adminLogoutBtnMobile');

// ============================================================
// SECTION METADATA
// ============================================================

/**
 * Metadata for each admin section.
 * key = the value of the data-section attribute
 */
const SECTION_META = {
    'roadmaps': {
        title: 'Roadmaps',
        subtitle: 'Quản lý lộ trình học tập trong hệ thống'
    },
    'topics': {
        title: 'Topics',
        subtitle: 'Quản lý chủ đề học tập trong hệ thống'
    },
    'vocabularies': {
        title: 'Vocabularies',
        subtitle: 'Quản lý từ vựng trong hệ thống'
    },
    'custom-questions': {
        title: 'Custom Questions',
        subtitle: 'Quản lý câu hỏi tùy chỉnh trong hệ thống'
    }
};

// ============================================================
// AUTHENTICATION GUARD
// ============================================================

/**
 * Check if the current user is logged in AND has admin role.
 * Uses the existing authService mechanism (localStorage user + token).
 * @returns {boolean}
 */
function isAdmin() {
    // Must be authenticated first (token exists)
    if (!authService.isAuthenticated()) {
        return false;
    }

    // Role is stored in the user object saved by authService.login()
    const user = authService.getCurrentUser();
    return !!user && user.role === 'admin';
}

/**
 * Guard the admin page.
 * Redirects non-admin or non-authenticated users to the login page.
 */
function guardAdminPage() {
    if (!isAdmin()) {
        // Clear any stale auth state and send to login
        authService.logout();
        window.location.href = '../auth/login.html';
        return false;
    }
    return true;
}

// ============================================================
// UI HELPERS
// ============================================================

/**
 * Populate the admin display name in the header chip.
 */
function renderAdminInfo() {
    if (!userNameEl) return;

    const user = authService.getCurrentUser();
    if (user && user.fullname) {
        userNameEl.textContent = user.fullname;
    } else if (user && user.username) {
        userNameEl.textContent = user.username;
    } else if (user && user.email) {
        userNameEl.textContent = user.email;
    } else {
        userNameEl.textContent = 'Admin';
    }
}

/**
 * Show a simple toast notification.
 * @param {string} message - Text to display
 * @param {'success'|'error'|'info'} type - Toast style
 */
function showToast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;

    const toast = document.createElement('div');
    toast.className = `admin-toast toast-${type}`;

    const iconMap = {
        success: 'fa-circle-check',
        error: 'fa-circle-exclamation',
        info: 'fa-circle-info'
    };
    const icon = iconMap[type] || iconMap.info;

    toast.innerHTML = `
        <i class="fa-solid ${icon}"></i>
        <span>${message}</span>
    `;

    container.appendChild(toast);

    // Auto-remove after 3s
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 3000);
}

// ============================================================
// NAVIGATION — Section switching
// ============================================================

/**
 * Activate the section matching the given data-section value.
 * @param {string} sectionKey - e.g. 'roadmaps', 'topics', ...
 */
function activateSection(sectionKey) {
    if (!SECTION_META[sectionKey]) return;

    // Toggle .active on section elements
    document.querySelectorAll('.admin-section').forEach((section) => {
        const active = section.getAttribute('data-section') === sectionKey;
        section.classList.toggle('active', active);
    });

    // Toggle .active on all nav links (desktop + mobile)
    document.querySelectorAll('.admin-nav-link').forEach((link) => {
        const active = link.getAttribute('data-section') === sectionKey;
        link.classList.toggle('active', active);
        if (active) {
            link.setAttribute('aria-current', 'page');
        } else {
            link.removeAttribute('aria-current');
        }
    });

    // Update the main header
    if (pageTitle) {
        pageTitle.textContent = SECTION_META[sectionKey].title;
    }
    if (pageSubtitle) {
        pageSubtitle.textContent = SECTION_META[sectionKey].subtitle;
    }

    // Scroll to top of main content on section change
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Attach click handlers to every admin nav link
 * (both desktop sidebar and mobile offcanvas).
 */
function bindNavigation() {
    document.querySelectorAll('.admin-nav-link').forEach((link) => {
        link.addEventListener('click', () => {
            const sectionKey = link.getAttribute('data-section');
            if (!sectionKey) return;

            activateSection(sectionKey);

            // Close the mobile offcanvas after selecting a section
            const canvasEl = document.getElementById('adminSidebarCanvas');
            if (canvasEl && window.bootstrap) {
                const offcanvas = bootstrap.Offcanvas.getInstance(canvasEl);
                if (offcanvas) {
                    offcanvas.hide();
                }
            }
        });
    });
}

// ============================================================
// LOGOUT
// ============================================================

/**
 * Log out and redirect to the login page.
 */
function handleLogout() {
    authService.logout();
    window.location.href = '../auth/login.html';
}

// ============================================================
// INITIALIZATION
// ============================================================

/**
 * Initialize the admin dashboard page.
 */
function initAdmin() {
    // Guard: only admins may use this page
    if (!guardAdminPage()) {
        return;
    }

    // Populate admin info
    renderAdminInfo();

    // Bind sidebar navigation
    bindNavigation();

    // Bind logout buttons (desktop + mobile)
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
    if (logoutBtnMobile) {
        logoutBtnMobile.addEventListener('click', handleLogout);
    }

    // Activate the default section (Roadmaps)
    activateSection('roadmaps');
}

// ============================================================
// START
// ============================================================

// Guard runs as early as possible, before DOMContentLoaded,
// to prevent any flash of content for unauthorized users.
if (!authService.isAuthenticated()) {
    window.location.replace('../auth/login.html');
} else {
    document.addEventListener('DOMContentLoaded', initAdmin);
}