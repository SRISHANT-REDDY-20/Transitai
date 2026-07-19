import mongoose, { Schema, Document, Types } from 'mongoose';
import { NotificationType, NotificationCategory, NotificationPriority, NotificationStatus } from '../types';

export interface INotification extends Document {
  collegeId: Types.ObjectId;
  userId: Types.ObjectId;
  type: NotificationType;
  category: NotificationCategory;
  title: string;
  body: string;
  data?: Record<string, unknown>;
  channels: {
    push: { sent: boolean; sentAt?: Date; delivered: boolean };
    email: { sent: boolean; sentAt?: Date; opened: boolean };
    sms: { sent: boolean; sentAt?: Date; delivered: boolean };
    inApp: { read: boolean; readAt?: Date };
  };
  priority: NotificationPriority;
  expiresAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type: { type: String, enum: Object.values(NotificationType), required: true },
    category: { type: String, enum: Object.values(NotificationCategory), required: true },
    title: { type: String, required: true },
    body: { type: String, required: true },
    data: { type: Schema.Types.Mixed },
    channels: {
      push: { sent: { type: Boolean, default: false }, sentAt: { type: Date }, delivered: { type: Boolean, default: false } },
      email: { sent: { type: Boolean, default: false }, sentAt: { type: Date }, opened: { type: Boolean, default: false } },
      sms: { sent: { type: Boolean, default: false }, sentAt: { type: Date }, delivered: { type: Boolean, default: false } },
      inApp: { read: { type: Boolean, default: false }, readAt: { type: Date } },
    },
    priority: { type: String, enum: Object.values(NotificationPriority), default: NotificationPriority.NORMAL },
    expiresAt: { type: Date },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

NotificationSchema.index({ collegeId: 1, userId: 1, 'channels.inApp.read': 1 });
NotificationSchema.index({ collegeId: 1, userId: 1, createdAt: -1 });
NotificationSchema.index({ collegeId: 1, category: 1 });
NotificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
NotificationSchema.pre('find', function () { this.where({ isDeleted: false }); });
NotificationSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
