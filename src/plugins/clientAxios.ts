import router from '@/router'
import axios from 'axios'


const api = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-Width' : 'XMLHttpRequest'
  },
  withCredentials: true
})

// Interceptor para agregar el token desde sessionStorage
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      sessionStorage.removeItem('token')
      router.push('/login')
    }
    return Promise.reject(err)
  }
)

export default api

