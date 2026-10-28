import api from './axios';

/**
 * Uploads an artist music track with real-time upload progress tracking.
 * @param {Object} params
 * @param {string} params.title - Track title
 * @param {File} params.file - Native audio file object
 * @param {Function} [params.onUploadProgress] - Axios progress callback
 * @returns {Promise<Object>}
 */
export async function uploadMusic({ title, file, onUploadProgress }) {
  const formData = new FormData();
  formData.append('title', title);
  formData.append('file', file); // Native File object from input
  formData.append('music', file); // Compatibility alias

  try {
    const response = await api.post('/music/upload', formData, {
      onUploadProgress,
    });
    return response.data;
  } catch (error) {
    // Graceful fallback to /music/create_music if backend route varies
    if (error.response?.status === 404) {
      const fallbackResponse = await api.post('/music/create_music', formData, {
        onUploadProgress,
      });
      return fallbackResponse.data;
    }
    throw error;
  }
}

/**
 * Fetches all available music tracks from MongoDB
 */
export async function fetchAllMusic() {
  const response = await api.get('/music');
  return Array.isArray(response.data) ? response.data : (response.data?.musics || []);
}

/**
 * Permanently deletes a track from DB and purges file from ImageKit
 * @param {string} id
 */
export async function deleteMusic(id) {
  const response = await api.delete(`/music/${id}`);
  return response.data;
}
