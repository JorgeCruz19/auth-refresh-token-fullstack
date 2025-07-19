import AppRoutes from './routes';

import useAuth from './hooks/useAuth';

import { authAPI } from './api';
import { useQuery } from '@tanstack/react-query';

const App = () => {
	const { accessToken, setAuth, user, clearAuth } = useAuth();

	// Check if user is still valid on app start
	const userQuery = useQuery({
		queryKey: ['user'],
		queryFn: async () => {
			// If there's a token but no user data, fetch the user
			const { data } = await authAPI.getCurrentUser();
			setAuth(data.user, accessToken); // Set the user data in the store
			return data;
		},
		enabled: !!accessToken && !user,
		retry: false,
		onError: () => {
			clearAuth();
		},
	});

	if (userQuery.isLoading) {
		return (
			<div className='min-h-screen flex items-center justify-center bg-gray-50'>
				<div className='animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600'></div>
			</div>
		);
	}

	return <AppRoutes />;
};

export default App;
