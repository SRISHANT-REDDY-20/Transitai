import mongoose, { Schema, Document, Types } from 'mongoose';
import { AttendanceType, AttendanceStatus } from '../types';

export interface IAttendance extends Document {
  collegeId: Types.ObjectId;
  tripId: Types.ObjectId;
  studentId: Types.ObjectId;
  stopId: Types.ObjectId;
  type: AttendanceType;
  scannedAt: Date;
  scannedBy: Types.ObjectId;
  scannedByBus: Types.ObjectId;
  location: { lat: number; lng: number };
  qrCode: string;
  status: AttendanceStatus;
  feeAlertTriggered: boolean;
  photoUrl?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const AttendanceSchema = new Schema<IAttendance>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    stopId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    type: { type: String, enum: Object.values(AttendanceType), required: true },
    scannedAt: { type: Date, default: Date.now },
    scannedBy: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    scannedByBus: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    qrCode: { type: String, required: true },
    status: { type: String, enum: Object.values(AttendanceStatus), default: AttendanceStatus.VALID },
    feeAlertTriggered: { type: Boolean, default: false },
    photoUrl: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

AttendanceSchema.index({ collegeId: 1, tripId: 1, studentId: 1, type: 1 }, { unique: true });
AttendanceSchema.index({ collegeId: 1, studentId: 1, scannedAt: -1 });
AttendanceSchema.index({ collegeId: 1, tripId: 1, type: 1 });
AttendanceSchema.index({ collegeId: 1, scannedAt: -1 });
AttendanceSchema.pre('find', function () { this.where({ isDeleted: false }); });
AttendanceSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Attendance = mongoose.model<IAttendance>('Attendance', AttendanceSchema);
