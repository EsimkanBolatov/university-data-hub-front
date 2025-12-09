import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// Создаем экземпляр axios
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor для добавления токена
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor для обработки ошибок
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Токен истек или невалиден
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API методы

// AUTH
export const authAPI = {
  login: (credentials) => 
    apiClient.post('/auth/login', new URLSearchParams(credentials), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  
  register: (userData) => apiClient.post('/auth/register', userData),
  
  getMe: () => apiClient.get('/auth/me'),
};

// UNIVERSITIES
export const universitiesAPI = {
  getAll: (params = {}) => apiClient.get('/universities/', { params }),
  
  getById: (id) => apiClient.get(`/universities/${id}`),
  
  getStats: () => apiClient.get('/universities/stats'),
  
  compare: (ids) => apiClient.post('/universities/compare', ids),
  
  addToFavorites: (id) => apiClient.post(`/universities/${id}/favorite`),
  
  removeFromFavorites: (id) => apiClient.delete(`/universities/${id}/favorite`),
  
  getFavorites: () => apiClient.get('/universities/favorites/my'),
  
  create: (data) => apiClient.post('/universities/', data),
  
  update: (id, data) => apiClient.patch(`/universities/${id}`, data),
  
  delete: (id) => apiClient.delete(`/universities/${id}`),
};

// PROGRAMS
export const programsAPI = {
  search: (params = {}) => apiClient.get('/universities/programs/search', { params }),
  
  create: (universityId, data) => 
    apiClient.post(`/universities/${universityId}/programs`, data),
};

// GRANTS
export const grantsAPI = {
  getByUniversity: (universityId) => 
    apiClient.get(`/universities/${universityId}/grants`),
  
  create: (universityId, data) => 
    apiClient.post(`/universities/${universityId}/grants`, data),
};

// ADMISSIONS
export const admissionsAPI = {
  getByUniversity: (universityId) => 
    apiClient.get(`/universities/${universityId}/admissions`),
  
  create: (universityId, data) => 
    apiClient.post(`/universities/${universityId}/admissions`, data),
};

export default apiClient;