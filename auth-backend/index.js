import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';

import { authenticateToken, authorizeRoles, errorHandler } from './src/middleware/index.js';
import routes from './src/routes/index.js';
import { env } from './src/config/env.js';

const app = express();

// Middleware
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
);
app.use(express.json());
app.use(cookieParser());
app.use(morgan('dev'));
// Routes
app.use('/api/v1', routes);

// Protected routes
app.get('/api/v1/admin', authenticateToken, authorizeRoles('admin'), (req, res) => {
	res.json({
		message: 'Admin panel access granted',
		users: [req.user],
	});
});

// Error handling middleware (must be last)
app.use(errorHandler);

const PORT = env.PORT || 5000;
app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});
