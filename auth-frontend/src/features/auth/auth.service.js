import api from '../../api/config';

const logOut = async () => {
	try {
		const response = await api.post('/auth/logout');
		return response.data;
	} catch (error) {
		console.error('Error logging out:', error);
		throw error;
	}
};

export const authService = {
	logOut,
};
