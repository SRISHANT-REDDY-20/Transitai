import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { College } from '../models/College';
import { config } from '../config';
import { UserRole, ROLE_PERMISSIONS } from '../types';
import { AppError, UnauthorizedError, ValidationError } from '../middleware/errorHandler';
import logger from '../config/logger';

const generateTokens = (
  userId: string,
  email: string,
  role: UserRole,
  collegeId?: string
) => {
  const permissions = ROLE_PERMISSIONS[role] || [];

  const accessToken = jwt.sign(
    { userId, email, role, collegeId, permissions },
    config.jwt.secret,
    {
      expiresIn: config.jwt.accessExpiration as SignOptions["expiresIn"],
    }
  );

  const refreshToken = jwt.sign(
    { userId, type: "refresh" },
    config.jwt.refreshSecret,
    {
      expiresIn: config.jwt.refreshExpiration as SignOptions["expiresIn"],
    }
  );

  return {
    accessToken,
    refreshToken,
    expiresIn: 900,
  };
};

export const register = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName, phone, role, collegeId } = req.body;

  const existingUser = await User.findOne({ collegeId, email });
  if (existingUser) {
    throw new ValidationError('User already exists', [{ field: 'email', message: 'Email already registered' }]);
  }

  const user = await User.create({
    collegeId,
    email,
    password,
    firstName,
    lastName,
    phone,
    role: role || UserRole.STUDENT,
  });

  const tokens = generateTokens(user._id.toString(), user.email, user.role, collegeId);

  res.status(201).json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      tokens,
    },
    timestamp: new Date().toISOString(),
  });
};

export const login = async (req: Request, res: Response): Promise<void> => {
  const { email, password, deviceId } = req.body;

  const user = await User.findOne({ email, isActive: true }).select('+password');
  if (!user) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (user.isLocked()) {
    throw new UnauthorizedError('Account locked. Try again later.');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    await user.incrementLoginAttempts();
    throw new UnauthorizedError('Invalid credentials');
  }

  user.loginAttempts = 0;
  user.lockUntil = undefined;
  user.lastLoginAt = new Date();
  await user.save();

  const tokens = generateTokens(user._id.toString(), user.email, user.role, user.collegeId?.toString());

  logger.info(`User logged in: ${user.email} from device: ${deviceId || 'unknown'}`);

  res.json({
    success: true,
    data: {
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        collegeId: user.collegeId,
      },
      tokens,
    },
    timestamp: new Date().toISOString(),
  });
};

export const refreshToken = async (req: Request, res: Response): Promise<void> => {
  const { refreshToken: token } = req.body;

  try {
    const decoded = jwt.verify(token, config.jwt.refreshSecret) as { userId: string; type: string };
    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Invalid refresh token');
    }

    const user = await User.findById(decoded.userId);
    if (!user || !user.isActive) {
      throw new UnauthorizedError('User not found');
    }

    const tokens = generateTokens(user._id.toString(), user.email, user.role, user.collegeId?.toString());

    res.json({
      success: true,
      data: tokens,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
};

export const logout = async (req: Request, res: Response): Promise<void> => {
  res.json({
    success: true,
    data: { message: 'Logged out successfully' },
    timestamp: new Date().toISOString(),
  });
};

export const getMe = async (req: Request, res: Response): Promise<void> => {
  const user = await User.findById(req.user?._id).populate('collegeId', 'name slug');
  if (!user) {
    throw new UnauthorizedError('User not found');
  }

  res.json({
    success: true,
    data: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      role: user.role,
      phone: user.phone,
      avatar: user.avatar,
      college: user.collegeId,
      preferences: user.preferences,
    },
    timestamp: new Date().toISOString(),
  });
};

export const updateMe = async (req: Request, res: Response): Promise<void> => {
  const { firstName, lastName, phone, preferences } = req.body;

  const user = await User.findByIdAndUpdate(
    req.user?._id,
    { firstName, lastName, phone, preferences, updatedBy: req.user?._id },
    { new: true }
  );

  res.json({
    success: true,
    data: user,
    timestamp: new Date().toISOString(),
  });
};

export const createSuperAdmin = async (req: Request, res: Response): Promise<void> => {
  const { email, password, firstName, lastName } = req.body;

  const existing = await User.findOne({ role: UserRole.SUPER_ADMIN });
  if (existing) {
    throw new AppError('Super admin already exists', 409, 'CONFLICT');
  }

  const user = await User.create({
    email,
    password,
    firstName,
    lastName,
    role: UserRole.SUPER_ADMIN,
    collegeId: new (await import('mongoose')).Types.ObjectId(), // dummy collegeId for super admin
    isEmailVerified: true,
  });

  res.status(201).json({
    success: true,
    data: { id: user._id, email: user.email, role: user.role },
    timestamp: new Date().toISOString(),
  });
};
