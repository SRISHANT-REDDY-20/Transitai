import mongoose, { Schema, Document, Types } from 'mongoose';
import { FeeType, FeeApplicableTo, FeeStructureStatus, LateFeeType } from '../types';

export interface IFeeStructure extends Document {
  collegeId: Types.ObjectId;
  name: string;
  description?: string;
  type: FeeType;
  amount: number;
  applicableTo: FeeApplicableTo[];
  applicableRoutes?: Types.ObjectId[];
  applicableBuses?: Types.ObjectId[];
  academicYear: string;
  semester: number;
  dueDate: Date;
  lateFee: {
    type: LateFeeType;
    value: number;
    graceDays: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const FeeStructureSchema = new Schema<IFeeStructure>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    name: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: Object.values(FeeType), required: true },
    amount: { type: Number, required: true },
    applicableTo: [{ type: String, enum: Object.values(FeeApplicableTo) }],
    applicableRoutes: [{ type: Schema.Types.ObjectId, ref: 'Route' }],
    applicableBuses: [{ type: Schema.Types.ObjectId, ref: 'Bus' }],
    academicYear: { type: String, required: true },
    semester: { type: Number, required: true },
    dueDate: { type: Date, required: true },
    lateFee: {
      type: { type: String, enum: Object.values(LateFeeType), default: LateFeeType.PERCENTAGE },
      value: { type: Number, default: 5 },
      graceDays: { type: Number, default: 7 },
    },
    isActive: { type: Boolean, default: true },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

FeeStructureSchema.index({ collegeId: 1, name: 1 });
FeeStructureSchema.index({ collegeId: 1, isActive: 1 });
FeeStructureSchema.index({ collegeId: 1, academicYear: 1, semester: 1 });
FeeStructureSchema.pre('find', function () { this.where({ isDeleted: false }); });
FeeStructureSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const FeeStructure = mongoose.model<IFeeStructure>('FeeStructure', FeeStructureSchema);
