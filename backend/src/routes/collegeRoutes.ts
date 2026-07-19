import { Router } from 'express';
import { getColleges, createCollege, getCollege, updateCollege, deleteCollege, getCollegeStats } from '../controllers/collegeController';
import { authenticate, authorize, requireRole, tenantIsolation } from '../middleware/auth';
import { asyncHandler } from '../middleware/errorHandler';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', requireRole(UserRole.SUPER_ADMIN), asyncHandler(getColleges));
router.post('/', requireRole(UserRole.SUPER_ADMIN), asyncHandler(createCollege));
router.get('/:id', tenantIsolation, asyncHandler(getCollege));
router.put('/:id', tenantIsolation, requireRole(UserRole.SUPER_ADMIN, UserRole.COLLEGE_ADMIN), asyncHandler(updateCollege));
router.delete('/:id', tenantIsolation, requireRole(UserRole.SUPER_ADMIN), asyncHandler(deleteCollege));
router.get('/:id/stats', tenantIsolation, asyncHandler(getCollegeStats));

export default router;
