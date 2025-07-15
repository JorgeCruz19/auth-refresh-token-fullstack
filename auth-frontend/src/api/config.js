import axios from "axios";
import useAuthStore from "../store/auth.store";

// Axios configuration
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
})


// Axios interceptors for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (error.response?.status === 403 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        const response = await api.post('/auth/refresh')
        const { accessToken } = response.data

        useAuthStore.getState().updateToken(accessToken)
        originalRequest.headers['Authorization'] = `Bearer ${accessToken}`

        return api(originalRequest)
      } catch (refreshError) {
        useAuthStore.getState().clearAuth()
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default api;