import axios from 'axios';
import { Capacitor } from '@capacitor/core';

// Determine the API base URL
// For mobile apps (Capacitor), always use the Render backend
// For web, use environment variable or default to Render backend
const getBaseURL = () => {
  // If REACT_APP_API_URL is set, use it
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }
  
  // If running in Capacitor (mobile app), use Render backend
  if (Capacitor.isNativePlatform()) {
    return 'https://ambucheck-compliance-system.onrender.com';
  }
  
  // For web development, use localhost
  return 'http://localhost:5001';
};

const api = axios.create({
  baseURL: getBaseURL(),
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add token to requests if available
api.interceptors.request.use(
  (config) => {
    // Prefer sessionStorage, but fall back to localStorage for any legacy token
    let token = sessionStorage.getItem('token');
    if (!token) {
      token = localStorage.getItem('token');
    }
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      // Clear any stored tokens and allow AuthContext / routing to handle redirect
      sessionStorage.removeItem('token');
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;

