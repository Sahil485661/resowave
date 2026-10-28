/**
 * Formats a given time in seconds to mm:ss format.
 * @param {number} seconds
 * @returns {string} e.g. "03:45" or "0:00"
 */
export function formatTime(seconds) {
  if (!seconds || isNaN(seconds) || seconds < 0) {
    return '0:00';
  }

  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);

  return `${mins}:${secs.toString().padStart(2, '0')}`;
}
