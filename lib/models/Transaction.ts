import mongoose, { Schema, Document } from 'mongoose';
import { Transaction, RecurringRule } from '@/types';

export interface ITransaction extends Omit<Transaction, '_id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const RecurringRuleSchema = new Schema<RecurringRule>({
  frequency: {
    type: String,
    enum: ['daily', 'weekly', 'monthly', 'yearly'],
    required: true,
  },
  interval: {
    type: Number,
    required: true,
    min: 1,
  },
  endDate: {
    type: Date,
    default: null,
  },
  count: {
    type: Number,
    default: null,
  },
});

const TransactionSchema = new Schema<ITransaction>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  title: {
    type: String,
    required: true,
    trim: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  paymentMethod: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
  description: {
    type: String,
    default: '',
  },
  notes: {
    type: String,
    default: '',
  },
  attachments: [{
    type: String,
  }],
  recurring: {
    type: RecurringRuleSchema,
    default: null,
  },
  // SMS Import metadata
  source: {
    type: String,
    enum: ['manual', 'sms_import', 'api', 'recurring'],
    default: 'manual',
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    default: null,
  },
  originalSMS: {
    type: String,
    default: null,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
TransactionSchema.index({ userId: 1, date: -1 });
TransactionSchema.index({ userId: 1, category: 1 });
TransactionSchema.index({ userId: 1, type: 1 });

export default mongoose.models.Transaction || mongoose.model<ITransaction>('Transaction', TransactionSchema);