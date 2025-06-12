// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api', // URL do seu backend
});

// Interceptor para adicionar o token JWT
api.interceptors.request.use((config) => {
  const authData = localStorage.getItem('auth');
  if (authData) {
    const { token } = JSON.parse(authData);
    if (token) {
      config.headers['x-auth-token'] = token; // Ou 'Authorization': `Bearer ${token}` se usar Bearer
    }
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default api;