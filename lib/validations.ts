import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(50, 'Name must be less than 50 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Name can only contain letters and spaces'),
  email: z.string()
    .email('Invalid email address')
    .max(100, 'Email must be less than 100 characters'),
  password: z.string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be less than 128 characters')
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, 
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  date: z.string().or(z.date()).transform((val) => new Date(val)).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, {
    message: 'Cannot enter transactions for future dates',
  }),
  description: z.string().optional(),
  notes: z.string().max(1000, 'Notes cannot exceed 1000 characters').optional(),
  recurring: z.object({
    frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
    interval: z.number().min(1),
    endDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
    count: z.number().optional(),
  }).optional(),
});

export const budgetSchema = z.object({
  category: z.string().min(1, 'Category is required'),
  amount: z.number().positive('Amount must be positive'),
  period: z.enum(['monthly', 'weekly', 'yearly']),
  startDate: z.string().or(z.date()).transform((val) => new Date(val)).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, {
    message: 'Start date cannot be in the future',
  }),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
});

export const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  avatar: z.string().optional(),
  preferences: z.object({
    currency: z.string().optional(),
    dateFormat: z.string().optional(),
    theme: z.enum(['light', 'dark', 'system']).optional(),
  }).optional(),
});

export const recurringRuleSchema = z.object({
  frequency: z.enum(['daily', 'weekly', 'monthly', 'yearly']),
  interval: z.number().min(1, 'Interval must be at least 1').default(1),
  dayOfWeek: z.number().min(0).max(6).optional(),
  dayOfMonth: z.number().min(1).max(31).optional(),
  monthOfYear: z.number().min(1).max(12).optional(),
});

export const recurringTransactionSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title is too long'),
  amount: z.number().positive('Amount must be positive'),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  paymentMethod: z.string().min(1, 'Payment method is required'),
  description: z.string().optional(),
  recurringRule: recurringRuleSchema,
  startDate: z.string().or(z.date()).transform((val) => new Date(val)).refine((date) => {
    const today = new Date();
    today.setHours(23, 59, 59, 999);
    return date <= today;
  }, {
    message: 'Start date cannot be in the future',
  }),
  endDate: z.string().or(z.date()).transform((val) => new Date(val)).optional(),
  maxOccurrences: z.number().positive().optional(),
  isActive: z.boolean().default(true),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type BudgetInput = z.infer<typeof budgetSchema>;
export type UserUpdateInput = z.infer<typeof userUpdateSchema>;