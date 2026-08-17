/**
 * Profile Page - WordMate
 * Handles user profile display, editing, password change, roadmap, and logout.
 * Uses ES6, async/await, Fetch API via api.js service.
 */
import api, { getMediaUrl } from '../../services/api.js';
import * as authService from '../../services/authService.js';
import { loadAllComponents } from '../../js/components/nav.js';

// ============================================================
// DOM References
// ============================================================
const $ = (id) => document.getElementById(id);

const loadingSpinner = $('loadingSpinner');
const profileContent = $('profileContent');

// Header
const avatarImg = $('avatarImg');
const avatarPlaceholder = $('avatarPlaceholder');
const headerFullname = $('headerFullname');
const headerEmail = $('headerEmail');

// Avatar upload
const changeAvatarBtn = $('changeAvatarBtn');
const editAvatarBtn = $('editAvatarBtn');
const avatarInput = $('avatarInput');
const avatarMessage = $('avatarMessage');
const avatarActions = $('avatarActions');
const saveAvatarBtn = $('saveAvatarBtn');
const cancelAvatarBtn = $('cancelAvatarBtn');

// Personal Info
const displayStreak = $('displayStreak');
const infoAvatar = $('infoAvatar');
const displayFullname = $('displayFullname');
const displayUsername = $('displayUsername');
const displayEmail = $('displayEmail');
const editFullnameBtn = $('editFullnameBtn');
const editFullnameForm = $('editFullnameForm');
const fullnameInput = $('fullnameInput');
const saveFullnameBtn = $('saveFullnameBtn');
const cancelFullnameBtn = $('cancelFullnameBtn');

// Password
const passwordMessage = $('passwordMessage');
const passwordForm = $('passwordForm');
const currentPassword = $('currentPassword');
const newPassword = $('newPassword');
const confirmPassword = $('confirmPassword');
const changePasswordBtn = $('changePasswordBtn');

// Roadmap
const roadmapMessage = $('roadmapMessage');
const roadmapDisplay = $('roadmapDisplay');
const currentRoadmapText = $('currentRoadmapText');
const roadmapUpdateForm = $('roadmapUpdateForm');
const roadmapSelect = $('roadmapSelect');
const updateRoadmapBtn = $('updateRoadmapBtn');

// Logout
const logoutBtn = $('logoutBtn');

// ============================================================
// State
// ============================================================
let currentUser = null; // Holds the full profile data from API
let selectedAvatarFile = null; // File selected for avatar upload
let originalAvatarUrl = null; // Avatar URL before preview (for cancel)

// ============================================================
// Utility: Show / Hide loading
// ============================================================
function showLoading() {
    loadingSpinner.style.display = '';
    profileContent.style.display = 'none';
}

function hideLoading() {
    loadingSpinner.style.display = 'none';
    profileContent.style.display = '';
}

// ============================================================
// Utility: Show message in a target element
// ============================================================
function showMessage(el, message, type = 'success') {
    el.textContent = message;
    el.className = `alert-message alert-${type}`;
    el.style.display = 'block';
}

function hideMessage(el) {
    el.textContent = '';
    el.className = 'alert-message';
    el.style.display = 'none';
}

// ============================================================
// Utility: Toggle button loading state
// ============================================================
function setButtonLoading(btn, loading) {
    const text = btn.querySelector('.btn-text');
    const spinner = btn.querySelector('.btn-spinner');
    if (loading) {
        text.classList.add('d-none');
        spinner.classList.remove('d-none');
        btn.disabled = true;
    } else {
        text.classList.remove('d-none');
        spinner.classList.add('d-none');
        btn.disabled = false;
    }
}

// ============================================================
// Utility: Build avatar URL from fullname
// ============================================================
function buildAvatarUrl(name) {
    const encoded = encodeURIComponent(name || 'User');
    return `https://ui-avatars.com/api/?name=${encoded}&background=FFC300&color=1E293B&size=100`;
}

