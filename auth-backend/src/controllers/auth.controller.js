import * as AuthService from '../services/auth.service.js';
import { asyncHandler } from '../middleware/index.js';
import { env } from '../config/env.js';

const register = asyncHandler(async (req, res) => {
	const { email, password, name } = req.body;

	const { message, user } = await AuthService.register(email, name, password);

	res.status(201).json({
		message,
		user,
	});
});

const login = asyncHandler(async (req, res) => {
	const { email, password } = req.body;

	const { accessToken, refreshToken, user } = await AuthService.login(email, password);

	// Set refresh token in httpOnly cookie
	res.cookie('tvc_refresh_token', refreshToken, {
		httpOnly: true,
		secure: env.NODE_ENV === 'production',
		sameSite: 'strict',
		maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
	});

	res.json({
		accessToken,
		user: { id: user.id, email: user.email, name: user.name, role: user.role },
	});
});

const logOut = asyncHandler(async (req, res) => {
	const { tvc_refresh_token } = req.cookies;

	const result = await AuthService.logOut(tvc_refresh_token);

	res.clearCookie('tvc_refresh_token');

	res.json(result);
});

const refreshtoken = asyncHandler(async (req, res) => {
	const { tvc_refresh_token } = req.cookies;

	const { accessToken } = await AuthService.refreshtoken(tvc_refresh_token);

	res.json({ accessToken });
});

const me = asyncHandler(async (req, res) => {
	const id = req.user.id;

	const user = await AuthService.me(id);

	res.json({ user });
});

export { register, login, refreshtoken, logOut, me };
