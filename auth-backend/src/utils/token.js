import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';

const generateAccessToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email, role: user.role }, env.JWT_SECRET, {
		expiresIn: env.ACCESS_TOKEN_EXPIRE,
	});
};

const generateRefreshToken = (user) => {
	return jwt.sign({ id: user.id, email: user.email }, env.JWT_REFRESH_SECRET, {
		expiresIn: env.REFRESH_TOKEN_EXPIRE,
	});
};

export { generateAccessToken, generateRefreshToken };
