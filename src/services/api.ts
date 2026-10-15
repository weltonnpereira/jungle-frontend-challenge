import axios, { AxiosInstance } from 'axios'

// Base URL points to /api or the current origin in browser environments
const API_BASE_URL = typeof window !== 'undefined' ? `${window.location.origin}/api` : '/api'

export const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
})

// Request interceptor to attach JWT or session tokens if available
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('kurio_auth_token')
      if (token) {
        config.headers.Authorization = `Bearer ${token}`
      }
    }
    return config
  },
  (error) => Promise.reject(error)
)

// Response interceptor for consistent error unwrapping
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const customError = error.response?.data?.message || error.message || 'Erro inesperado na comunicação com a API'
    return Promise.reject(new Error(customError))
  }
)

export default api
