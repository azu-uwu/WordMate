/**
 * Logger utility with multiple log levels (INFO, WARN, ERROR).
 * - Development: logs to console.
 * - Production: logs to file (logs/app.log).
 */

const fs = require('fs');
const path = require('path');

const LOG_DIR = path.join(__dirname, '../../logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

/**
 * Get the current timestamp string.
 * @returns {string} Formatted timestamp [YYYY-MM-DD HH:mm:ss]
 */
function getTimestamp() {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `[${year}-${month}-${day} ${hours}:${minutes}:${seconds}]`;
}

/**
 * Format a log entry.
 * @param {string} level - Log level (INFO, WARN, ERROR)
 * @param {string} message - Log message
 * @param {object} context - Additional context object
 * @returns {string} Formatted log line
 */
function formatLog(level, message, context = {}) {
  const timestamp = getTimestamp();
  let line = `${timestamp} [${level}] ${message}`;
  if (Object.keys(context).length > 0) {
    line += ` ${JSON.stringify(context)}`;
  }
  return line;
}

/**
 * Write a log entry to the log file (production mode).
 * Creates the logs directory if it does not exist.
 * @param {string} line - Formatted log line
 */
function writeToFile(line) {
  try {
    if (!fs.existsSync(LOG_DIR)) {
      fs.mkdirSync(LOG_DIR, { recursive: true });
    }
    fs.appendFileSync(LOG_FILE, line + '\n', 'utf8');
  } catch (err) {
    console.error('Failed to write log file:', err.message);
  }
}

/**
 * Determine if the environment is production.
 * @returns {boolean}
 */
function isProduction() {
  return process.env.NODE_ENV === 'production';
}

/**
 * Log an INFO level message.
 * @param {string} message - Log message
 * @param {object} context - Additional context (optional)
 */
function info(message, context = {}) {
  const line = formatLog('INFO', message, context);
  if (isProduction()) {
    writeToFile(line);
  } else {
    console.log(line);
  }
}

/**
 * Log a WARN level message.
 * @param {string} message - Log message
 * @param {object} context - Additional context (optional)
 */
function warn(message, context = {}) {
  const line = formatLog('WARN', message, context);
  if (isProduction()) {
    writeToFile(line);
  } else {
    console.warn(line);
  }
}

/**
 * Log an ERROR level message.
 * @param {string} message - Log message
 * @param {object} context - Additional context (optional)
 */
function error(message, context = {}) {
  const line = formatLog('ERROR', message, context);
  if (isProduction()) {
    writeToFile(line);
  } else {
    console.error(line);
  }
}

module.exports = {
  info,
  warn,
  error
};