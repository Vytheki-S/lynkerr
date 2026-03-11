import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
})

// Attach access token to every request
api.interceptors.request.use((config) => {
  const token = window.__accessToken
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// Auto-refresh on 401
api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const original = error.config
    if (error.response?.status === 401 && !original._retry) {
      original._retry = true
      const refresh = localStorage.getItem('refresh')
      if (!refresh) return Promise.reject(error)
      try {
        const { data } = await axios.post(
          `${import.meta.env.VITE_API_URL || 'http://localhost:8000/api'}/auth/token/refresh/`,
          { refresh }
        )
        window.__accessToken = data.access
        original.headers.Authorization = `Bearer ${data.access}`
        return api(original)
      } catch {
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api
