import mongoose, { Schema, Document, Types } from 'mongoose';
import { MaintenanceType, MaintenanceCategory, MaintenanceStatus } from '../types';

export interface IMaintenanceLog extends Document {
  collegeId: Types.ObjectId;
  busId: Types.ObjectId;
  type: MaintenanceType;
  category: MaintenanceCategory;
  description: string;
  cost: number;
  serviceProvider?: string;
  serviceProviderContact?: string;
  partsReplaced: Array<{
    name: string;
    cost: number;
    warrantyMonths: number;
  }>;
  odometerReading: number;
  nextServiceOdometer?: number;
  nextServiceDate?: Date;
  documents: string[];
  status: MaintenanceStatus;
  scheduledDate: Date;
  completedDate?: Date;
  aiRecommendation?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const MaintenanceLogSchema = new Schema<IMaintenanceLog>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    type: { type: String, enum: Object.values(MaintenanceType), required: true },
    category: { type: String, enum: Object.values(MaintenanceCategory), required: true },
    description: { type: String, required: true },
    cost: { type: Number, required: true },
    serviceProvider: { type: String },
    serviceProviderContact: { type: String },
    partsReplaced: [{
      name: { type: String },
      cost: { type: Number },
      warrantyMonths: { type: Number },
    }],
    odometerReading: { type: Number, required: true },
    nextServiceOdometer: { type: Number },
    nextServiceDate: { type: Date },
    documents: [{ type: String }],
    status: { type: String, enum: Object.values(MaintenanceStatus), default: MaintenanceStatus.SCHEDULED },
    scheduledDate: { type: Date, required: true },
    completedDate: { type: Date },
    aiRecommendation: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

MaintenanceLogSchema.index({ collegeId: 1, busId: 1, scheduledDate: -1 });
MaintenanceLogSchema.index({ collegeId: 1, status: 1, scheduledDate: 1 });
MaintenanceLogSchema.index({ collegeId: 1, nextServiceDate: 1 });
MaintenanceLogSchema.pre('find', function () { this.where({ isDeleted: false }); });
MaintenanceLogSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const MaintenanceLog = mongoose.model<IMaintenanceLog>('MaintenanceLog', MaintenanceLogSchema);
