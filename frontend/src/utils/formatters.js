/**
 * Formats an ISO datetime string into a readable format.
 * Example: "Oct 12, 2024, 02:30 PM"
 */
export const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  
  const date = new Date(dateString);
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Truncates a long prompt string for table views.
 */
export const truncateText = (text, maxLength = 60) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Formats a raw confidence score (0.0 to 1.0) into a percentage string.
 * Example: 0.985 -> "98.5%"
 */
export const formatConfidence = (value) => {
  if (value === null || value === undefined) return '0.0%';
  return `${(value * 100).toFixed(1)}%`;
};

/**
 * Formats latency metrics in milliseconds for display.
 */
export const formatLatency = (ms) => {
  if (ms === null || ms === undefined) return '0ms';
  if (ms > 1000) {
    return `${(ms / 1000).toFixed(2)}s`;
  }
  return `${Math.round(ms)}ms`;
};

/**
 * Capitalizes the first letter of a string.
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};