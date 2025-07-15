import { useEffect } from "react"
import useAuthStore from "../store/auth.store"
import api from "../api/config"

// Custom hooks
const useAuth = () => {
  const { user, accessToken, isAuthenticated, setAuth, clearAuth, hasRole, hasAnyRole } = useAuthStore()

  // Initialize axios header on mount
  useEffect(() => {
    if (accessToken) {
      api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
    }
  }, [accessToken])

  return { user, accessToken, isAuthenticated, setAuth, clearAuth, hasRole, hasAnyRole }
}

export default useAuth