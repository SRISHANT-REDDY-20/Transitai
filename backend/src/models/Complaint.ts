import mongoose, { Schema, Document, Types } from 'mongoose';
import { ComplaintStatus, ComplaintPriority, ComplaintCategory } from '../types';

export interface IComplaint extends Document {
  collegeId: Types.ObjectId;
  ticketNumber: string;
  reportedBy: Types.ObjectId;
  reportedByRole: string;
  category: ComplaintCategory;
  aiCategory?: string;
  aiConfidence?: number;
  priority: ComplaintPriority;
  aiPriority?: string;
  status: ComplaintStatus;
  title: string;
  description: string;
  attachments: string[];
  relatedTripId?: Types.ObjectId;
  relatedBusId?: Types.ObjectId;
  relatedDriverId?: Types.ObjectId;
  assignedTo?: Types.ObjectId;
  resolution?: string;
  resolvedAt?: Date;
  satisfactionRating?: number;
  aiSummary?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const ComplaintSchema = new Schema<IComplaint>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    ticketNumber: { type: String, required: true },
    reportedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    reportedByRole: { type: String, required: true },
    category: { type: String, enum: Object.values(ComplaintCategory), required: true },
    aiCategory: { type: String },
    aiConfidence: { type: Number },
    priority: { type: String, enum: Object.values(ComplaintPriority), required: true },
    aiPriority: { type: String },
    status: { type: String, enum: Object.values(ComplaintStatus), default: ComplaintStatus.OPEN },
    title: { type: String, required: true },
    description: { type: String, required: true },
    attachments: [{ type: String }],
    relatedTripId: { type: Schema.Types.ObjectId, ref: 'Trip' },
    relatedBusId: { type: Schema.Types.ObjectId, ref: 'Bus' },
    relatedDriverId: { type: Schema.Types.ObjectId, ref: 'Driver' },
    assignedTo: { type: Schema.Types.ObjectId, ref: 'User' },
    resolution: { type: String },
    resolvedAt: { type: Date },
    satisfactionRating: { type: Number, min: 1, max: 5 },
    aiSummary: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

ComplaintSchema.index({ collegeId: 1, ticketNumber: 1 }, { unique: true });
ComplaintSchema.index({ collegeId: 1, status: 1, priority: 1 });
ComplaintSchema.index({ collegeId: 1, reportedBy: 1 });
ComplaintSchema.index({ collegeId: 1, assignedTo: 1 });
ComplaintSchema.index({ collegeId: 1, category: 1 });
ComplaintSchema.pre('find', function () { this.where({ isDeleted: false }); });
ComplaintSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Complaint = mongoose.model<IComplaint>('Complaint', ComplaintSchema);
