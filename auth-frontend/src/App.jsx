import AppRoutes from './routes'

import useAuth from './hooks/useAuth'

import { authAPI } from './api'
import { useQuery } from '@tanstack/react-query'

const App = () => {
  const { isAuthenticated, clearAuth } = useAuth()

  // Check if user is still valid on app start
  const userQuery = useQuery({
    queryKey: ['user'],
    queryFn: authAPI.getCurrentUser,
    enabled: isAuthenticated,
    retry: false,
    onError: () => {
      clearAuth()
    },
  })

  if (isAuthenticated && userQuery.isLoading) {
    return (
      <div className='min-h-screen flex items-center justify-center bg-gray-50'>
        <div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
      </div>
    )
  }

  return <AppRoutes/>

  
}

export default App
