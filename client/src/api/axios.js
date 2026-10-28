import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 20000,
});

// Request Interceptor: Ensure FormData requests let browser set multipart boundaries & attach Bearer fallback
api.interceptors.request.use(
  (config) => {
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type'];
    }
    const token = localStorage.getItem('resowave_token') || localStorage.getItem('token');
    if (token && !config.headers['Authorization']) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error Normalization & Auth Handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const serverMessage = error.response?.data?.message;

    error.userMessage =
      serverMessage ||
      error.message ||
      'An unexpected error occurred. Please try again.';

    if (status === 401) {
      // Exclude /auth/me to prevent bootstrapping checks from triggering logout loops
      const url = error.config?.url || '';
      if (!url.includes('/auth/me')) {
        window.dispatchEvent(
          new CustomEvent('spotify:unauthorized', {
            detail: { message: error.userMessage },
          })
        );
      }
    }

    if (status === 403) {
      window.dispatchEvent(
        new CustomEvent('spotify:forbidden', {
          detail: { message: error.userMessage },
        })
      );
    }

    return Promise.reject(error);
  }
);

export default api;
