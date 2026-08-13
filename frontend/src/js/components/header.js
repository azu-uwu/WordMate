// Get DOM elements
let avatarButton, dropdownMenu, dropdownUserName, dropdownUserEmail, headerAvatarImg, streakCount;

function getDOMElements() {
    avatarButton = document.getElementById("avatar-button");
    dropdownMenu = document.getElementById("avatar-dropdown-menu");
    dropdownUserName = document.getElementById("dropdown-user-name");
    dropdownUserEmail = document.getElementById("dropdown-user-email");
    headerAvatarImg = document.getElementById("header-avatar-img");
    streakCount = document.querySelector(".streak-count");
}

// ============================================================
// LOAD USER DATA
// ============================================================

/**
 * Load and display user information in the header dropdown.
 * Gets user data from localStorage and updates the UI.
 */
function loadUserData() {
    // Get user data from localStorage
    const userStr = localStorage.getItem('user');
    
    console.log('[Header] Loading user data:', userStr ? 'Found' : 'Not found');
    
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('[Header] User data:', user);
            
            // Update user name in dropdown
            if (dropdownUserName) {
                if (user.fullname) {
                    dropdownUserName.textContent = user.fullname;
                    console.log('[Header] Updated name to:', user.fullname);
                } else {
                    console.warn('[Header] No fullname in user data');
                }
            } else {
                console.warn('[Header] dropdownUserName element not found');
            }
            
            // Update user email in dropdown
            if (dropdownUserEmail && user.email) {
                dropdownUserEmail.textContent = user.email;
            }
            
            // Update avatar image if available
            if (headerAvatarImg && user.avatar) {
                headerAvatarImg.src = user.avatar;
            }
        } catch (error) {
            console.error('[Header] Error parsing user data:', error);
        }
    } else {
        console.warn('[Header] No user data in localStorage');
    }
}

// ============================================================
// LOAD STREAK FROM BACKEND
// ============================================================

/**
 * Load the user's current streak from GET /api/profile.
 * Updates the streak count in the header.
 * Frontend only reads and displays the value - no streak calculation.
 */
async function loadStreak() {
    try {
        const apiModule = await import('../../services/api.js');
        const api = apiModule.default;
        const response = await api.get('/profile');
        if (response.success && streakCount) {
            streakCount.textContent = response.data.streak != null ? response.data.streak : 0;
        }
    } catch (error) {
        console.error('[Header] Failed to load streak:', error);
    }
}

// Expose refresh function so pages can update the header streak
// after backend updates (e.g., after writing submit)
window.refreshHeaderStreak = loadStreak;

// ============================================================
// INITIALIZE HEADER
// ============================================================

function initHeader() {
    // Get DOM elements
    getDOMElements();
    
    // Load user data
    loadUserData();
    
    // Load streak from backend
    loadStreak();
    
    // Add dropdown toggle event listener
    if (avatarButton && dropdownMenu) {
        avatarButton.addEventListener("click", (e) => {
            e.stopPropagation();
            avatarButton.classList.toggle("active");
            dropdownMenu.classList.toggle("show");
        });
    }
    
    // Click outside to close dropdown
    document.addEventListener("click", () => {
        if (avatarButton && dropdownMenu) {
            avatarButton.classList.remove("active");
            dropdownMenu.classList.remove("show");
        }
    });
}

// Wait for DOM to be fully loaded before initializing
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader);
} else {
    // DOM is already loaded
    initHeader();
}
