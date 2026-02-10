// Axios Instance Configuration
import axios, { AxiosInstance, AxiosError } from 'axios';
import { getTokenFromStorage, clearTokenFromStorage } from './auth-utils';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

export const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - Add auth token
api.interceptors.request.use(
  (config) => {
    const token = getTokenFromStorage();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      clearTokenFromStorage();
      if (typeof window !== 'undefined') {
        window.location.href = '/auth/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
