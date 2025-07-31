import axios from 'axios'

const API_BASE_URL = 'http://localhost:8000/api'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Token ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data) => api.post('/users/register/', data),
  login: (data) => api.post('/users/login/', data),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (data) => api.put('/users/profile/update/', data),
  changePassword: (data) => api.post('/users/change-password/', data),
  healthCheck: () => api.get('/users/profile/'), // Simple health check
}

// Topics API
export const topicsAPI = {
  getAll: (params) => api.get('/notes/topics/', { params }),
  getById: (id) => api.get(`/notes/topics/${id}/`),
  create: (data) => api.post('/notes/topics/', data),
  update: (id, data) => api.put(`/notes/topics/${id}/`, data),
  delete: (id) => api.delete(`/notes/topics/${id}/`),
  generateNotes: (id) => api.post(`/notes/topics/${id}/generate/`),
  regenerateNotes: (id) => api.post(`/notes/topics/${id}/regenerate/`),
  getAnalytics: () => api.get('/notes/topics/analytics/'),
}

// Notes API
export const notesAPI = {
  getAll: (params) => api.get('/notes/notes/', { params }),
  getById: (id) => api.get(`/notes/notes/${id}/`),
  rateNote: (id, rating) => api.post(`/notes/notes/${id}/rate/`, { rating }),
}

// Subjects API
export const subjectsAPI = {
  getAll: () => api.get('/notes/subjects/'),
}

// Preferences API
export const preferencesAPI = {
  get: () => api.get('/notes/preferences/'),
  update: (data) => api.put('/notes/preferences/', data),
}

// AI Service API
export const aiServiceAPI = {
  getStatus: () => api.get('/ai/status/'),
  getStats: () => api.get('/ai/stats/'),
  getLogs: () => api.get('/ai/logs/'),
  getTemplates: () => api.get('/ai/templates/'),
}

export default api 