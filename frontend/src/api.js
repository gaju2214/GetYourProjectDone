import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  // Optional: Add headers or timeout here
});

export default api;