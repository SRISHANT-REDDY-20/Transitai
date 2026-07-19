import mongoose, { Schema, Document, Types } from 'mongoose';
import { ParentRelation, ParentStatus } from '../types';

export interface IParent extends Document {
  collegeId: Types.ObjectId;
  userId: Types.ObjectId;
  children: Types.ObjectId[];
  relation: ParentRelation;
  occupation?: string;
  alternatePhone?: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
  };
  notificationPreferences: {
    boarding: boolean;
    drop: boolean;
    arrival: boolean;
    delay: boolean;
    emergency: boolean;
    feeReminder: boolean;
  };
  fcmTokens: string[];
  status: ParentStatus;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const ParentSchema = new Schema<IParent>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    children: [{ type: Schema.Types.ObjectId, ref: 'Student' }],
    relation: { type: String, enum: Object.values(ParentRelation), required: true },
    occupation: { type: String },
    alternatePhone: { type: String },
    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      zipCode: { type: String, required: true },
    },
    notificationPreferences: {
      boarding: { type: Boolean, default: true },
      drop: { type: Boolean, default: true },
      arrival: { type: Boolean, default: true },
      delay: { type: Boolean, default: true },
      emergency: { type: Boolean, default: true },
      feeReminder: { type: Boolean, default: true },
    },
    fcmTokens: [{ type: String }],
    status: { type: String, enum: Object.values(ParentStatus), default: ParentStatus.ACTIVE },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ParentSchema.index({ collegeId: 1, userId: 1 }, { unique: true });
ParentSchema.index({ collegeId: 1, children: 1 });
ParentSchema.pre('find', function () { this.where({ isDeleted: false }); });
ParentSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Parent = mongoose.model<IParent>('Parent', ParentSchema);
