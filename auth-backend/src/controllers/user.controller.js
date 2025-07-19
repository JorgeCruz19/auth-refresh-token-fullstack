import * as UserService from '../services/user.service.js';
import { asyncHandler } from '../middleware/index.js';

const getDashboard = asyncHandler(async (req, res) => {
	const userId = req.user.id;

	const dashboardData = await UserService.getDashboard(userId);

	res.json(dashboardData);
});

const getUsers = asyncHandler(async (req, res) => {
	const users = await UserService.getUsers();

	res.json({ users });
});

const updateUserRole = asyncHandler(async (req, res) => {
	const { id } = req.params;
	const { role } = req.body;

	const result = await UserService.updateUserRole(parseInt(id), role);

	res.json(result);
});

export { getDashboard, getUsers, updateUserRole };
