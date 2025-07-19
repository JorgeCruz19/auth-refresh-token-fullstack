import api from '../../api/config';

const getAdminAccess = async () => {
	try {
		const response = await api.get('/admin');
		return response.data;
	} catch (error) {
		console.error('Error fetching admin access:', error);
		throw error;
	}
};

export const adminService = {
	getAdminAccess,
};
