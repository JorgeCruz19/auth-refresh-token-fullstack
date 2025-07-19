import express from 'express';
import { authenticateToken, authorizeRoles } from '../../../../middleware/index.js';
import { getDashboard, getUsers, updateUserRole } from '../../../../controllers/user.controller.js';

const router = express.Router();

// Dashboard route - requires authentication
router.get('/dashboard', authenticateToken, getDashboard);

// Users routes - requires admin role
router.get('/users', authenticateToken, authorizeRoles('admin'), getUsers);
router.put('/users/:id/role', authenticateToken, authorizeRoles('admin'), updateUserRole);

export default router;
