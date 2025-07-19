import axios from 'axios';
import useAuthStore from '../store/auth.store';

// Axios configuration
const api = axios.create({
	baseURL: 'http://localhost:5000/api/v1',
	withCredentials: true,
});

// Track refresh token request to prevent multiple simultaneous attempts
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
	failedQueue.forEach(({ resolve, reject }) => {
		if (error) {
			reject(error);
		} else {
			resolve(token);
		}
	});

	failedQueue = [];
};

// Axios interceptors for token refresh
api.interceptors.response.use(
	(response) => response,
	async (error) => {
		const originalRequest = error.config;

		// Don't intercept refresh token requests to avoid infinite loop
		if (originalRequest.url?.includes('/auth/refresh')) {
			return Promise.reject(error);
		}

		if (error.response?.status === 403 && !originalRequest._retry) {
			if (isRefreshing) {
				// If already refreshing, queue this request
				return new Promise((resolve, reject) => {
					failedQueue.push({ resolve, reject });
				})
					.then((token) => {
						originalRequest.headers['Authorization'] = `Bearer ${token}`;
						return api(originalRequest);
					})
					.catch((err) => {
						return Promise.reject(err);
					});
			}

			originalRequest._retry = true;
			isRefreshing = true;

			try {
				const response = await api.post('/auth/refresh');
				const { accessToken } = response.data;

				useAuthStore.getState().updateToken(accessToken);
				originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;

				processQueue(null, accessToken);
				isRefreshing = false;

				return api(originalRequest);
			} catch (refreshError) {
				processQueue(refreshError, null);
				isRefreshing = false;
				useAuthStore.getState().clearAuth();

				// Redirect to login page
				if (typeof window !== 'undefined') {
					window.location.href = '/login';
				}

				return Promise.reject(refreshError);
			}
		}

		return Promise.reject(error);
	}
);

export default api;