// ============================================================
// Avatar: Get current avatar display URL
// ============================================================
function getCurrentAvatarUrl() {
    if (currentUser && currentUser.avatar) {
        return getMediaUrl(currentUser.avatar);
    }
    return buildAvatarUrl(currentUser ? currentUser.fullname : 'User');
}

// ============================================================
// Avatar: Show message in avatar area
// ============================================================
function showAvatarMessage(message, type = 'error') {
    avatarMessage.textContent = message;
    avatarMessage.className = `avatar-message avatar-${type}`;
    avatarMessage.style.display = 'block';
}

function hideAvatarMessage() {
    avatarMessage.textContent = '';
    avatarMessage.className = 'avatar-message';
    avatarMessage.style.display = 'none';
}

// ============================================================
// Avatar: Open file picker
// ============================================================
function openAvatarPicker() {
    // Reset input value so selecting the same file again still triggers change
    avatarInput.value = '';
    avatarInput.click();
}

// ============================================================
// Avatar: Validate selected file
// ============================================================
function validateAvatarFile(file) {
    // Check file exists
    if (!file) {
        return 'Vui lòng chọn một file ảnh.';
    }

    // Check file type (JPG/JPEG/PNG)
    const allowedTypes = ['image/jpeg', 'image/png'];
    if (!allowedTypes.includes(file.type)) {
        return 'Định dạng ảnh không hợp lệ. Chỉ chấp nhận JPG, JPEG hoặc PNG.';
    }

    // Check file size (max 5MB = 5 * 1024 * 1024 bytes)
    const MAX_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_SIZE) {
        return 'Kích thước ảnh tối đa là 5MB.';
    }

    return null;
}

// ============================================================
// Avatar: Handle file selected from picker
// ============================================================
function handleAvatarFileSelected(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;

    // Validate file
    const errorMsg = validateAvatarFile(file);
    if (errorMsg) {
        // Reject invalid file: no request, show error
        selectedAvatarFile = null;
        resetAvatarPreview();
        showAvatarMessage(errorMsg, 'error');
        return;
    }

    // Valid file: store and show preview
    selectedAvatarFile = file;
    hideAvatarMessage();

    // Show preview using FileReader
    const reader = new FileReader();
    reader.onload = (ev) => {
        originalAvatarUrl = getCurrentAvatarUrl(); // Save current avatar for cancel
        avatarImg.src = ev.target.result;
        avatarImg.style.display = '';
        avatarPlaceholder.style.display = 'none';
        infoAvatar.src = ev.target.result;

        // Show action buttons
        avatarActions.style.display = 'flex';
    };
    reader.readAsDataURL(file);
}

// ============================================================
// Avatar: Cancel preview → restore original avatar
// ============================================================
function cancelAvatarPreview() {
    selectedAvatarFile = null;
    hideAvatarMessage();

    // Restore original avatar
    avatarImg.src = originalAvatarUrl || getCurrentAvatarUrl();
    avatarImg.style.display = '';
    avatarPlaceholder.style.display = 'none';
    infoAvatar.src = avatarImg.src;

    // Restore buttons
    avatarActions.style.display = 'none';

    // Reset input
    avatarInput.value = '';
}

// ============================================================
// Avatar: Reset preview to current saved avatar
// (Used when validation fails or after successful upload)
// ============================================================
function resetAvatarPreview() {
    const url = getCurrentAvatarUrl();
    avatarImg.src = url;
    avatarImg.style.display = '';
    avatarPlaceholder.style.display = 'none';
    infoAvatar.src = url;
    avatarActions.style.display = 'none';
}

