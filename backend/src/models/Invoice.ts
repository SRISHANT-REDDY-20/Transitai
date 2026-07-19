import mongoose, { Schema, Document, Types } from 'mongoose';
import { InvoiceStatus, PaymentMethod, FeeItemType } from '../types';

export interface IInvoice extends Document {
  collegeId: Types.ObjectId;
  invoiceNumber: string;
  studentId: Types.ObjectId;
  feeStructureId: Types.ObjectId;
  items: Array<{
    description: string;
    amount: number;
    type: FeeItemType;
  }>;
  subtotal: number;
  lateFee: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  balanceDue: number;
  status: InvoiceStatus;
  dueDate: Date;
  paidAt?: Date;
  paymentMethod?: PaymentMethod;
  transactionId?: string;
  receiptUrl?: string;
  reminderSentAt: Date[];
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
  createdBy?: Types.ObjectId;
  updatedBy?: Types.ObjectId;
  isDeleted: boolean;
  deletedAt?: Date;
}

const InvoiceSchema = new Schema<IInvoice>(
  {
    collegeId: { type: Schema.Types.ObjectId, ref: 'College', required: true, index: true },
    invoiceNumber: { type: String, required: true },
    studentId: { type: Schema.Types.ObjectId, ref: 'Student', required: true },
    feeStructureId: { type: Schema.Types.ObjectId, ref: 'FeeStructure', required: true },
    items: [{
      description: { type: String, required: true },
      amount: { type: Number, required: true },
      type: { type: String, enum: Object.values(FeeItemType), required: true },
    }],
    subtotal: { type: Number, required: true },
    lateFee: { type: Number, default: 0 },
    discount: { type: Number, default: 0 },
    totalAmount: { type: Number, required: true },
    paidAmount: { type: Number, default: 0 },
    balanceDue: { type: Number, required: true },
    status: { type: String, enum: Object.values(InvoiceStatus), default: InvoiceStatus.PENDING },
    dueDate: { type: Date, required: true },
    paidAt: { type: Date },
    paymentMethod: { type: String, enum: Object.values(PaymentMethod) },
    transactionId: { type: String },
    receiptUrl: { type: String },
    reminderSentAt: [{ type: Date }],
    notes: { type: String },
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
    isDeleted: { type: Boolean, default: false },
    deletedAt: { type: Date },
  },
  { timestamps: true }
);

InvoiceSchema.index({ collegeId: 1, invoiceNumber: 1 }, { unique: true });
InvoiceSchema.index({ collegeId: 1, studentId: 1, status: 1 });
InvoiceSchema.index({ collegeId: 1, status: 1, dueDate: 1 });
InvoiceSchema.index({ collegeId: 1, balanceDue: 1 });
InvoiceSchema.pre('find', function () { this.where({ isDeleted: false }); });
InvoiceSchema.pre('findOne', function () { this.where({ isDeleted: false }); });

export const Invoice = mongoose.model<IInvoice>('Invoice', InvoiceSchema);
