import express from 'express';

import { authenticateToken, authLimiter } from '../../../../middleware/index.js';
import {
	register,
	login,
	refreshtoken,
	logOut,
	me,
} from '../../../../controllers/auth.controller.js';

const router = express.Router();

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.post('/logout', logOut);
router.get('/me', authenticateToken, me);
router.post('/refresh', refreshtoken);

export default router;