// ============================================================
// Avatar: Upload avatar to backend
// ============================================================
async function uploadAvatar() {
    if (!selectedAvatarFile) return;

    // Build FormData with fullname + avatar
    const formData = new FormData();
    formData.append('fullname', currentUser.fullname || '');
    formData.append('avatar', selectedAvatarFile);

    // Disable save button while uploading
    saveAvatarBtn.disabled = true;
    cancelAvatarBtn.disabled = true;

    try {
        const response = await api.put('/profile', formData);
        if (response.success) {
            // Backend may return updated user data directly (response.data),
            // or may only return success — in that case re-fetch the profile.
            let newUser = response.data;
            if (!newUser || !newUser.avatar) {
                const profileResp = await api.get('/profile');
                if (profileResp.success) {
                    newUser = profileResp.data;
                }
            }
            if (!newUser) {
                resetAvatarPreview();
                showAvatarMessage('Không thể cập nhật ảnh đại diện.', 'error');
                return;
            }

            // Update UI with new avatar
            const newAvatarUrl = getMediaUrl(newUser.avatar);
            avatarImg.src = newAvatarUrl;
            avatarImg.style.display = '';
            avatarPlaceholder.style.display = 'none';
            infoAvatar.src = newAvatarUrl;

            // Update currentUser
            currentUser = newUser;

            // Update localStorage.user
            const localUser = authService.getCurrentUser();
            if (localUser) {
                localUser.avatar = newUser.avatar;
                localUser.fullname = newUser.fullname || localUser.fullname;
                localStorage.setItem('user', JSON.stringify(localUser));
            }

            // Reset state
            selectedAvatarFile = null;
            originalAvatarUrl = null;
            avatarActions.style.display = 'none';
            avatarInput.value = '';

            // Show success message
            showAvatarMessage('Cập nhật ảnh đại diện thành công!', 'success');

            // Refresh header so new avatar appears immediately
            if (typeof window.refreshHeaderStreak === 'function') {
                window.refreshHeaderStreak();
            }
        } else {
            resetAvatarPreview();
            showAvatarMessage(response.message || 'Không thể cập nhật ảnh đại diện.', 'error');
        }
    } catch (err) {
        console.error('uploadAvatar error:', err);
        resetAvatarPreview();
        if (err.data && err.data.message) {
            showAvatarMessage(err.data.message, 'error');
        } else {
            showAvatarMessage(err.message || 'Lỗi khi tải ảnh lên.', 'error');
        }
    } finally {
        saveAvatarBtn.disabled = false;
        cancelAvatarBtn.disabled = false;
    }
}

// ============================================================
// Render Profile Data
// ============================================================
function renderProfile(user) {
    // --- Header ---
    headerFullname.textContent = user.fullname || '—';
    headerEmail.textContent = user.email || '—';

    // Avatar: use avatar from API if available, else generate from name
    // Resolve /uploads/ paths to full backend URLs via getMediaUrl
    const avatarUrl = user.avatar ? getMediaUrl(user.avatar) : buildAvatarUrl(user.fullname);
    avatarImg.src = avatarUrl;
    avatarImg.style.display = '';
    avatarPlaceholder.style.display = 'none';

    // --- Streak ---
    displayStreak.textContent = user.streak != null ? user.streak : 0;

    // --- Info rows ---
    infoAvatar.src = avatarUrl;
    displayFullname.textContent = user.fullname || '—';
    displayUsername.textContent = user.username || '—';
    displayEmail.textContent = user.email || '—';

    // --- Roadmap ---
    if (user.roadmap_id) {
        currentRoadmapText.textContent = `Lộ trình #${user.roadmap_id}`;
        currentRoadmapText.className = 'roadmap-name';
    } else {
        currentRoadmapText.textContent = 'Chưa chọn lộ trình';
        currentRoadmapText.className = 'roadmap-none';
    }

    // Store current user data
    currentUser = user;
}

// ============================================================
// Load Profile from API
// ============================================================
async function loadProfile() {
    try {
        showLoading();
        const response = await api.get('/profile');
        if (response.success) {
            renderProfile(response.data);
        } else {
            showMessage(roadmapMessage, response.message || 'Không thể tải thông tin người dùng.', 'error');
        }
    } catch (err) {
        console.error('loadProfile error:', err);
        showMessage(roadmapMessage, err.message || 'Lỗi khi tải thông tin người dùng.', 'error');
    } finally {
        hideLoading();
    }
}

