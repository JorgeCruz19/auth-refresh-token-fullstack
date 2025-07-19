import { useQuery } from '@tanstack/react-query';

import Navbar from '../components/Navbar';

import { authAPI } from '../api';

import useAuth from '../hooks/useAuth';
import { useGetAdminAccess } from '../features/admin/admin.api';
import UserManagment from '../components/UserManagment';

const Dashboard = () => {
	const { hasRole } = useAuth();

	const { admin, error: adminError, isLoading: adminLoading } = useGetAdminAccess(hasRole('admin'));

	const dashboardQuery = useQuery({
		queryKey: ['dashboard'],
		queryFn: authAPI.getDashboard,
	});

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />

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
									{adminLoading && <p>Loading admin data...</p>}
									{adminError && <p className='text-red-600'>Error loading admin data</p>}
									{admin && (
										<div>
											<p className='text-gray-600 mb-4'>{admin.message}</p>
											<div className='bg-green-50 p-3 rounded'>
												<p className='text-sm text-green-700'>
													Total Users: {admin?.users?.length}
												</p>
											</div>
										</div>
									)}
								</div>
							</div>
						)}
					</div>

					{/* User Management (Admin Only) */}
					{hasRole('admin') && <UserManagment />}
				</div>
			</main>
		</div>
	);
};

export default Dashboard;
