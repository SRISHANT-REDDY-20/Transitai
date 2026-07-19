import mongoose, { Schema, Document, Types } from 'mongoose';
import { AuditAction, AuditSeverity } from '../types';

export interface IAuditLog extends Document {
  collegeId: Types.ObjectId;
  userId: Types.ObjectId;
  userRole: string;
  action: AuditAction;
  entityType: string;
  entityId: Types.ObjectId;
  previousData?: Record<string, unknown>;
  newData?: Record<string, unknown>;
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    deviceId?: string;
    location?: { lat: number; lng: number };
  };
  severity: AuditSeverity;
  createdAt: Date;
}

const AuditLogSchema = new Schema<IAuditLog>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    userRole: { type: String, required: true },
    action: { type: String, enum: Object.values(AuditAction), required: true },
    entityType: { type: String, required: true },
    entityId: { type: Schema.Types.ObjectId, required: true },
    previousData: { type: Schema.Types.Mixed },
    newData: { type: Schema.Types.Mixed },
    metadata: {
      ipAddress: { type: String },
      userAgent: { type: String },
      deviceId: { type: String },
      location: {
        lat: { type: Number },
        lng: { type: Number },
      },
    },
    severity: { type: String, enum: Object.values(AuditSeverity), default: AuditSeverity.INFO },
  },
  { timestamps: { updatedAt: false } }
);

AuditLogSchema.index({ collegeId: 1, entityType: 1, entityId: 1 });
AuditLogSchema.index({ collegeId: 1, userId: 1, createdAt: -1 });
AuditLogSchema.index({ collegeId: 1, action: 1, createdAt: -1 });
AuditLogSchema.index({ collegeId: 1, severity: 1 });
AuditLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 63072000 }); // 2 years TTL

export const AuditLog = mongoose.model<IAuditLog>('AuditLog', AuditLogSchema);
