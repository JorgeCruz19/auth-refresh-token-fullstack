import { Link, useNavigate } from 'react-router';
import { useLogOut } from '../features/auth/auth.api';

import useAuth from '../hooks/useAuth';

const Navbar = () => {
	const { user, clearAuth, hasRole } = useAuth();
	const navigate = useNavigate();

	const { mutate: logOut, isPending: isLoggingOut } = useLogOut();
	const handleLogout = () => {
		logOut(
			{},
			{
				onSuccess: () => {
					clearAuth();
					navigate('/login');
				},
				onError: (error) => {
					console.error('Error logging out:', error);
					window.alert('Error logging out');
				},
			}
		);
	};

	return (
		<nav className='bg-white shadow'>
			<div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
				<div className='flex justify-between h-16'>
					<div className='flex items-center space-x-4'>
						<h1 className='text-xl font-semibold'>Admin Panel</h1>
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
						<span className='px-2 py-1 bg-blue-100 text-blue-800 text-xs font-semibold rounded-full'>
							{user?.role}
						</span>
						<button
							onClick={handleLogout}
							disabled={isLoggingOut}
							className='bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50'>
							{isLoggingOut ? 'Logging out...' : 'Logout'}
						</button>
					</div>
				</div>
			</div>
		</nav>
	);
};

export default Navbar;
