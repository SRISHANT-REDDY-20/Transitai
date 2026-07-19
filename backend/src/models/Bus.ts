import mongoose, { Schema, Document, Types } from 'mongoose';
import { BusStatus, BusType, FuelType, DocumentType } from '../types';

export interface IBus extends Document {
  collegeId: Types.ObjectId;
  registrationNumber: string;
  busModel: string;
  manufacturer: string;
  year: number;
  capacity: number;
  color: string;
  type: BusType;
  status: BusStatus;
  currentLocation?: { lat: number; lng: number; updatedAt: Date };
  assignedDriver?: Types.ObjectId;
  assignedRoute?: Types.ObjectId;
  fuelType: FuelType;
  mileage: number;
  documents: Array<{
    type: DocumentType;
    number: string;
    url: string;
    issueDate: Date;
    expiryDate: Date;
    verified: boolean;
  }>;
  maintenanceSchedule: {
    lastServiceDate?: Date;
    nextServiceDate?: Date;
    serviceIntervalKm: number;
    currentKm: number;
  };
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const BusSchema = new Schema<IBus>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    registrationNumber: { type: String, required: true },
    busModel: { type: String, required: true },
    manufacturer: { type: String, required: true },
    year: { type: Number, required: true },
    capacity: { type: Number, required: true },
    color: { type: String, required: true },
    type: { type: String, enum: Object.values(BusType), default: BusType.BUS },
    status: { type: String, enum: Object.values(BusStatus), default: BusStatus.ACTIVE },
    currentLocation: {
      lat: { type: Number },
      lng: { type: Number },
      updatedAt: { type: Date },
    },
    assignedDriver: { type: Schema.Types.ObjectId, ref: 'Driver' },
    assignedRoute: { type: Schema.Types.ObjectId, ref: 'Route' },
    fuelType: { type: String, enum: Object.values(FuelType), required: true },
    mileage: { type: Number, default: 0 },
    documents: [{
      type: { type: String, enum: Object.values(DocumentType) },
      number: { type: String },
      url: { type: String },
      issueDate: { type: Date },
      expiryDate: { type: Date },
      verified: { type: Boolean, default: false },
    }],
    maintenanceSchedule: {
      lastServiceDate: { type: Date },
      nextServiceDate: { type: Date },
      serviceIntervalKm: { type: Number, default: 5000 },
      currentKm: { type: Number, default: 0 },
    },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

BusSchema.index({ collegeId: 1, registrationNumber: 1 }, { unique: true });
BusSchema.index({ collegeId: 1, status: 1 });
BusSchema.index({ collegeId: 1, assignedDriver: 1 });
BusSchema.index({ collegeId: 1, 'documents.expiryDate': 1 });
BusSchema.index({ collegeId: 1, 'maintenanceSchedule.nextServiceDate': 1 });
BusSchema.pre('find', function () { this.where({ isDeleted: false }); });
BusSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Bus = mongoose.model<IBus>('Bus', BusSchema);
