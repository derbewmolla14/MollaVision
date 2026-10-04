import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  me: () => api.get('/auth/me'),
};

export const courseAPI = {
  list: (params) => api.get('/courses', { params }),
  get: (courseId) => api.get(`/courses/${courseId}`),
};

export const progressAPI = {
  list: () => api.get('/progress'),
  completeLesson: (lessonId) => api.post(`/progress/lessons/${lessonId}/complete`),
};

export const lessonAPI = {
  list: (courseId) => api.get(`/lessons/course/${courseId}`),
  get: (lessonId) => api.get(`/lessons/${lessonId}`),
};

export const adminAPI = {
  statistics: () => api.get('/admin/statistics'),
};

export default api;