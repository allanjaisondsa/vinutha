import axios from 'axios';

// In dev: VITE_API_BASE = http://localhost:5000/api
// In prod: VITE_API_BASE = /api  (relative, same server)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || '/api',
  withCredentials: true,
});

// Use this anywhere you need to prefix /uploads/ paths with the server origin
// In dev: http://localhost:5000   In prod: '' (same origin)
export const SERVER_URL = import.meta.env.VITE_SERVER_URL || '';

export default api;
