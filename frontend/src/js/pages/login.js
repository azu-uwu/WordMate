/**
 * Login page logic.
 * Handles form submission, validation, and redirect after successful login.
 * Uses authService for API calls (not fetch() directly).
 */
import authService from '../../services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('loginForm');
    const messageEl = document.getElementById('message');
    const submitBtn = document.getElementById('loginBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous message
        messageEl.textContent = '';
        messageEl.className = 'login-message';
        form.classList.remove('was-validated');

        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageEl.textContent = 'Email không hợp lệ';
            messageEl.className = 'login-message login-message--error';
            return;
        }

        // Validate password not empty
        if (!password) {
            messageEl.textContent = 'Mật khẩu không được để trống';
            messageEl.className = 'login-message login-message--error';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');

        try {
            const response = await authService.login(email, password);

            // authService.login() returns response.data = { token, user }
            // authService already saved token and user to localStorage
            const user = response.user;

            // Redirect based on roadmap_id
            if (user.roadmap_id === null || user.roadmap_id === undefined) {
                window.location.href = '../dashboard/onboarding.html';
            } else {
                window.location.href = '../dashboard/dashboard.html';
            }
        } catch (error) {
            // Display error message from Backend if available
            messageEl.textContent = error.message || 'Đăng nhập thất bại. Vui lòng thử lại.';
            messageEl.className = 'login-message login-message--error';
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    });
});