import mongoose, { Schema, Document, Types } from 'mongoose';
import { StudentStatus, BloodGroup, Gender } from '../types';

export interface IStudent extends Document {
  collegeId: Types.ObjectId;
  userId: Types.ObjectId;
  studentId: string;
  enrollmentNumber?: string;
  department: string;
  course: string;
  year: number;
  semester: number;
  dateOfBirth?: Date;
  gender?: Gender;
  bloodGroup?: BloodGroup;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    coordinates?: { lat: number; lng: number };
  };
  emergencyContacts: Array<{
    name: string;
    relation: string;
    phone: string;
    isPrimary: boolean;
  }>;
  busPass: {
    qrCode: string;
    qrImage?: string;
    issuedAt?: Date;
    expiresAt?: Date;
    isActive: boolean;
  };
  assignedRoute?: Types.ObjectId;
  assignedStop?: Types.ObjectId;
  assignedBus?: Types.ObjectId;
  feeStatus: {
    totalDue: number;
    totalPaid: number;
    lastPaymentDate?: Date;
    isBlocked: boolean;
  };
  parentIds: Types.ObjectId[];
  status: StudentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const StudentSchema = new Schema<IStudent>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    studentId: { type: String, required: true },
    enrollmentNumber: { type: String },
    department: { type: String, required: true },
    course: { type: String, required: true },
    year: { type: Number, required: true },
    semester: { type: Number, required: true },
    dateOfBirth: { type: Date },
    gender: { type: String, enum: Object.values(Gender) },
    bloodGroup: { type: String, enum: Object.values(BloodGroup) },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
      coordinates: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    emergencyContacts: [{
      name: { type: String, required: true },
      relation: { type: String, required: true },
      phone: { type: String, required: true },
      isPrimary: { type: Boolean, default: false },
    }],
    busPass: {
      qrCode: { type: String, required: true, unique: true },
      qrImage: { type: String },
      issuedAt: { type: Date },
      expiresAt: { type: Date },
      isActive: { type: Boolean, default: true },
    },
    assignedRoute: { type: Schema.Types.ObjectId, ref: 'Route' },
    assignedStop: { type: Schema.Types.ObjectId, ref: 'Route' },
    assignedBus: { type: Schema.Types.ObjectId, ref: 'Bus' },
    feeStatus: {
      totalDue: { type: Number, default: 0 },
      totalPaid: { type: Number, default: 0 },
      lastPaymentDate: { type: Date },
      isBlocked: { type: Boolean, default: false },
    },
    parentIds: [{ type: Schema.Types.ObjectId, ref: 'Parent' }],
    status: { type: String, enum: Object.values(StudentStatus), default: StudentStatus.ACTIVE },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

StudentSchema.index({ collegeId: 1, studentId: 1 }, { unique: true });
StudentSchema.index({ collegeId: 1, userId: 1 }, { unique: true });
StudentSchema.index({ collegeId: 1, 'busPass.qrCode': 1 });
StudentSchema.index({ collegeId: 1, assignedRoute: 1 });
StudentSchema.index({ collegeId: 1, assignedBus: 1 });
StudentSchema.index({ collegeId: 1, 'feeStatus.isBlocked': 1 });

StudentSchema.pre('find', function () {
  this.where({ isDeleted: false });
});

StudentSchema.pre('findOne', function () {
  this.where({ isDeleted: false });
});

export const Student = mongoose.model<IStudent>('Student', StudentSchema);
