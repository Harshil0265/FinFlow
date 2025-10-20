import mongoose, { Schema, Document } from 'mongoose';
import { Budget } from '@/types';

export interface IBudget extends Omit<Budget, '_id' | 'userId'>, Document {
  userId: mongoose.Types.ObjectId;
}

const BudgetSchema = new Schema<IBudget>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  period: {
    type: String,
    enum: ['monthly', 'weekly', 'yearly'],
    default: 'monthly',
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    default: null,
  },
}, {
  timestamps: true,
});

// Ensure unique budget per category per user per period
BudgetSchema.index({ userId: 1, category: 1, period: 1 }, { unique: true });

export default mongoose.models.Budget || mongoose.model<IBudget>('Budget', BudgetSchema);