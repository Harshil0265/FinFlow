import mongoose from 'mongoose';

const recurringTransactionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: [true, 'User ID is required'],
    index: true,
  },
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
  },
  amount: {
    type: Number,
    required: [true, 'Amount is required'],
    min: [0, 'Amount must be positive'],
  },
  type: {
    type: String,
    enum: ['income', 'expense'],
    required: [true, 'Type is required'],
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    trim: true,
  },
  paymentMethod: {
    type: String,
    required: [true, 'Payment method is required'],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  recurringRule: {
    frequency: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: [true, 'Frequency is required'],
    },
    interval: {
      type: Number,
      default: 1,
      min: [1, 'Interval must be at least 1'],
    },
    dayOfWeek: {
      type: Number,
      min: 0,
      max: 6,
    },
    dayOfMonth: {
      type: Number,
      min: 1,
      max: 31,
    },
    monthOfYear: {
      type: Number,
      min: 1,
      max: 12,
    },
  },
  startDate: {
    type: Date,
    required: [true, 'Start date is required'],
  },
  endDate: {
    type: Date,
  },
  nextDueDate: {
    type: Date,
    required: [true, 'Next due date is required'],
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  lastProcessed: {
    type: Date,
  },
  totalOccurrences: {
    type: Number,
    default: 0,
  },
  maxOccurrences: {
    type: Number,
  },
}, {
  timestamps: true,
});

// Index for efficient queries
recurringTransactionSchema.index({ userId: 1, isActive: 1 });
recurringTransactionSchema.index({ nextDueDate: 1, isActive: 1 });

// Method to calculate next due date
recurringTransactionSchema.methods.calculateNextDueDate = function() {
  const { frequency, interval, dayOfWeek, dayOfMonth } = this.recurringRule;
  const currentDate = this.nextDueDate || this.startDate;
  let nextDate = new Date(currentDate);

  switch (frequency) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + interval);
      break;
    
    case 'weekly':
      if (dayOfWeek !== undefined) {
        // Set to specific day of week
        const daysUntilTarget = (dayOfWeek - nextDate.getDay() + 7) % 7;
        nextDate.setDate(nextDate.getDate() + daysUntilTarget + (interval - 1) * 7);
      } else {
        nextDate.setDate(nextDate.getDate() + interval * 7);
      }
      break;
    
    case 'monthly':
      if (dayOfMonth) {
        nextDate.setMonth(nextDate.getMonth() + interval);
        nextDate.setDate(Math.min(dayOfMonth, new Date(nextDate.getFullYear(), nextDate.getMonth() + 1, 0).getDate()));
      } else {
        nextDate.setMonth(nextDate.getMonth() + interval);
      }
      break;
    
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + interval);
      break;
  }

  return nextDate;
};

// Method to check if recurring transaction should be processed
recurringTransactionSchema.methods.shouldProcess = function() {
  if (!this.isActive) return false;
  
  const now = new Date();
  const dueDate = new Date(this.nextDueDate);
  
  // Check if due date has passed
  if (now >= dueDate) {
    // Check max occurrences limit
    if (this.maxOccurrences && this.totalOccurrences >= this.maxOccurrences) {
      return false;
    }
    
    // Check end date
    if (this.endDate && now > this.endDate) {
      return false;
    }
    
    return true;
  }
  
  return false;
};

const RecurringTransactionModel = mongoose.models.RecurringTransaction || 
  mongoose.model('RecurringTransaction', recurringTransactionSchema);

export default RecurringTransactionModel;