import Navbar from '../components/Navbar';
import UserManagment from '../components/UserManagment';

import { useGetAdminAccess } from '../features/admin/admin.api';
import useAuth from '../hooks/useAuth';

const AdminPanel = () => {
	const { hasRole } = useAuth();
	const { admin, error: adminError, isLoading: adminLoading } = useGetAdminAccess(hasRole('admin'));

	return (
		<div className='min-h-screen bg-gray-50'>
			<Navbar />
			<main className='max-w-7xl mx-auto py-6 sm:px-6 lg:px-8'>
				<div className='px-4 py-6 sm:px-0'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Admin Panel */}
						<div className='bg-white overflow-hidden shadow rounded-lg'>
							<div className='px-4 py-5 sm:p-6'>
								<h3 className='text-lg font-medium text-gray-900 mb-4'>Admin Panel</h3>
								{adminLoading && <p>Loading admin data...</p>}
								{adminError && <p className='text-red-600'>Error loading admin data</p>}
								{admin && (
									<div>
										<p className='text-gray-600 mb-4'>{admin?.message}</p>
										<div className='bg-green-50 p-3 rounded'>
											<p className='text-sm text-green-700'>Total Users: {admin?.users?.length}</p>
										</div>
									</div>
								)}
							</div>
						</div>
					</div>

					{/* User Management */}
					<UserManagment />
				</div>
			</main>
		</div>
	);
};

export default AdminPanel;
