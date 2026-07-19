import axios from 'axios'

const API_BASE_URL =
  (import.meta as ImportMeta & {
    env: { VITE_API_URL?: string }
  }).env.VITE_API_URL || 'http://localhost:5000/api/v1'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('transitai-auth')
    ? JSON.parse(localStorage.getItem('transitai-auth')!).state?.token
    : null

  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }

  const collegeId = localStorage.getItem('college-id')
  if (collegeId) {
    config.headers['X-College-ID'] = collegeId
  }

  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('transitai-auth')
      window.location.href = '/'
    }
    return Promise.reject(error)
  }
)

export default api