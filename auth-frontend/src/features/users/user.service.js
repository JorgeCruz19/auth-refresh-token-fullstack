import api from '../../api/config';

const getAllUsers = async () => {
	try {
		const response = await api.get('/users');
		return response.data;
	} catch (error) {
		console.error('Error fetching users:', error);
		throw error;
	}
};

const updateUserRole = async ({ userId, role }) => {
	try {
		const response = await api.put(`/users/${userId}/role`, { role });
		return response.data;
	} catch (error) {
		console.error('Error updating user role:', error);
		throw error;
	}
};

export const userService = {
	getAllUsers,
	updateUserRole,
};
