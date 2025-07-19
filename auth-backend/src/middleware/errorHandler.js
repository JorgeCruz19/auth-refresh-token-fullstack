import { AuthError } from '../utils/errors.js';

// Global error handler middleware
export const errorHandler = (err, req, res, next) => {
	// Log the error for debugging
	console.error('Error:', err);

	// Check if it's our custom error
	if (err instanceof AuthError) {
		return res.status(err.statusCode).json({
			error: err.message,
			type: err.name,
		});
	}

	// Handle JWT errors
	if (err.name === 'JsonWebTokenError') {
		return res.status(401).json({
			error: 'Invalid token',
			type: 'JsonWebTokenError',
		});
	}

	if (err.name === 'TokenExpiredError') {
		return res.status(401).json({
			error: 'Token expired',
			type: 'TokenExpiredError',
		});
	}

	// Handle validation errors
	if (err.name === 'ValidationError') {
		return res.status(400).json({
			error: err.message,
			type: 'ValidationError',
		});
	}

	// Handle other known errors
	if (err.code === 'ENOENT') {
		return res.status(404).json({
			error: 'Resource not found',
			type: 'NotFoundError',
		});
	}

	// Default error response
	return res.status(500).json({
		error: 'Internal server error',
		type: 'InternalServerError',
	});
};

// Async error wrapper
export const asyncHandler = (fn) => {
	return (req, res, next) => {
		Promise.resolve(fn(req, res, next)).catch(next);
	};
};
