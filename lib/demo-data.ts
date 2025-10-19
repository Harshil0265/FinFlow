import { Transaction, RecurringTransaction, User } from '@/types';

// Demo user data
export const DEMO_USER: User = {
  _id: 'demo-user-123',
  email: 'demo@finflow.com',
  name: 'Alex Johnson',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  preferences: {
    currency: 'USD',
    dateFormat: 'MM/dd/yyyy',
    theme: 'light' as const,
  },
  createdAt: new Date('2024-01-15'),
  updatedAt: new Date('2024-12-15'),
};

// Demo transactions data
export const DEMO_TRANSACTIONS: Transaction[] = [
  // Recent transactions (last 30 days)
  {
    _id: 'demo-tx-1',
    userId: 'demo-user-123',
    title: 'Salary Payment',
    amount: 5500,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-12-01'),
    description: 'Monthly salary from TechCorp Inc.',
    notes: 'December salary - includes year-end bonus. Remember to update tax withholdings for next year.',
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    _id: 'demo-tx-2',
    userId: 'demo-user-123',
    title: 'Grocery Shopping',
    amount: 127.45,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    date: new Date('2024-12-14'),
    description: 'Weekly groceries at Whole Foods',
    notes: 'Bought organic vegetables and holiday ingredients. Need to track spending more carefully this month.',
    createdAt: new Date('2024-12-14'),
    updatedAt: new Date('2024-12-14'),
  },
  {
    _id: 'demo-tx-3',
    userId: 'demo-user-123',
    title: 'Coffee Shop',
    amount: 4.75,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Debit Card',
    date: new Date('2024-12-15'),
    description: 'Morning coffee at Starbucks',
    createdAt: new Date('2024-12-15'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-tx-4',
    userId: 'demo-user-123',
    title: 'Gas Station',
    amount: 52.30,
    type: 'expense',
    category: 'Transportation',
    paymentMethod: 'Credit Card',
    date: new Date('2024-12-13'),
    description: 'Fuel for car',
    createdAt: new Date('2024-12-13'),
    updatedAt: new Date('2024-12-13'),
  },
  {
    _id: 'demo-tx-5',
    userId: 'demo-user-123',
    title: 'Netflix Subscription',
    amount: 15.99,
    type: 'expense',
    category: 'Entertainment',
    paymentMethod: 'Credit Card',
    date: new Date('2024-12-12'),
    description: 'Monthly Netflix subscription',
    createdAt: new Date('2024-12-12'),
    updatedAt: new Date('2024-12-12'),
  },
  {
    _id: 'demo-tx-6',
    userId: 'demo-user-123',
    title: 'Freelance Project',
    amount: 850,
    type: 'income',
    category: 'Freelance',
    paymentMethod: 'PayPal',
    date: new Date('2024-12-10'),
    description: 'Web design project for local business',
    notes: 'Completed website redesign for Smith & Co. Client was very satisfied. Potential for ongoing work.',
    createdAt: new Date('2024-12-10'),
    updatedAt: new Date('2024-12-10'),
  },
  {
    _id: 'demo-tx-7',
    userId: 'demo-user-123',
    title: 'Electric Bill',
    amount: 89.50,
    type: 'expense',
    category: 'Bills & Utilities',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-12-08'),
    description: 'Monthly electricity bill',
    createdAt: new Date('2024-12-08'),
    updatedAt: new Date('2024-12-08'),
  },
  {
    _id: 'demo-tx-8',
    userId: 'demo-user-123',
    title: 'Online Shopping',
    amount: 234.99,
    type: 'expense',
    category: 'Shopping',
    paymentMethod: 'Credit Card',
    date: new Date('2024-12-07'),
    description: 'Winter clothes from Amazon',
    createdAt: new Date('2024-12-07'),
    updatedAt: new Date('2024-12-07'),
  },
  {
    _id: 'demo-tx-9',
    userId: 'demo-user-123',
    title: 'Gym Membership',
    amount: 45.00,
    type: 'expense',
    category: 'Healthcare',
    paymentMethod: 'Debit Card',
    date: new Date('2024-12-05'),
    description: 'Monthly gym membership',
    createdAt: new Date('2024-12-05'),
    updatedAt: new Date('2024-12-05'),
  },
  {
    _id: 'demo-tx-10',
    userId: 'demo-user-123',
    title: 'Restaurant Dinner',
    amount: 78.25,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    date: new Date('2024-12-04'),
    description: 'Dinner at Italian restaurant',
    createdAt: new Date('2024-12-04'),
    updatedAt: new Date('2024-12-04'),
  },
  // Previous months for trends
  {
    _id: 'demo-tx-11',
    userId: 'demo-user-123',
    title: 'Salary Payment',
    amount: 5500,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-11-01'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    _id: 'demo-tx-12',
    userId: 'demo-user-123',
    title: 'Rent Payment',
    amount: 1200,
    type: 'expense',
    category: 'Bills & Utilities',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-11-01'),
    createdAt: new Date('2024-11-01'),
    updatedAt: new Date('2024-11-01'),
  },
  {
    _id: 'demo-tx-13',
    userId: 'demo-user-123',
    title: 'Investment Dividend',
    amount: 125.50,
    type: 'income',
    category: 'Investment',
    paymentMethod: 'Bank Transfer',
    date: new Date('2024-11-15'),
    createdAt: new Date('2024-11-15'),
    updatedAt: new Date('2024-11-15'),
  },
  {
    _id: 'demo-tx-14',
    userId: 'demo-user-123',
    title: 'Car Insurance',
    amount: 156.75,
    type: 'expense',
    category: 'Transportation',
    paymentMethod: 'Credit Card',
    date: new Date('2024-11-20'),
    createdAt: new Date('2024-11-20'),
    updatedAt: new Date('2024-11-20'),
  },
  {
    _id: 'demo-tx-15',
    userId: 'demo-user-123',
    title: 'Book Purchase',
    amount: 29.99,
    type: 'expense',
    category: 'Education',
    paymentMethod: 'Credit Card',
    date: new Date('2024-10-25'),
    createdAt: new Date('2024-10-25'),
    updatedAt: new Date('2024-10-25'),
  },
];

// Demo recurring transactions
export const DEMO_RECURRING_TRANSACTIONS: RecurringTransaction[] = [
  {
    _id: 'demo-recurring-1',
    userId: 'demo-user-123',
    title: 'Monthly Salary',
    amount: 5500,
    type: 'income',
    category: 'Salary',
    paymentMethod: 'Bank Transfer',
    description: 'Regular monthly salary payment',
    recurringRule: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
    },
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2025-01-01'),
    isActive: true,
    totalOccurrences: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    _id: 'demo-recurring-2',
    userId: 'demo-user-123',
    title: 'Weekly Groceries',
    amount: 120,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Credit Card',
    description: 'Weekly grocery shopping',
    recurringRule: {
      frequency: 'weekly',
      interval: 1,
      dayOfWeek: 0, // Sunday
    },
    startDate: new Date('2024-01-07'),
    nextDueDate: new Date('2024-12-22'),
    isActive: true,
    totalOccurrences: 50,
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-recurring-3',
    userId: 'demo-user-123',
    title: 'Rent Payment',
    amount: 1200,
    type: 'expense',
    category: 'Bills & Utilities',
    paymentMethod: 'Bank Transfer',
    description: 'Monthly apartment rent',
    recurringRule: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 1,
    },
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2025-01-01'),
    isActive: true,
    totalOccurrences: 12,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-01'),
  },
  {
    _id: 'demo-recurring-4',
    userId: 'demo-user-123',
    title: 'Coffee Subscription',
    amount: 4.50,
    type: 'expense',
    category: 'Food & Dining',
    paymentMethod: 'Debit Card',
    description: 'Daily coffee from local cafe',
    recurringRule: {
      frequency: 'daily',
      interval: 1,
    },
    startDate: new Date('2024-01-01'),
    nextDueDate: new Date('2024-12-16'),
    isActive: true,
    totalOccurrences: 350,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-recurring-5',
    userId: 'demo-user-123',
    title: 'Gym Membership',
    amount: 45,
    type: 'expense',
    category: 'Healthcare',
    paymentMethod: 'Credit Card',
    description: 'Monthly gym membership fee',
    recurringRule: {
      frequency: 'monthly',
      interval: 1,
      dayOfMonth: 5,
    },
    startDate: new Date('2024-01-05'),
    nextDueDate: new Date('2025-01-05'),
    isActive: true,
    totalOccurrences: 12,
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-12-05'),
  },
];

