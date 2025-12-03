import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
});

// Attach Authorization header with token from localStorage, if present
api.interceptors.request.use(
  (config) => {
    try {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      // Ignore localStorage errors in environments where it's not available
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;


