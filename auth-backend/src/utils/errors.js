export class AuthError extends Error {
	constructor(message, statusCode = 500) {
		super(message);
		this.name = 'AuthError';
		this.statusCode = statusCode;
	}
}

export class ValidationError extends AuthError {
	constructor(message) {
		super(message, 400);
		this.name = 'ValidationError';
	}
}

export class UnauthorizedError extends AuthError {
	constructor(message) {
		super(message, 401);
		this.name = 'UnauthorizedError';
	}
}

export class ForbiddenError extends AuthError {
	constructor(message) {
		super(message, 403);
		this.name = 'ForbiddenError';
	}
}

export class NotFoundError extends AuthError {
	constructor(message) {
		super(message, 404);
		this.name = 'NotFoundError';
	}
}

export class ConflictError extends AuthError {
	constructor(message) {
		super(message, 409);
		this.name = 'ConflictError';
	}
}

export class InternalServerError extends AuthError {
	constructor(message) {
		super(message, 500);
		this.name = 'InternalServerError';
	}
}
