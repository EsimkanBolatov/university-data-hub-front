import axios from 'axios';

// Используем переменную окружения или localhost по умолчанию
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Интерцептор для добавления токена к каждому запросу
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

// --- API AUTH (Соответствует v2) ---
export const authAPI = {
  // FastAPI ожидает x-www-form-urlencoded для OAuth2 формы
  login: (credentials) =>
    apiClient.post('/auth/login', new URLSearchParams(credentials), {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    }),
  register: (userData) => apiClient.post('/auth/register', userData),
  getMe: () => apiClient.get('/auth/me'),
};

// --- API UNIVERSITIES & CATALOG (Исправлено под v2) ---
export const universitiesAPI = {
  // ОБНОВЛЕНО: Теперь используем роутер /catalog для поиска и фильтрации
  getAll: (params = {}) => apiClient.get('/catalog/universities', { params }),

  // Детальная страница скорее всего осталась на базовом роутере или переехала в catalog
  // Обычно ID доступен напрямую, оставим совместимость, если бэкенд поддерживает
  getById: (id) => apiClient.get(`/universities/${id}`),

  getStats: () => apiClient.get('/universities/stats'),

  // Сравнение обычное (по характеристикам)
  compare: (ids) => apiClient.post('/universities/compare', { ids }),
};

// --- API FAVORITES (Исправлено под v2 - новый роутер) ---
export const favoritesAPI = {
  // В v2 избранное вынесено в отдельный роутер /favorites
  addToFavorites: (id) => apiClient.post(`/favorites/add/${id}`),
  removeFromFavorites: (id) => apiClient.delete(`/favorites/remove/${id}`), // Предполагаемый путь для v2
  getFavorites: () => apiClient.get('/favorites/my'),
  checkIsFavorite: (id) => apiClient.get(`/favorites/check/${id}`),
};

// --- API AI (Соответствует v2) ---
export const aiAPI = {
  // Чат с RAG
  chat: (question) => apiClient.post('/ai/chat', { question }),

  // Персональные рекомендации
  recommend: (data) => apiClient.post('/ai/recommend', data),

  // AI Сравнение
  compare: (ids) => apiClient.post('/ai/compare', { university_ids: ids }),

  // Синхронизация (для админки)
  sync: () => apiClient.post('/ai/sync'),
};

export default apiClient;