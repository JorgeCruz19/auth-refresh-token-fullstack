import { ValidationError, NotFoundError } from '../utils/errors.js';
import { users } from '../db/data.js';

export const getDashboard = async (userId) => {
	const user = users.find((u) => u.id === userId);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	return {
		message: 'Welcome to the dashboard!',
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
	};
};

export const getUsers = async () => {
	return users.map((u) => ({
		id: u.id,
		email: u.email,
		name: u.name,
		role: u.role,
	}));
};

export const updateUserRole = async (id, role) => {
	if (!id || !role) {
		throw new ValidationError('User ID and role are required');
	}

	const validRoles = ['admin', 'user'];
	if (!validRoles.includes(role)) {
		throw new ValidationError('Invalid role. Must be admin or user');
	}

	const user = users.find((u) => u.id === id);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	user.role = role;

	return {
		message: 'User role updated successfully',
		user: {
			id: user.id,
			email: user.email,
			name: user.name,
			role: user.role,
		},
	};
};