// Demo budgets
export const DEMO_BUDGETS = [
  {
    _id: 'demo-budget-1',
    userId: 'demo-user-123',
    category: 'Food & Dining',
    amount: 500,
    period: 'monthly' as const,
    spent: 320.45,
    remaining: 179.55,
    percentage: 64.1,
    status: 'warning' as const,
    startDate: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-budget-2',
    userId: 'demo-user-123',
    category: 'Transportation',
    amount: 300,
    period: 'monthly' as const,
    spent: 208.30,
    remaining: 91.70,
    percentage: 69.4,
    status: 'warning' as const,
    startDate: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-budget-3',
    userId: 'demo-user-123',
    category: 'Entertainment',
    amount: 200,
    period: 'monthly' as const,
    spent: 89.99,
    remaining: 110.01,
    percentage: 45.0,
    status: 'good' as const,
    startDate: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
  {
    _id: 'demo-budget-4',
    userId: 'demo-user-123',
    category: 'Shopping',
    amount: 400,
    period: 'monthly' as const,
    spent: 234.99,
    remaining: 165.01,
    percentage: 58.7,
    status: 'good' as const,
    startDate: new Date('2024-12-01'),
    createdAt: new Date('2024-12-01'),
    updatedAt: new Date('2024-12-15'),
  },
];

// Helper functions for demo mode
export function getDemoTransactionStats() {
  const currentMonth = new Date();
  const monthlyTransactions = DEMO_TRANSACTIONS.filter(t => {
    const transactionDate = new Date(t.date);
    return transactionDate.getMonth() === currentMonth.getMonth() &&
           transactionDate.getFullYear() === currentMonth.getFullYear();
  });

  const totalIncome = monthlyTransactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  const recentTransactions = DEMO_TRANSACTIONS
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  const topCategories = monthlyTransactions
    .filter(t => t.type === 'expense')
    .reduce((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount;
      return acc;
    }, {} as Record<string, number>);

  const topCategoriesArray = Object.entries(topCategories)
    .map(([category, amount]) => ({ 
      category, 
      amount,
      percentage: totalExpenses > 0 ? (amount / totalExpenses) * 100 : 0
    }))
    .sort((a, b) => b.amount - a.amount)
    .slice(0, 5);

  return {
    totalIncome,
    totalExpenses,
    balance,
    transactionCount: monthlyTransactions.length,
    recentTransactions,
    topCategories: topCategoriesArray,
    monthlyTransactions,
  };
}

export function getDemoRecurringStats() {
  const activeTransactions = DEMO_RECURRING_TRANSACTIONS.filter(t => t.isActive);
  
  return {
    total: DEMO_RECURRING_TRANSACTIONS.length,
    active: activeTransactions.length,
    inactive: DEMO_RECURRING_TRANSACTIONS.length - activeTransactions.length,
    monthlyIncome: activeTransactions
      .filter(t => t.type === 'income' && t.recurringRule.frequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0),
    monthlyExpenses: activeTransactions
      .filter(t => t.type === 'expense' && t.recurringRule.frequency === 'monthly')
      .reduce((sum, t) => sum + t.amount, 0),
    dueToday: activeTransactions.filter(t => {
      const today = new Date();
      const dueDate = new Date(t.nextDueDate);
      return dueDate.toDateString() === today.toDateString();
    }).length,
  };
}