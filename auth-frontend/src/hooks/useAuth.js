import { useEffect } from 'react';
import useAuthStore from '../store/auth.store';
import api from '../api/config';

// Custom hooks
const useAuth = () => {
	const { user, accessToken, setAuth, clearAuth, hasRole, hasAnyRole } = useAuthStore();
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated());

	// Initialize axios header on mount
	useEffect(() => {
		if (accessToken) {
			api.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
		}
	}, [accessToken]);

	return { user, accessToken, isAuthenticated, setAuth, clearAuth, hasRole, hasAnyRole };
};

export default useAuth;
