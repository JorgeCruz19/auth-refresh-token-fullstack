import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

import { generateAccessToken, generateRefreshToken } from '../utils/token.js';
import {
	ValidationError,
	UnauthorizedError,
	ForbiddenError,
	NotFoundError,
} from '../utils/errors.js';
import { env } from '../config/env.js';
import { users } from '../db/data.js';
let refreshTokens = [];

export const register = async (email, name, password) => {
	// Validation
	if (!email || !password || !name)
		throw new ValidationError('Email, password, and name are required');

	// Check if user exists
	const existingUser = users.find((u) => u.email === email);
	if (existingUser) {
		throw new ValidationError('User already exists');
	}

	// Hash password
	const hashedPassword = await bcrypt.hash(password, 10);
	// Create user
	const newUser = {
		id: users.length + 1,
		email,
		password: hashedPassword,
		name,
		role: 'user',
	};

	users.push(newUser);

	return {
		message: 'User registered successfully',
		user: { id: newUser.id, email: newUser.email, name: newUser.name, role: newUser.role },
	};
};

export const login = async (email, password) => {
	// Find user
	const user = users.find((u) => u.email === email);
	if (!user) {
		throw new UnauthorizedError('Invalid credentials');
	}

	// Check password
	const isValidPassword = await bcrypt.compare(password, user.password);
	if (!isValidPassword) {
		throw new UnauthorizedError('Invalid credentials');
	}

	// Generate tokens
	const accessToken = generateAccessToken(user);
	const refreshToken = generateRefreshToken(user);

	// Store refresh token
	refreshTokens.push(refreshToken);

	return { accessToken, refreshToken, user };
};

export const logOut = (refresh_token) => {
	if (!refresh_token) {
		throw new UnauthorizedError('Refresh token required');
	}

	if (!refreshTokens.includes(refresh_token)) {
		throw new ForbiddenError('Invalid refresh token');
	}

	// Remove refresh token from array
	refreshTokens = refreshTokens.filter((token) => token !== refresh_token);

	return { message: 'Logged out successfully' };
};

export const refreshtoken = async (refreshToken) => {
	if (!refreshToken) {
		throw new UnauthorizedError('Refresh token required');
	}

	if (!refreshTokens.includes(refreshToken)) {
		throw new ForbiddenError('Invalid refresh token');
	}

	return new Promise((resolve, reject) => {
		jwt.verify(refreshToken, env.JWT_REFRESH_SECRET, (err, user) => {
			if (err) {
				reject(new ForbiddenError('Invalid refresh token'));
				return;
			}

			const fullUser = users.find((u) => u.id === user.id);
			if (!fullUser) {
				reject(new ForbiddenError('User not found'));
				return;
			}

			const accessToken = generateAccessToken(fullUser);
			resolve({ accessToken });
		});
	});
};

export const me = (id) => {
	if (!id) {
		throw new ValidationError('User ID is required');
	}

	const user = users.find((u) => u.id === id);
	if (!user) {
		throw new NotFoundError('User not found');
	}

	return {
		id: user.id,
		email: user.email,
		name: user.name,
		role: user.role,
	};
};
