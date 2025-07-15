import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import useAuth from "../hooks/useAuth"
import { Link, useNavigate } from "react-router"
import { authAPI } from "../api"

const Dashboard = () => {
  const { user, clearAuth, hasRole } = useAuth()
  const queryClient = useQueryClient()
  const navigate = useNavigate()

  const dashboardQuery = useQuery({
    queryKey: ['dashboard'],
    queryFn: authAPI.getDashboard,
  })

  const adminQuery = useQuery({
    queryKey: ['admin'],
    queryFn: authAPI.getAdminData,
    enabled: hasRole('admin'),
  })

  const usersQuery = useQuery({
    queryKey: ['users'],
    queryFn: authAPI.getUsers,
    enabled: hasRole('admin'),
  })

  const updateRoleMutation = useMutation({
    mutationFn: authAPI.updateUserRole,
    onSuccess: () => {
      queryClient.invalidateQueries(['users'])
      queryClient.invalidateQueries(['admin'])
    },
  })

  const logoutMutation = useMutation({
    mutationFn: authAPI.logout,
    onSuccess: () => {
      clearAuth()
      queryClient.clear()
      navigate('/login')
    },
  })

  const handleLogout = () => {
    logoutMutation.mutate()
  }

  const handleRoleChange = (userId, newRole) => {
    updateRoleMutation.mutate({ userId, role: newRole })
  }

  return (
    <div className='min-h-screen bg-gray-50'>
      <nav className='bg-white shadow'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
          <div className='flex justify-between h-16'>
            <div className='flex items-center space-x-4'>
              <h1 className='text-xl font-semibold'>Dashboard</h1>
              <nav className='flex space-x-4'>
                <Link to='/dashboard' className='text-gray-600 hover:text-gray-900'>
                  Dashboard
                </Link>
                {hasRole('admin') && (
                  <Link to='/admin' className='text-gray-600 hover:text-gray-900'>
                    Admin
                  </Link>
                )}
              </nav>
            </div>
            <div className='flex items-center space-x-4'>
              <span className='text-gray-700'>Welcome, {user?.name}</span>
              <span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full'>{user?.role}</span>
              <button
                onClick={handleLogout}
                disabled={logoutMutation.isLoading}
                className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50'
              >
                {logoutMutation.isLoading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
        <div className='px-4 py-6 sm:px-0'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
            {/* User Dashboard */}
            <div className='bg-white overflow-hidden shadow rounded-lg'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>User Dashboard</h3>
                {dashboardQuery.isLoading && <p>Loading dashboard...</p>}
                {dashboardQuery.error && <p className='text-red-600'>Error loading dashboard</p>}
                {dashboardQuery.data && (
                  <div>
                    <p className='text-gray-600'>{dashboardQuery.data.message}</p>
                    <div className='mt-4 bg-gray-50 p-3 rounded'>
                      <p className='text-sm text-gray-700'>
                        <strong>User ID:</strong> {dashboardQuery.data.user.id}
                      </p>
                      <p className='text-sm text-gray-700'>
                        <strong>Email:</strong> {dashboardQuery.data.user.email}
                      </p>
                      <p className='text-sm text-gray-700'>
                        <strong>Role:</strong> {dashboardQuery.data.user.role}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Admin Panel */}
            {hasRole('admin') && (
              <div className='bg-white overflow-hidden shadow rounded-lg'>
                <div className='px-4 py-5 sm:p-6'>
                  <h3 className='text-lg font-medium text-gray-900 mb-4'>Admin Panel</h3>
                  {adminQuery.isLoading && <p>Loading admin data...</p>}
                  {adminQuery.error && <p className='text-red-600'>Error loading admin data</p>}
                  {adminQuery.data && (
                    <div>
                      <p className='text-gray-600 mb-4'>{adminQuery.data.message}</p>
                      <div className='bg-green-50 p-3 rounded'>
                        <p className='text-sm text-green-700'>Total Users: {adminQuery.data.users.length}</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* User Management (Admin Only) */}
          {hasRole('admin') && (
            <div className='mt-6 bg-white overflow-hidden shadow rounded-lg'>
              <div className='px-4 py-5 sm:p-6'>
                <h3 className='text-lg font-medium text-gray-900 mb-4'>User Management</h3>
                {usersQuery.isLoading && <p>Loading users...</p>}
                {usersQuery.error && <p className='text-red-600'>Error loading users</p>}
                {usersQuery.data && (
                  <div className='overflow-x-auto'>
                    <table className='min-w-full divide-y divide-gray-200'>
                      <thead className='bg-gray-50'>
                        <tr>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Name</th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Email</th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Role</th>
                          <th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>Actions</th>
                        </tr>
                      </thead>
                      <tbody className='bg-white divide-y divide-gray-200'>
                        {usersQuery.data.users.map((user) => (
                          <tr key={user.id}>
                            <td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>{user.name}</td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>{user.email}</td>
                            <td className='px-6 py-4 whitespace-nowrap'>
                              <span
                                className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                  user.role === 'admin' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'
                                }`}
                              >
                                {user.role}
                              </span>
                            </td>
                            <td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
                              <select
                                value={user.role}
                                onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                disabled={updateRoleMutation.isLoading}
                                className='border border-gray-300 rounded-md px-3 py-1 text-sm'
                              >
                                <option value='user'>User</option>
                                <option value='admin'>Admin</option>
                              </select>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}

export default Dashboard