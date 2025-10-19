import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { format, startOfMonth, endOfMonth, startOfWeek, endOfWeek } from 'date-fns';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = 'USD'): string {
  // Define locale mapping for different currencies
  const localeMap: Record<string, string> = {
    'USD': 'en-US',
    'EUR': 'en-GB',
    'GBP': 'en-GB',
    'JPY': 'ja-JP',
    'CAD': 'en-CA',
    'AUD': 'en-AU',
    'INR': 'en-IN', // Indian Rupees with Indian locale
  };

  const locale = localeMap[currency] || 'en-US';

  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: currency === 'JPY' ? 0 : 2,
    maximumFractionDigits: currency === 'JPY' ? 0 : 2,
  }).format(amount);
}

// Helper function to get currency symbol
export function getCurrencySymbol(currency: string): string {
  const symbols: Record<string, string> = {
    'USD': '$',
    'EUR': '€',
    'GBP': '£',
    'JPY': '¥',
    'CAD': 'C$',
    'AUD': 'A$',
    'INR': '₹', // Indian Rupee symbol
  };
  
  return symbols[currency] || currency;
}

// Helper function to get currency info
export function getCurrencyInfo(currency: string) {
  const currencyInfo: Record<string, { name: string; symbol: string; locale: string }> = {
    'USD': { name: 'US Dollar', symbol: '$', locale: 'en-US' },
    'EUR': { name: 'Euro', symbol: '€', locale: 'en-GB' },
    'GBP': { name: 'British Pound', symbol: '£', locale: 'en-GB' },
    'JPY': { name: 'Japanese Yen', symbol: '¥', locale: 'ja-JP' },
    'CAD': { name: 'Canadian Dollar', symbol: 'C$', locale: 'en-CA' },
    'AUD': { name: 'Australian Dollar', symbol: 'A$', locale: 'en-AU' },
    'INR': { name: 'Indian Rupee', symbol: '₹', locale: 'en-IN' },
  };
  
  return currencyInfo[currency] || { name: currency, symbol: currency, locale: 'en-US' };
}

export function formatDate(date: Date, dateFormat = 'MM/dd/yyyy'): string {
  return format(date, dateFormat);
}

export function getDateRange(period: 'week' | 'month' | 'year', date = new Date()) {
  switch (period) {
    case 'week':
      return {
        start: startOfWeek(date),
        end: endOfWeek(date),
      };
    case 'month':
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
      };
    case 'year':
      return {
        start: new Date(date.getFullYear(), 0, 1),
        end: new Date(date.getFullYear(), 11, 31),
      };
    default:
      return { start: date, end: date };
  }
}

export function generateId(): string {
  // Use crypto.randomUUID if available (modern browsers), fallback to timestamp-based ID
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for older browsers or SSR
  return `id_${Date.now()}_${Math.floor(Math.random() * 1000000)}`;
}

// Date validation utilities
export function getTodayDateString(): string {
  const today = new Date();
  return today.toISOString().split('T')[0];
}

export function isDateInFuture(dateString: string): boolean {
  const inputDate = new Date(dateString);
  const today = new Date();
  today.setHours(23, 59, 59, 999); // End of today
  return inputDate > today;
}

export function getMaxAllowedDate(): string {
  return getTodayDateString();
}

export function validateTransactionDate(dateString: string): { isValid: boolean; error?: string } {
  if (!dateString) {
    return { isValid: false, error: 'Date is required' };
  }

  const inputDate = new Date(dateString);
  
  if (isNaN(inputDate.getTime())) {
    return { isValid: false, error: 'Invalid date format' };
  }

  if (isDateInFuture(dateString)) {
    return { isValid: false, error: 'Cannot enter transactions for future dates' };
  }

  return { isValid: true };
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export const defaultCategories = [
  { name: 'Food & Dining', icon: '🍽️', color: '#FF6B6B', type: 'expense' },
  { name: 'Transportation', icon: '🚗', color: '#4ECDC4', type: 'expense' },
  { name: 'Shopping', icon: '🛍️', color: '#45B7D1', type: 'expense' },
  { name: 'Entertainment', icon: '🎬', color: '#96CEB4', type: 'expense' },
  { name: 'Bills & Utilities', icon: '💡', color: '#FFEAA7', type: 'expense' },
  { name: 'Healthcare', icon: '🏥', color: '#DDA0DD', type: 'expense' },
  { name: 'Education', icon: '📚', color: '#98D8C8', type: 'expense' },
  { name: 'Travel', icon: '✈️', color: '#F7DC6F', type: 'expense' },
  { name: 'Salary', icon: '💰', color: '#58D68D', type: 'income' },
  { name: 'Freelance', icon: '💻', color: '#85C1E9', type: 'income' },
  { name: 'Investment', icon: '📈', color: '#F8C471', type: 'income' },
  { name: 'Other Income', icon: '💵', color: '#82E0AA', type: 'income' },
];

export const defaultPaymentMethods = [
  { name: 'Cash', type: 'cash', icon: '💵' },
  { name: 'Credit Card', type: 'card', icon: '💳' },
  { name: 'Debit Card', type: 'card', icon: '💳' },
  { name: 'Bank Transfer', type: 'bank', icon: '🏦' },
  { name: 'PayPal', type: 'digital', icon: '📱' },
  { name: 'Venmo', type: 'digital', icon: '📱' },
];