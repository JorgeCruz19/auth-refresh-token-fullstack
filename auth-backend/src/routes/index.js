import express from 'express';
const router = express.Router();

import AuthRouter from './api/v1/auth/index.js';
import UserRouter from './api/v1/user/index.js';

router.use('/auth', AuthRouter);
router.use('/', UserRouter);

export default router;
