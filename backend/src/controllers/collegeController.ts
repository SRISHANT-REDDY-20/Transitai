import { Request, Response } from 'express';
import { College } from '../models/College';
import { User } from '../models/User';
import { AppError, NotFoundError } from '../middleware/errorHandler';
import { UserRole, SubscriptionStatus } from '../types';

export const getColleges = async (req: Request, res: Response): Promise<void> => {
  const { page = 1, limit = 20, status, search } = req.query;
  const query: any = {};

  if (status) query.status = status;
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { slug: { $regex: search, $options: 'i' } },
    ];
  }

  const colleges = await College.find(query)
    .skip((+page - 1) * +limit)
    .limit(+limit)
    .sort({ createdAt: -1 });

  const total = await College.countDocuments(query);

  res.json({
    success: true,
    data: colleges,
    meta: { page: +page, limit: +limit, total, totalPages: Math.ceil(total / +limit) },
    timestamp: new Date().toISOString(),
  });
};

export const createCollege = async (req: Request, res: Response): Promise<void> => {
  const { name, slug, subdomain, address, contact, subscription } = req.body;

  const existing = await College.findOne({ $or: [{ slug }, { subdomain }] });
  if (existing) {
    throw new AppError('College with this slug or subdomain already exists', 409, 'CONFLICT');
  }

  const college = await College.create({
    name,
    slug,
    subdomain,
    address,
    contact,
    subscription: {
      ...subscription,
      status: SubscriptionStatus.ACTIVE,
      startedAt: new Date(),
    },
    createdBy: req.user?._id,
  });

  res.status(201).json({
    success: true,
    data: college,
    timestamp: new Date().toISOString(),
  });
};

export const getCollege = async (req: Request, res: Response): Promise<void> => {
  const college = await College.findById(req.params.id);
  if (!college) throw new NotFoundError('College');

  res.json({
    success: true,
    data: college,
    timestamp: new Date().toISOString(),
  });
};

export const updateCollege = async (req: Request, res: Response): Promise<void> => {
  const college = await College.findByIdAndUpdate(
    req.params.id,
    { ...req.body, updatedBy: req.user?._id },
    { new: true }
  );
  if (!college) throw new NotFoundError('College');

  res.json({
    success: true,
    data: college,
    timestamp: new Date().toISOString(),
  });
};

export const deleteCollege = async (req: Request, res: Response): Promise<void> => {
  const college = await College.findByIdAndUpdate(req.params.id, {
    isDeleted: true,
    deletedAt: new Date(),
    updatedBy: req.user?._id,
  });
  if (!college) throw new NotFoundError('College');

  res.json({
    success: true,
    data: { message: 'College deleted successfully' },
    timestamp: new Date().toISOString(),
  });
};

export const getCollegeStats = async (req: Request, res: Response): Promise<void> => {
  const collegeId = req.params.id;

  const [studentCount, busCount, driverCount, activeTripCount] = await Promise.all([
    (await import('../models/Student')).Student.countDocuments({ collegeId, status: 'ACTIVE' }),
    (await import('../models/Bus')).Bus.countDocuments({ collegeId, status: 'ACTIVE' }),
    (await import('../models/Driver')).Driver.countDocuments({ collegeId, status: { $in: ['AVAILABLE', 'ON_DUTY'] } }),
    (await import('../models/Trip')).Trip.countDocuments({ collegeId, status: { $in: ['STARTED', 'PAUSED'] } }),
  ]);

  res.json({
    success: true,
    data: {
      totalStudents: studentCount,
      totalBuses: busCount,
      totalDrivers: driverCount,
      activeTrips: activeTripCount,
      todayAttendance: 0, // Would calculate from attendance
      pendingFees: 0,
      overdueInvoices: 0,
      maintenanceDue: 0,
      complaintsOpen: 0,
      averageDelay: 0,
      onTimePercentage: 0,
    },
    timestamp: new Date().toISOString(),
  });
};
