import { Navigate, useLocation } from "react-router"
import useAuthStore from "../store/auth.store"

const ProtectedRoute = ({ children, requireRole = null }) => {
  const { isAuthenticated, user } = useAuthStore()
  const location = useLocation()

  if (!isAuthenticated) {
    return <Navigate to='/login' state={{ from: location }} replace />
  }

  if (requireRole && user?.role !== requireRole) {
    return <Navigate to='/dashboard' replace />
  }

  return children
}

export default ProtectedRoute