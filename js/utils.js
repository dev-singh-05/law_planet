/**
 * Utility Functions
 * Helper functions for formatting, UI operations, etc.
 */

/**
 * Format date to readable string
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return date.toLocaleDateString('en-IN', options);
}

/**
 * Format date to simple date (no time)
 * @param {string} dateString - ISO date string
 * @returns {string} Formatted date
 */
export function formatSimpleDate(dateString) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  const options = {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  };

  return date.toLocaleDateString('en-IN', options);
}

/**
 * Format time to relative time (e.g., "2 hours ago")
 * @param {string} dateString - ISO date string
 * @returns {string} Relative time
 */
export function formatRelativeTime(dateString) {
  if (!dateString) return 'Never';

  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;

  return formatSimpleDate(dateString);
}

/**
 * Parse comma-separated string to array
 * @param {string} str - Comma-separated string
 * @returns {Array} Array of trimmed strings
 */
export function parseCommaSeparated(str) {
  if (!str) return [];
  return str.split(',').map(item => item.trim()).filter(item => item);
}

/**
 * Join array to comma-separated string
 * @param {Array} arr - Array of strings
 * @returns {string} Comma-separated string
 */
export function joinWithCommas(arr) {
  if (!arr || !Array.isArray(arr)) return '';
  return arr.join(', ');
}

/**
 * Show error message in a div
 * @param {HTMLElement} element - Error div element
 * @param {string} message - Error message
 */
export function showError(element, message) {
  if (!element) return;
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.textContent = '';
    element.style.display = 'none';
  }, 5000);
}

/**
 * Show success message in a div
 * @param {HTMLElement} element - Success div element
 * @param {string} message - Success message
 */
export function showSuccess(element, message) {
  if (!element) return;
  element.textContent = message;
  element.style.display = 'block';
  setTimeout(() => {
    element.textContent = '';
    element.style.display = 'none';
  }, 3000);
}

/**
 * Clear all messages (error and success)
 * @param {HTMLElement} errorElement - Error div element
 * @param {HTMLElement} successElement - Success div element
 */
export function clearMessages(errorElement, successElement) {
  if (errorElement) {
    errorElement.textContent = '';
    errorElement.style.display = 'none';
  }
  if (successElement) {
    successElement.textContent = '';
    successElement.style.display = 'none';
  }
}

/**
 * Format currency in INR
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export function formatCurrency(amount) {
  if (!amount && amount !== 0) return 'Not specified';
  return `₹${amount.toLocaleString('en-IN')}`;
}

/**
 * Sanitize HTML to prevent XSS
 * @param {string} text - Text to sanitize
 * @returns {string} Sanitized text
 */
export function sanitizeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Switch active tab/section
 * @param {string} sectionId - ID of section to show
 */
export function switchSection(sectionId) {
  // Hide all sections
  const sections = document.querySelectorAll('.content-section');
  sections.forEach(section => {
    section.classList.remove('active');
    section.style.display = 'none';
  });

  // Show selected section
  const activeSection = document.getElementById(sectionId);
  if (activeSection) {
    activeSection.classList.add('active');
    activeSection.style.display = 'block';
  }

  // Update sidebar active state
  const navButtons = document.querySelectorAll('.sidebar-nav a, .sidebar-nav button');
  navButtons.forEach(btn => {
    btn.classList.remove('active');
    if (btn.getAttribute('data-section') === sectionId) {
      btn.classList.add('active');
    }
  });
}

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Create empty state message
 * @param {string} message - Message to display
 * @returns {HTMLElement} Empty state element
 */
export function createEmptyState(message) {
  const div = document.createElement('div');
  div.className = 'empty-state';
  div.innerHTML = `
    <h3>${message}</h3>
  `;
  return div;
}
