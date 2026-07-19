import { Router } from 'express';
import { getDashboard, getStudentDashboard, getParentDashboard, getDriverDashboard } from '../controllers/dashboardController';
import { authenticate, tenantIsolation } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';

const router = Router();

router.use(authenticate, tenantIsolation);

router.get('/admin', asyncHandler(getDashboard));
router.get('/student', asyncHandler(getStudentDashboard));
router.get('/parent', asyncHandler(getParentDashboard));
router.get('/driver', asyncHandler(getDriverDashboard));

export default router;
