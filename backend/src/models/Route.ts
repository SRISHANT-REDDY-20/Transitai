import mongoose, { Schema, Document, Types } from 'mongoose';
import { RouteType, RouteStatus } from '../types';

export interface IRoute extends Document {
  collegeId: Types.ObjectId;
  name: string;
  code: string;
  description?: string;
  type: RouteType;
  status: RouteStatus;
  totalDistanceKm: number;
  estimatedDurationMinutes: number;
  stops: Array<{
    _id: Types.ObjectId;
    name: string;
    address: string;
    coordinates: { lat: number; lng: number };
    order: number;
    estimatedArrivalTime: string;
    estimatedDepartureTime: string;
    radius: number;
    landmark?: string;
    isCollege: boolean;
  }>;
  assignedBuses: Types.ObjectId[];
  assignedDrivers: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const RouteSchema = new Schema<IRoute>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String },
    type: { type: String, enum: Object.values(RouteType), required: true },
    status: { type: String, enum: Object.values(RouteStatus), default: RouteStatus.ACTIVE },
    totalDistanceKm: { type: Number, default: 0 },
    estimatedDurationMinutes: { type: Number, default: 0 },
    stops: [{
      name: { type: String, required: true },
      address: { type: String, required: true },
      coordinates: {
        lat: { type: Number, required: true },
        lng: { type: Number, required: true },
      },
      order: { type: Number, required: true },
      estimatedArrivalTime: { type: String },
      estimatedDepartureTime: { type: String },
      radius: { type: Number, default: 100 },
      landmark: { type: String },
      isCollege: { type: Boolean, default: false },
    }],
    assignedBuses: [{ type: Schema.Types.ObjectId, ref: 'Bus' }],
    assignedDrivers: [{ type: Schema.Types.ObjectId, ref: 'Driver' }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

RouteSchema.index({ collegeId: 1, code: 1 }, { unique: true });
RouteSchema.index({ collegeId: 1, status: 1 });
RouteSchema.index({ collegeId: 1, 'stops.coordinates': '2dsphere' });
RouteSchema.pre('find', function () { this.where({ isDeleted: false }); });
RouteSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Route = mongoose.model<IRoute>('Route', RouteSchema);
