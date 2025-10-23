export interface User {
  _id: string;
  email: string;
  name: string;
  avatar?: string;
  preferences: {
    currency: string;
    dateFormat: string;
    theme: 'light' | 'dark' | 'system';
  };
  refreshToken?: string;
  lastLogin?: Date;
  loginAttempts?: number;
  lockUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Transaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  date: Date;
  description?: string;
  notes?: string;
  attachments?: string[];
  recurring?: RecurringRule;
  source?: 'manual' | 'sms_import' | 'api' | 'recurring';
  confidence?: number;
  originalSMS?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface RecurringRule {
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  dayOfWeek?: number; // 0-6 (Sunday-Saturday)
  dayOfMonth?: number; // 1-31
  monthOfYear?: number; // 1-12
  endDate?: Date;
  count?: number;
}

export interface RecurringTransaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  description?: string;
  recurringRule: RecurringRule;
  startDate: Date;
  endDate?: Date;
  nextDueDate: Date;
  isActive: boolean;
  lastProcessed?: Date;
  totalOccurrences: number;
  maxOccurrences?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Budget {
  _id: string;
  userId: string;
  category: string;
  amount: number;
  period: 'monthly' | 'weekly' | 'yearly';
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  _id: string;
  name: string;
  icon: string;
  color: string;
  type: 'income' | 'expense' | 'both';
  isDefault: boolean;
}

export interface PaymentMethod {
  _id: string;
  name: string;
  type: 'cash' | 'card' | 'bank' | 'digital';
  icon: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface TransactionFilters {
  startDate?: Date;
  endDate?: Date;
  category?: string;
  type?: 'income' | 'expense';
  paymentMethod?: string;
  minAmount?: number;
  maxAmount?: number;
}

export interface DashboardStats {
  totalIncome: number;
  totalExpenses: number;
  balance: number;
  transactionCount: number;
  topCategories: Array<{
    category: string;
    amount: number;
    percentage: number;
  }>;
  monthlyTrend: Array<{
    month: string;
    income: number;
    expenses: number;
  }>;
}