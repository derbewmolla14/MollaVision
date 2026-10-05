import axios from 'axios';

let authTokenProvider = null;

export const setAuthTokenProvider = (provider) => {
  authTokenProvider = provider;
};

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL?.trim() || (import.meta.env.DEV ? 'http://localhost:5000/api' : '/api'),
  withCredentials: true,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(async (config) => {
  if (authTokenProvider) {
    const token = await authTokenProvider();
    if (token) config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const authAPI = {
  register: (payload) => api.post('/auth/register', payload),
  login: (payload) => api.post('/auth/login', payload),
  logout: () => api.post('/auth/logout'),
  getMe: () => api.get('/auth/me'),
  forgotPassword: (email) => api.post('/auth/forgot-password', { email }),
  resetPassword: (token, payload) => api.post(`/auth/reset-password/${token}`, payload),
};

export const courseAPI = {
  list: (params) => api.get('/courses', { params }),
  get: (courseId) => api.get(`/courses/${courseId}`),
  create: (payload) => api.post('/courses', payload),
  update: (courseId, payload) => api.put(`/courses/${courseId}`, payload),
  remove: (courseId) => api.delete(`/courses/${courseId}`),
};

export const chapterAPI = {
  list: (courseId) => api.get(`/chapters/course/${courseId}`),
  create: (courseId, payload) => api.post(`/chapters/course/${courseId}`, payload),
  update: (chapterId, payload) => api.put(`/chapters/${chapterId}`, payload),
  remove: (chapterId) => api.delete(`/chapters/${chapterId}`),
};

export const lessonAdminAPI = {
  list: (courseSlug) => api.get(`/lessons/course/${courseSlug}`),
  create: (courseId, payload) => api.post(`/lessons/course/${courseId}`, payload),
  update: (lessonId, payload) => api.put(`/lessons/${lessonId}`, payload),
  remove: (lessonId) => api.delete(`/lessons/${lessonId}`),
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
  users: (params) => api.get('/admin/users', { params }),
  user: (userId) => api.get(`/admin/users/${userId}`),
  updateRole: (userId, role) => api.patch(`/admin/users/${userId}/role`, { role }),
  updateStatus: (userId, status) => api.patch(`/admin/users/${userId}/status`, { status }),
  deleteUser: (userId) => api.delete(`/admin/users/${userId}`),
  submissions: (params) => api.get('/admin/submissions', { params }),
  submission: (submissionId) => api.get(`/admin/submissions/${submissionId}`),
  gradeSubmission: (submissionId, payload) => api.patch(`/admin/submissions/${submissionId}/grade`, payload),
};

export const practiceAPI = {
  list: (params) => api.get('/practices', { params }),
  get: (practiceId) => api.get(`/practices/${practiceId}`),
  create: (payload) => api.post('/practices', payload),
  update: (practiceId, payload) => api.put(`/practices/${practiceId}`, payload),
  remove: (practiceId) => api.delete(`/practices/${practiceId}`),
  submit: (practiceId, answers) => api.post(`/practices/${practiceId}/submit`, { answers }),
  mySubmissions: () => api.get('/practices/submissions/me'),
};

export default api;