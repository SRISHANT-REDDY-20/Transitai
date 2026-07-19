import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IGPSLog extends Document {
  collegeId: Types.ObjectId;
  busId: Types.ObjectId;
  driverId: Types.ObjectId;
  tripId: Types.ObjectId;
  timestamp: Date;
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
  speed: number;
  heading: number;
  accuracy: number;
  altitude: number;
  batteryLevel: number;
  isOffline: boolean;
  syncedAt: Date;
}

const GPSLogSchema = new Schema<IGPSLog>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    busId: { type: Schema.Types.ObjectId, ref: 'Bus', required: true },
    driverId: { type: Schema.Types.ObjectId, ref: 'Driver', required: true },
    tripId: { type: Schema.Types.ObjectId, ref: 'Trip', required: true },
    timestamp: { type: Date, required: true },
    location: {
      type: { type: String, enum: ['Point'], default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    speed: { type: Number, default: 0 },
    heading: { type: Number, default: 0 },
    accuracy: { type: Number, default: 0 },
    altitude: { type: Number, default: 0 },
    batteryLevel: { type: Number, default: 100 },
    isOffline: { type: Boolean, default: false },
    syncedAt: { type: Date, default: Date.now },
  },
  { timestamps: false }
);

GPSLogSchema.index({ collegeId: 1, busId: 1, timestamp: -1 });
GPSLogSchema.index({ collegeId: 1, tripId: 1, timestamp: 1 });
GPSLogSchema.index({ location: '2dsphere' });
GPSLogSchema.index({ timestamp: 1 }, { expireAfterSeconds: 7776000 }); // 90 days TTL

export const GPSLog = mongoose.model<IGPSLog>('GPSLog', GPSLogSchema);
