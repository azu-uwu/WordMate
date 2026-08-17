// Get DOM elements
let avatarButton, dropdownMenu, dropdownUserName, dropdownUserEmail, headerAvatarImg, streakCount, adminBtn;

function getDOMElements() {
    avatarButton = document.getElementById("avatar-button");
    dropdownMenu = document.getElementById("avatar-dropdown-menu");
    dropdownUserName = document.getElementById("dropdown-user-name");
    dropdownUserEmail = document.getElementById("dropdown-user-email");
    headerAvatarImg = document.getElementById("header-avatar-img");
    streakCount = document.querySelector(".streak-count");
    adminBtn = document.getElementById("header-admin-btn");
}

// ============================================================
// LOAD USER DATA
// ============================================================

/**
 * Build a generated avatar URL from user's fullname.
 * Used as fallback when the user has no uploaded avatar.
 */
function buildAvatarUrl(name) {
    const encoded = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encoded}&background=FFC300&color=1E293B&size=100`;
}

/**
 * Load and display the user's avatar.
 * Uses the uploaded avatar if available (resolving /uploads/ paths via getMediaUrl),
 * otherwise falls back to a generated avatar from the user's fullname.
 */
async function loadAvatar(user) {
    if (!headerAvatarImg) return;

    let avatarUrl = null;

    if (user.avatar) {
        try {
            const apiModule = await import('../../services/api.js');
            const { getMediaUrl } = apiModule;
            avatarUrl = getMediaUrl(user.avatar);
        } catch (err) {
            console.warn('[Header] Failed to resolve media URL, using raw avatar path:', err);
            avatarUrl = user.avatar;
        }
    }

    // Fallback: generate an avatar from the user's fullname
    if (!avatarUrl) {
        avatarUrl = buildAvatarUrl(user.fullname);
    }

    headerAvatarImg.src = avatarUrl;
    headerAvatarImg.alt = user.fullname ? `Avatar của ${user.fullname}` : 'Avatar';
}

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
            
            // Update avatar image (with fallback)
            loadAvatar(user);
            
            // Show/hide admin button based on role
            if (adminBtn) {
                if (user.role === 'admin') {
                    adminBtn.style.display = 'inline-flex';
                    console.log('[Header] Admin button shown (role: admin)');
                } else {
                    adminBtn.style.display = 'none';
                    console.log('[Header] Admin button hidden (role: ' + (user.role || 'unknown') + ')');
                }
            }
        } catch (error) {
            console.error('[Header] Error parsing user data:', error);
            // Hide admin button on parse error
            if (adminBtn) {
                adminBtn.style.display = 'none';
            }
        }
    } else {
        console.warn('[Header] No user data in localStorage');
        // Hide admin button if no user data
        if (adminBtn) {
            adminBtn.style.display = 'none';
        }
    }
}

// ============================================================
// LOAD STREAK FROM BACKEND
// ============================================================

/**
 * Load the user's current streak from GET /api/profile.
 * Updates the streak count in the header.
 * Frontend only reads and displays the value - no streak calculation.
 * Also refreshes the stored user (fullname/avatar) from the backend so
 * the avatar renders correctly even for users who logged in before
 * the backend returned those fields.
 */
async function loadStreak() {
    try {
        const apiModule = await import('../../services/api.js');
        const api = apiModule.default;
        const response = await api.get('/profile');
        if (response.success) {
            // Update streak count
            if (streakCount) {
                streakCount.textContent = response.data.streak != null ? response.data.streak : 0;
            }

            // Refresh user info (name/email/avatar) from backend
            const userStr = localStorage.getItem('user');
            if (userStr) {
                try {
                    const localUser = JSON.parse(userStr);
                    const mergedUser = { ...localUser, ...response.data };
                    localStorage.setItem('user', JSON.stringify(mergedUser));

                    // Update displayed name/email if missing
                    if (dropdownUserName && mergedUser.fullname) {
                        dropdownUserName.textContent = mergedUser.fullname;
                    }
                    if (dropdownUserEmail && mergedUser.email) {
                        dropdownUserEmail.textContent = mergedUser.email;
                    }

                    // Re-render avatar with up-to-date data
                    loadAvatar(mergedUser);
                } catch (err) {
                    console.warn('[Header] Failed to merge profile data:', err);
                }
            }
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
