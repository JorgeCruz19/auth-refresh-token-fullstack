import jwt from 'jsonwebtoken';
import rateLimit from 'express-rate-limit';

import { UnauthorizedError, ForbiddenError } from '../utils/errors.js';
import { env } from '../config/env.js';

// Middleware for authentication
const authenticateToken = (req, res, next) => {
	const authHeader = req.headers['authorization'];
	const token = authHeader && authHeader.split(' ')[1];

	if (!token) {
		const error = new UnauthorizedError('Access token required');
		return res.status(error.statusCode).json({ error: error.message });
	}

	jwt.verify(token, env.JWT_SECRET, (err, user) => {
		if (err) {
			const error = new ForbiddenError('Invalid or expired token');
			return res.status(error.statusCode).json({ error: error.message });
		}
		req.user = user;
		next();
	});
};

// Middleware for authorization
const authorizeRoles = (...roles) => {
	return (req, res, next) => {
		if (!req.user) {
			const error = new UnauthorizedError('Authentication required');
			return res.status(error.statusCode).json({ error: error.message });
		}

		if (!roles.includes(req.user.role)) {
			const error = new ForbiddenError('Insufficient permissions');
			return res.status(error.statusCode).json({ error: error.message });
		}

		next();
	};
};

const authLimiter = rateLimit({
	windowMs: 15 * 60 * 1000, // 15 minutes
	max: 5, // limit each IP to 5 requests per windowMs
	message: 'Too many authentication attempts, please try again later.',
});

export { authenticateToken, authorizeRoles, authLimiter };
export { errorHandler, asyncHandler } from './errorHandler.js';
