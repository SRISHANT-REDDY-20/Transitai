import mongoose, { Schema, Document, Types } from 'mongoose';
import { TripStatus, StopStatus, IncidentType, IncidentSeverity } from '../types';

export interface ITrip extends Document {
  collegeId: Types.ObjectId;
  routeId: Types.ObjectId;
  busId: Types.ObjectId;
  driverId: Types.ObjectId;
  type: 'MORNING' | 'EVENING';
  date: Date;
  status: TripStatus;
  startedAt?: Date;
  completedAt?: Date;
  scheduledStartTime: Date;
  scheduledEndTime: Date;
  actualStartTime?: Date;
  actualEndTime?: Date;
  stops: Array<{
    stopId: Types.ObjectId;
    scheduledArrival?: Date;
    actualArrival?: Date;
    scheduledDeparture?: Date;
    actualDeparture?: Date;
    delayMinutes: number;
    boardedCount: number;
    droppedCount: number;
    status: StopStatus;
  }>;
  passengerCount: {
    boarded: number;
    dropped: number;
    expected: number;
  };
  metrics: {
    totalDistanceKm: number;
    averageSpeed: number;
    maxSpeed: number;
    idleTimeMinutes: number;
    fuelConsumed: number;
    overspeedingEvents: number;
    harshBrakingEvents: number;
  };
  aiSummary?: string;
  incidents: Array<{
    type: IncidentType;
    description: string;
    timestamp: Date;
    severity: IncidentSeverity;
  }>;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const TripSchema = new Schema<ITrip>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    routeId: { type: Schema.Types.ObjectId, ref: 'Route', required: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    type: { type: String, enum: ['MORNING', 'EVENING'], required: true },
    date: { type: Date, required: true },
    status: { type: String, enum: Object.values(TripStatus), default: TripStatus.SCHEDULED },
    startedAt: { type: Date },
    completedAt: { type: Date },
    scheduledStartTime: { type: Date, required: true },
    scheduledEndTime: { type: Date, required: true },
    actualStartTime: { type: Date },
    actualEndTime: { type: Date },
    stops: [{
      stopId: { type: Schema.Types.ObjectId, ref: 'Route' },
      scheduledArrival: { type: Date },
      actualArrival: { type: Date },
      scheduledDeparture: { type: Date },
      actualDeparture: { type: Date },
      delayMinutes: { type: Number, default: 0 },
      boardedCount: { type: Number, default: 0 },
      droppedCount: { type: Number, default: 0 },
      status: { type: String, enum: Object.values(StopStatus), default: StopStatus.PENDING },
    }],
    passengerCount: {
      boarded: { type: Number, default: 0 },
      dropped: { type: Number, default: 0 },
      expected: { type: Number, default: 0 },
    },
    metrics: {
      totalDistanceKm: { type: Number, default: 0 },
      averageSpeed: { type: Number, default: 0 },
      maxSpeed: { type: Number, default: 0 },
      idleTimeMinutes: { type: Number, default: 0 },
      fuelConsumed: { type: Number, default: 0 },
      overspeedingEvents: { type: Number, default: 0 },
      harshBrakingEvents: { type: Number, default: 0 },
    },
    aiSummary: { type: String },
    incidents: [{
      type: { type: String, enum: Object.values(IncidentType) },
      description: { type: String },
      timestamp: { type: Date },
      severity: { type: String, enum: Object.values(IncidentSeverity) },
    }],
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

TripSchema.index({ collegeId: 1, date: -1, status: 1 });
TripSchema.index({ collegeId: 1, routeId: 1, date: -1 });
TripSchema.index({ collegeId: 1, busId: 1, date: -1 });
TripSchema.index({ collegeId: 1, driverId: 1, date: -1 });
TripSchema.index({ collegeId: 1, status: 1, date: -1 });
TripSchema.pre('find', function () { this.where({ isDeleted: false }); });
TripSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
