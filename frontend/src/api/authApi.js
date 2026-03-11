// Auth API calls
import api from './axiosInstance'

export const register = (data) => api.post('/auth/register/', data)
export const login = (data) => api.post('/auth/login/', data)
export const logout = (refresh) => api.post('/auth/logout/', { refresh })
export const refreshToken = (token) => api.post('/auth/token/refresh/', { refresh: token })
