import { useGetAllUsers, useUpdateUserRole } from '../features/users/user.api';

const UserManagment = () => {
	const { users, error: usersError, isLoading: usersLoading } = useGetAllUsers();
	const { mutate, isPending } = useUpdateUserRole();

	const handleRoleChange = (userId, newRole) => {
		mutate(
			{ userId, role: newRole },
			{
				onSuccess: () => {
					window.alert('User role updated successfully');
				},
				onError: (error) => {
					console.error('Error updating user role:', error);
					window.alert('Error updating user role');
				},
			}
		);
	};

	return (
		<div className='mt-6 bg-white overflow-hidden shadow rounded-lg'>
			<div className='px-4 py-5 sm:p-6'>
				<h3 className='text-lg font-medium text-gray-900 mb-4'>User Management</h3>
				{usersLoading && <p>Loading users...</p>}
				{usersError && <p className='text-red-600'>Error loading users</p>}
				{users && (
					<div className='overflow-x-auto'>
						<table className='min-w-full divide-y divide-gray-200'>
							<thead className='bg-gray-50'>
								<tr>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Name
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Email
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Role
									</th>
									<th className='px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider'>
										Actions
									</th>
								</tr>
							</thead>
							<tbody className='bg-white divide-y divide-gray-200'>
								{users.map((user) => (
									<tr key={user.id}>
										<td className='px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900'>
											{user.name}
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											{user.email}
										</td>
										<td className='px-6 py-4 whitespace-nowrap'>
											<span
												className={`px-2 py-1 text-xs font-semibold rounded-full ${
													user.role === 'admin'
														? 'bg-red-100 text-red-800'
														: 'bg-blue-100 text-blue-800'
												}`}>
												{user.role}
											</span>
										</td>
										<td className='px-6 py-4 whitespace-nowrap text-sm text-gray-500'>
											<select
												value={user.role}
												onChange={(e) => handleRoleChange(user.id, e.target.value)}
												disabled={isPending}
												className='border border-gray-300 rounded-md px-3 py-1 text-sm'>
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
	);
};

export default UserManagment;
