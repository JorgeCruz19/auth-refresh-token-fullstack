import api from "./config"

// API functions
export const authAPI = {
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials)
    return response.data
  },

  register: async (userData) => {
    const response = await api.post('/auth/register', userData)
    return response.data
  },

  logout: async () => {
    const response = await api.post('/auth/logout')
    return response.data
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me')
    return response.data
  },

  getDashboard: async () => {
    const response = await api.get('/dashboard')
    return response.data
  },

  getAdminData: async () => {
    const response = await api.get('/admin')
    return response.data
  },

  getUsers: async () => {
    const response = await api.get('/users')
    return response.data
  },

  updateUserRole: async ({ userId, role }) => {
    const response = await api.put(`/users/${userId}/role`, { role })
    return response.data
  },
}