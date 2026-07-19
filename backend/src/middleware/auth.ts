import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { User, IUser } from '../models/User';
import { JWTPayload, UserRole, ROLE_PERMISSIONS } from '../types';
import logger from '../config/logger';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
      collegeId?: string;
      permissions?: string[];
    }
  }
}

export const authenticate = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Access token required' } });
      return;
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, config.jwt.secret) as JWTPayload;

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive || user.isDeleted) {
      res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'User not found or inactive' } });
      return;
    }

    req.user = user;
    req.collegeId = decoded.collegeId || user.collegeId.toString();
    req.permissions = decoded.permissions || ROLE_PERMISSIONS[user.role] || [];

    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ success: false, error: { code: 'TOKEN_EXPIRED', message: 'Token expired' } });
      return;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ success: false, error: { code: 'INVALID_TOKEN', message: 'Invalid token' } });
      return;
    }
    logger.error('Auth middleware error:', error);
    res.status(500).json({ success: false, error: { code: 'INTERNAL_ERROR', message: 'Authentication failed' } });
  }
};

export const authorize = (...requiredPermissions: string[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user || !req.permissions) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Permission denied' } });
      return;
    }

    const hasPermission = requiredPermissions.every(perm => req.permissions!.includes(perm));
    if (!hasPermission && req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Insufficient permissions' } });
      return;
    }

    next();
  };
};

export const requireRole = (...roles: UserRole[]) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Authentication required' } });
      return;
    }

    if (!roles.includes(req.user.role) && req.user.role !== UserRole.SUPER_ADMIN) {
      res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Role not authorized' } });
      return;
    }

    next();
  };
};

export const tenantIsolation = (req: Request, res: Response, next: NextFunction): void => {
  const collegeId = req.headers['x-college-id'] as string || req.collegeId;

  if (!collegeId) {
    res.status(400).json({ success: false, error: { code: 'BAD_REQUEST', message: 'College ID required' } });
    return;
  }

  if (req.user?.role === UserRole.SUPER_ADMIN) {
    req.collegeId = collegeId;
    next();
    return;
  }

  if (req.user && req.user.collegeId.toString() !== collegeId) {
    res.status(403).json({ success: false, error: { code: 'FORBIDDEN', message: 'Cross-tenant access denied' } });
    return;
  }

  req.collegeId = collegeId;
  next();
};
