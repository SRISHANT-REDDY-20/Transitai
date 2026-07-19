import mongoose, { Schema, Document, Types } from 'mongoose';
import { DriverStatus, DocumentType } from '../types';

export interface IDriver extends Document {
  collegeId: Types.ObjectId;
  userId: Types.ObjectId;
  licenseNumber: string;
  licenseExpiry: Date;
  licenseImage?: string;
  experienceYears: number;
  rating: number;
  totalTrips: number;
  status: DriverStatus;
  currentLocation?: { lat: number; lng: number; updatedAt: Date };
  assignedBus?: Types.ObjectId;
  performance: {
    overspeedingCount: number;
    harshBrakingCount: number;
    idleTimeMinutes: number;
    onTimePercentage: number;
    averageRating: number;
  };
  documents: Array<{
    type: DocumentType;
    url: string;
    expiryDate: Date;
    verified: boolean;
  }>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const DriverSchema = new Schema<IDriver>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    licenseNumber: { type: String, required: true },
    licenseExpiry: { type: Date, required: true },
    licenseImage: { type: String },
    experienceYears: { type: Number, default: 0 },
    rating: { type: Number, default: 5, min: 1, max: 5 },
    totalTrips: { type: Number, default: 0 },
    status: { type: String, enum: Object.values(DriverStatus), default: DriverStatus.AVAILABLE },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
    assignedBus: { type: Schema.Types.ObjectId, ref: 'Bus' },
    performance: {
      overspeedingCount: { type: Number, default: 0 },
      harshBrakingCount: { type: Number, default: 0 },
      idleTimeMinutes: { type: Number, default: 0 },
      onTimePercentage: { type: Number, default: 100 },
      averageRating: { type: Number, default: 5 },
    },
    documents: [{
      type: { type: String, enum: Object.values(DocumentType) },
      url: { type: String },
      expiryDate: { type: Date },
      verified: { type: Boolean, default: false },
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

DriverSchema.index({ collegeId: 1, userId: 1 }, { unique: true });
DriverSchema.index({ collegeId: 1, licenseNumber: 1 });
DriverSchema.index({ collegeId: 1, status: 1 });
DriverSchema.index({ collegeId: 1, assignedBus: 1 });
DriverSchema.pre('find', function () { this.where({ isDeleted: false }); });
DriverSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Driver = mongoose.model<IDriver>('Driver', DriverSchema);
