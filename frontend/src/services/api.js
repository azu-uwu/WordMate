/**
 * HTTP client wrapper using fetch().
 * Automatically attaches JWT token from localStorage,
 * handles HTTP errors, and parses JSON responses.
 */

const BASE_URL = 'http://localhost:5000/api';
const MEDIA_BASE_URL = 'http://localhost:5000';

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
 * Convert relative media path from API to full backend URL.
 * Example:
 * "/uploads/images/example.png"
 * -> "http://localhost:5000/uploads/images/example.png"
 */
function getMediaUrl(path) {
  if (!path) return null;

  // Nếu đã là URL đầy đủ thì giữ nguyên
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }

  // Nếu là đường dẫn tương đối từ backend
  if (path.startsWith('/uploads/')) {
    return `${MEDIA_BASE_URL}${path}`;
  }

  return path;
}

/**
 * Internal request function.
 * @param {string} endpoint - API endpoint (e.g. '/auth/login')
 * @param {object} options - Fetch options (method, body, headers, etc.)
 * @returns {Promise<object>} Parsed JSON response
 */
async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;

  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  const token = getToken();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(url, config);

  // Handle 204 No Content
  if (response.status === 204) {
    return null;
  }

  const data = await response.json();

  if (!response.ok) {
    if (response.status === 401) {
      // Chỉ redirect nếu KHÔNG phải API Login
      if (endpoint !== '/auth/login') {
        removeToken();
        window.location.href = '../pages/auth/login.html';
      }

    }

    if (response.status === 403) {
      alert('Bạn không có quyền thực hiện chức năng này.');
    }

    const error = new Error(data.message || 'Yêu cầu thất bại');
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

/**
 * HTTP GET request.
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>}
 */
function get(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'GET' });
}

/**
 * HTTP POST request.
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>}
 */
function post(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'POST',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PUT request.
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>}
 */
function put(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'PUT',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP PATCH request.
 * @param {string} endpoint - API endpoint
 * @param {object} body - Request body
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>}
 */
function patch(endpoint, body, options = {}) {
  return request(endpoint, {
    ...options,
    method: 'PATCH',
    body: JSON.stringify(body)
  });
}

/**
 * HTTP DELETE request.
 * @param {string} endpoint - API endpoint
 * @param {object} options - Additional fetch options
 * @returns {Promise<object>}
 */
function del(endpoint, options = {}) {
  return request(endpoint, { ...options, method: 'DELETE' });
}

export { get, post, put, patch, del, getMediaUrl };
export default { get, post, put, patch, del, getMediaUrl };