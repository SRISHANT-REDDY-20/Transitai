import { Router } from 'express';
import { register, login, refreshToken, logout, getMe, updateMe, createSuperAdmin } from '../controllers/authController';
import { authenticate } from '../middleware/auth';
import { authRateLimit } from '../middleware/rateLimit';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.post('/register', authRateLimit, asyncHandler(register));
router.post('/login', authRateLimit, asyncHandler(login));
router.post('/refresh', asyncHandler(refreshToken));
router.post('/logout', authenticate, asyncHandler(logout));
router.get('/me', authenticate, asyncHandler(getMe));
router.put('/me', authenticate, asyncHandler(updateMe));
router.post('/setup-super-admin', asyncHandler(createSuperAdmin));

export default router;