// ============================================================
// Load Roadmaps (if supported by backend)
// Note: Backend currently has no GET endpoint for roadmaps.
//       This function is a placeholder for future use.
// ============================================================
async function loadRoadmaps() {
    try {
        // Backend does not have a GET /api/roadmaps endpoint.
        // If one is added in the future, call it here and populate #roadmapSelect.
        // Example: const response = await api.get('/roadmaps');
        // Then populate roadmapSelect with options.
        // For now, the roadmap update form remains hidden.
        roadmapUpdateForm.style.display = 'none';
    } catch (err) {
        // Silently fail - roadmap listing is not available
        console.warn('loadRoadmaps: Backend does not support listing roadmaps.');
        roadmapUpdateForm.style.display = 'none';
    }
}

// ============================================================
// Update Profile (Fullname)
// ============================================================
async function updateProfile() {
    const newFullname = fullnameInput.value.trim();

    // Validate
    if (!newFullname) {
        alert('Vui lòng nhập họ tên mới.');
        return;
    }

    try {
        const response = await api.put('/profile', { fullname: newFullname });
        if (response.success) {
            // Update local display
            displayFullname.textContent = newFullname;
            headerFullname.textContent = newFullname;

            // Update avatar if using generated one
            if (!currentUser.avatar) {
                const newAvatarUrl = buildAvatarUrl(newFullname);
                avatarImg.src = newAvatarUrl;
                infoAvatar.src = newAvatarUrl;
            }

            // Update current user
            currentUser.fullname = newFullname;

            // Update localStorage user
            const localUser = authService.getCurrentUser();
            if (localUser) {
                localUser.fullname = newFullname;
                localStorage.setItem('user', JSON.stringify(localUser));
            }

            // Hide edit form
            showEditForm(false);
            alert('Cập nhật thông tin thành công!');
        } else {
            alert(response.message || 'Cập nhật thất bại.');
        }
    } catch (err) {
        console.error('updateProfile error:', err);
        alert(err.message || 'Lỗi khi cập nhật thông tin.');
    }
}

// ============================================================
// Toggle Edit Fullname Form
// ============================================================
function showEditForm(show) {
    if (show) {
        fullnameInput.value = currentUser ? currentUser.fullname || '' : '';
        editFullnameForm.style.display = 'flex';
        editFullnameBtn.style.display = 'none';
        displayFullname.style.display = 'none';
        fullnameInput.focus();
    } else {
        editFullnameForm.style.display = 'none';
        editFullnameBtn.style.display = '';
        displayFullname.style.display = '';
    }
}

// ============================================================
// Change Password
// ============================================================
async function changePassword(e) {
    e.preventDefault();

    // Hide previous message
    hideMessage(passwordMessage);

    // Get values
    const oldPw = currentPassword.value.trim();
    const newPw = newPassword.value.trim();
    const confirmPw = confirmPassword.value.trim();

    // Validate
    if (!oldPw || !newPw || !confirmPw) {
        showMessage(passwordMessage, 'Vui lòng điền đầy đủ thông tin.', 'error');
        return;
    }

    if (newPw.length < 8) {
        showMessage(passwordMessage, 'Mật khẩu mới phải tối thiểu 8 ký tự.', 'error');
        return;
    }

    if (newPw !== confirmPw) {
        showMessage(passwordMessage, 'Mật khẩu mới và xác nhận không khớp.', 'error');
        return;
    }

    // Send request
    try {
        setButtonLoading(changePasswordBtn, true);
        const response = await api.put('/auth/change-password', {
            oldPassword: oldPw,
            newPassword: newPw
        });
        if (response.success) {
            // Reset form
            passwordForm.reset();
            showMessage(passwordMessage, response.message || 'Đổi mật khẩu thành công!', 'success');
        } else {
            showMessage(passwordMessage, response.message || 'Đổi mật khẩu thất bại.', 'error');
        }
    } catch (err) {
        console.error('changePassword error:', err);

        // Backend error message
        if (err.data && err.data.message) {
            showMessage(passwordMessage, err.data.message, 'error');
        } else {
            showMessage(passwordMessage, err.message || 'Lỗi khi đổi mật khẩu.', 'error');
        }
    } finally {
        setButtonLoading(changePasswordBtn, false);
    }
}

