import { create } from "zustand"
import { persist } from "zustand/middleware"
import api from "../api/config"

// Zustand store for authentication
const useAuthStore = create(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isAuthenticated: false,

      setAuth: (user, accessToken) => {
        set({ user, accessToken, isAuthenticated: true })
        // Set axios default header
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      },

      clearAuth: () => {
        set({ user: null, accessToken: null, isAuthenticated: false })
        delete api.defaults.headers.common['Authorization']
      },

      updateToken: (accessToken) => {
        set({ accessToken })
        api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
      },

      hasRole: (role) => {
        const { user } = get()
        return user?.role === role
      },

      hasAnyRole: (roles) => {
        const { user } = get()
        return roles.includes(user?.role)
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

export default useAuthStore