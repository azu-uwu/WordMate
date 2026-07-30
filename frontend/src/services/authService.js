/**
 * Authentication service for Frontend.
 * Handles login, register, logout, and token management via localStorage.
 * Reuses api.js for HTTP requests - does NOT call fetch() directly.
 */
import api from './api.js';

/**
 * Login with email and password.
 * Calls POST /api/auth/login, saves token and user info to localStorage.
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Response data with token and user
 */
async function login(email, password) {
  const response = await api.post('/auth/login', { email, password });
  const { token, user } = response.data;

  if (token) {
    setToken(token);
  }

  if (user) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  return response.data;
}

/**
 * Register a new user.
 * Calls POST /api/auth/register, saves token and user info to localStorage.
 * Only sends username, fullname, email, password (NOT confirmPassword).
 * @param {string} username
 * @param {string} fullname
 * @param {string} email
 * @param {string} password
 * @returns {Promise<object>} Response data with token and user
 */
async function register(username, fullname, email, password) {
  const response = await api.post('/auth/register', {
    username,
    fullname,
    email,
    password
  });
  const { user_id, username: uname, fullname: fname, email: em, token } = response.data;

  if (token) {
    setToken(token);
  }

  const user = {
    id: user_id,
    username: uname,
    fullname: fname,
    email: em
  };
  localStorage.setItem('user', JSON.stringify(user));

  return response.data;
}

/**
 * Logout: remove token and user info from localStorage.
 */
function logout() {
  removeToken();
  localStorage.removeItem('user');
}

/**
 * Get the stored JWT token from localStorage.
 * @returns {string|null}
 */
function getToken() {
  return localStorage.getItem('token');
}

/**
 * Set the JWT token into localStorage.
 * @param {string} token
 */
function setToken(token) {
  localStorage.setItem('token', token);
}

/**
 * Remove the JWT token from localStorage.
 */
function removeToken() {
  localStorage.removeItem('token');
}

/**
 * Check if user is authenticated (token exists in localStorage).
 * @returns {boolean}
 */
function isAuthenticated() {
  return !!getToken();
}

/**
 * Get the current user info from localStorage.
 * @returns {object|null}
 */
function getCurrentUser() {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
}

export {
  login,
  register,
  logout,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  getCurrentUser
};

export default {
  login,
  register,
  logout,
  getToken,
  setToken,
  removeToken,
  isAuthenticated,
  getCurrentUser
};