// ============================================================
// Change Roadmap
// Note: Backend has PUT /api/profile/roadmap but no GET listing.
//       This function is prepared for when the listing is available.
// ============================================================
async function changeRoadmap() {
    const selectedId = parseInt(roadmapSelect.value, 10);

    if (!selectedId || selectedId <= 0) {
        showMessage(roadmapMessage, 'Vui lòng chọn lộ trình.', 'error');
        return;
    }

    try {
        updateRoadmapBtn.disabled = true;
        const response = await api.put('/profile/roadmap', { roadmap_id: selectedId });
        if (response.success) {
            showMessage(roadmapMessage, 'Cập nhật lộ trình thành công!', 'success');
            // Update display
            currentRoadmapText.textContent = `Lộ trình #${selectedId}`;
            currentRoadmapText.className = 'roadmap-name';
        } else {
            showMessage(roadmapMessage, response.message || 'Cập nhật lộ trình thất bại.', 'error');
        }
    } catch (err) {
        console.error('changeRoadmap error:', err);
        if (err.data && err.data.message) {
            showMessage(roadmapMessage, err.data.message, 'error');
        } else {
            showMessage(roadmapMessage, err.message || 'Lỗi khi cập nhật lộ trình.', 'error');
        }
    } finally {
        updateRoadmapBtn.disabled = false;
    }
}

// ============================================================
// Logout
// ============================================================
function logout() {
    // Ask for confirmation
    const confirmed = confirm('Bạn có chắc chắn muốn đăng xuất?');
    if (!confirmed) return;

    // Use existing authService logout mechanism
    // Backend does not have a logout API, so just remove token and redirect
    authService.logout();

    // Redirect to login page
    window.location.href = '../auth/login.html';
}

// ============================================================
// Bind Events
// ============================================================
function bindEvents() {
    // Avatar upload: trigger file picker
    changeAvatarBtn.addEventListener('click', openAvatarPicker);
    editAvatarBtn.addEventListener('click', openAvatarPicker);

    // Avatar: file selected → validate + preview
    avatarInput.addEventListener('change', handleAvatarFileSelected);

    // Avatar: save / cancel
    saveAvatarBtn.addEventListener('click', uploadAvatar);
    cancelAvatarBtn.addEventListener('click', cancelAvatarPreview);

    // Edit fullname toggle
    editFullnameBtn.addEventListener('click', () => showEditForm(true));
    cancelFullnameBtn.addEventListener('click', () => showEditForm(false));

    // Save fullname
    saveFullnameBtn.addEventListener('click', updateProfile);
    fullnameInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            updateProfile();
        }
        if (e.key === 'Escape') {
            showEditForm(false);
        }
    });

    // Change password
    passwordForm.addEventListener('submit', changePassword);

    // Update roadmap
    updateRoadmapBtn.addEventListener('click', changeRoadmap);

    // Logout
    logoutBtn.addEventListener('click', logout);
}

// ============================================================
// Init
// ============================================================
async function init() {
    // Check authentication
    if (!authService.isAuthenticated()) {
        window.location.href = '../auth/login.html';
        return;
    }

    // Load shared components (header, bottom-nav)
    await loadAllComponents();

    // Bind UI events
    bindEvents();

    // Load profile data
    await loadProfile();

    // Try to load roadmaps (will be hidden if not supported)
    await loadRoadmaps();
}

// ============================================================
// Start
// ============================================================
document.addEventListener('DOMContentLoaded', init);