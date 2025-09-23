import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
    withCredentials: true
  // Optional: Add headers or timeout here
});

export default api;


