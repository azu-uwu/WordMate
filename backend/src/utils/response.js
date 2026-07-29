/**
 * Utility functions for standardizing API response format.
 * All controllers should use these functions to ensure consistent JSON responses.
 */

/**
 * Send a success response.
 * @param {import('express').Response} res - Express response object
 * @param {*} data - Response data payload
 * @param {string} message - Success message
 * @param {number} statusCode - HTTP status code (default: 200)
 */
function successResponse(res, data, message = 'Success', statusCode = 200) {
  return res.status(statusCode).json({
    success: true,
    message,
    data
  });
}

/**
 * Send an error response.
 * @param {import('express').Response} res - Express response object
 * @param {string} message - Error message
 * @param {number} statusCode - HTTP status code (default: 500)
 */
function errorResponse(res, message = 'Error', statusCode = 500) {
  return res.status(statusCode).json({
    success: false,
    message
  });
}

/**
 * Send a created (201) response.
 * @param {import('express').Response} res - Express response object
 * @param {*} data - Response data payload
 * @param {string} message - Success message (default: 'Created')
 */
function createdResponse(res, data, message = 'Created') {
  return successResponse(res, data, message, 201);
}

module.exports = {
  successResponse,
  errorResponse,
  createdResponse
};