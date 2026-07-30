/**
 * Register page logic.
 * Handles form submission, validation, and redirect after successful registration.
 * Uses authService for API calls (not fetch() directly).
 */
import authService from '../../services/authService.js';

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('registerForm');
    const messageEl = document.getElementById('message');
    const submitBtn = document.getElementById('registerBtn');
    const btnText = submitBtn.querySelector('.btn-text');
    const btnSpinner = submitBtn.querySelector('.btn-spinner');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Clear previous message
        messageEl.textContent = '';
        messageEl.className = 'register-message';
        form.classList.remove('was-validated');

        const fullname = document.getElementById('fullname').value.trim();
        const username = document.getElementById('username').value.trim();
        const email = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Validate fullname
        if (!fullname) {
            messageEl.textContent = 'Full name không được để trống';
            messageEl.className = 'register-message register-message--error';
            return;
        }

        // Validate username
        if (!username) {
            messageEl.textContent = 'Username không được để trống';
            messageEl.className = 'register-message register-message--error';
            return;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            messageEl.textContent = 'Email không hợp lệ';
            messageEl.className = 'register-message register-message--error';
            return;
        }

        // Validate password minimum length
        if (password.length < 8) {
            messageEl.textContent = 'Password phải có ít nhất 8 ký tự';
            messageEl.className = 'register-message register-message--error';
            return;
        }

        // Validate confirm password matches
        if (password !== confirmPassword) {
            messageEl.textContent = 'Confirm password không khớp';
            messageEl.className = 'register-message register-message--error';
            return;
        }

        // Show loading state
        submitBtn.disabled = true;
        btnText.classList.add('d-none');
        btnSpinner.classList.remove('d-none');

        try {
            const response = await authService.register(username, fullname, email, password);

            // authService.register() returns response.data with token and user
            // authService already saved token and user to localStorage
            // Registration successful, show success message
            messageEl.textContent = response.message || 'Đăng ký thành công!';
            messageEl.className = 'register-message register-message--success';

            // Redirect to onboarding after 1 second
            setTimeout(() => {
                window.location.href = '../dashboard/onboarding.html';
            }, 1000);
        } catch (error) {
            // Display error message from Backend if available
            messageEl.textContent = error.message || 'Đăng ký thất bại. Vui lòng thử lại.';
            messageEl.className = 'register-message register-message--error';
        } finally {
            // Restore button state
            submitBtn.disabled = false;
            btnText.classList.remove('d-none');
            btnSpinner.classList.add('d-none');
        }
    });
});