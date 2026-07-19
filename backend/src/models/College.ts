import mongoose, { Schema, Document, Types } from 'mongoose';
import { CollegeStatus, SubscriptionPlan, SubscriptionStatus, FeeAction } from '../types';

export interface ICollege extends Document {
  name: string;
  slug: string;
  subdomain: string;
  logo?: string;
  address: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    coordinates: { lat: number; lng: number };
  };
  contact: {
    phone: string;
    email: string;
    website?: string;
  };
  settings: {
    timezone: string;
    currency: string;
    academicYearStart?: Date;
    academicYearEnd?: Date;
    feePolicy: {
      lateFeePercentage: number;
      lateFeeGraceDays: number;
      pendingFeeAction: FeeAction;
    };
    qrBoarding: {
      enabled: boolean;
      requirePhoto: boolean;
      autoNotifyParent: boolean;
    };
    gps: {
      updateInterval: number;
      offlineBufferLimit: number;
    };
    notifications: {
      boardingAlert: boolean;
      dropAlert: boolean;
      arrivalAlert: boolean;
      delayAlert: boolean;
      emergencyAlert: boolean;
    };
  };
  subscription: {
    plan: SubscriptionPlan;
    status: SubscriptionStatus;
    startedAt?: Date;
    expiresAt?: Date;
    maxBuses: number;
    maxStudents: number;
    maxDrivers: number;
    features: string[];
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const CollegeSchema = new Schema<ICollege>(
  {
    name: { type: String, required: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    subdomain: { type: String, required: true, unique: true, lowercase: true, trim: true },
    logo: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
    },
    contact: {
      phone: { type: String, required: true },
      email: { type: String, required: true, lowercase: true },
      website: { type: String },
    },
    settings: {
      timezone: { type: String, default: 'Asia/Kolkata' },
      currency: { type: String, default: 'INR' },
      academicYearStart: { type: Date },
      academicYearEnd: { type: Date },
      feePolicy: {
        lateFeePercentage: { type: Number, default: 5 },
        lateFeeGraceDays: { type: Number, default: 7 },
        pendingFeeAction: { type: String, enum: Object.values(FeeAction), default: FeeAction.WARN },
      },
      qrBoarding: {
        enabled: { type: Boolean, default: true },
        requirePhoto: { type: Boolean, default: false },
        autoNotifyParent: { type: Boolean, default: true },
      },
      gps: {
        updateInterval: { type: Number, default: 5 },
        offlineBufferLimit: { type: Number, default: 1000 },
      },
      notifications: {
        boardingAlert: { type: Boolean, default: true },
        dropAlert: { type: Boolean, default: true },
        arrivalAlert: { type: Boolean, default: true },
        delayAlert: { type: Boolean, default: true },
        emergencyAlert: { type: Boolean, default: true },
      },
    },
    subscription: {
      plan: { type: String, enum: Object.values(SubscriptionPlan), default: SubscriptionPlan.FREE },
      status: { type: String, enum: Object.values(SubscriptionStatus), default: SubscriptionStatus.TRIAL },
      startedAt: { type: Date },
      expiresAt: { type: Date },
      maxBuses: { type: Number, default: 5 },
      maxStudents: { type: Number, default: 100 },
      maxDrivers: { type: Number, default: 5 },
      features: [{ type: String }],
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

CollegeSchema.index({ slug: 1 }, { unique: true });
CollegeSchema.index({ subdomain: 1 }, { unique: true });
CollegeSchema.index({ 'subscription.status': 1, 'subscription.expiresAt': 1 });
CollegeSchema.index({ isActive: 1, isDeleted: 1 });

CollegeSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

CollegeSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

export const College = mongoose.model<ICollege>('College', CollegeSchema);
