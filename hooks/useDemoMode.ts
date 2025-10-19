'use client';

import { useState, useCallback } from 'react';
import { 
  DEMO_USER, 
  DEMO_TRANSACTIONS, 
  DEMO_RECURRING_TRANSACTIONS, 
  DEMO_BUDGETS,
  getDemoTransactionStats,
  getDemoRecurringStats
} from '@/lib/demo-data';
import { Transaction, RecurringTransaction, User } from '@/types';

export function useDemoMode() {
  const [isDemoMode, setIsDemoMode] = useState(false);

  const enableDemoMode = useCallback(() => {
    setIsDemoMode(true);
  }, []);

  const disableDemoMode = useCallback(() => {
    setIsDemoMode(false);
  }, []);

  // Demo user data
  const getDemoUser = useCallback((): User => {
    return DEMO_USER;
  }, []);

  // Demo transactions
  const getDemoTransactions = useCallback((): Transaction[] => {
    return DEMO_TRANSACTIONS;
  }, []);

  // Demo recurring transactions
  const getDemoRecurringTransactions = useCallback((): RecurringTransaction[] => {
    return DEMO_RECURRING_TRANSACTIONS;
  }, []);

  // Demo budgets
  const getDemoBudgets = useCallback(() => {
    return DEMO_BUDGETS;
  }, []);

  // Demo transaction statistics
  const getDemoStats = useCallback(() => {
    return getDemoTransactionStats();
  }, []);

  // Demo recurring transaction statistics
  const getDemoRecurringStats = useCallback(() => {
    return getDemoRecurringStats();
  }, []);

  // Mock API functions for demo mode
  const demoAPI = {
    // Simulate adding a transaction
    addTransaction: async (transactionData: any): Promise<Transaction> => {
      const newTransaction: Transaction = {
        _id: `demo-tx-${Date.now()}`,
        userId: DEMO_USER._id,
        ...transactionData,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newTransaction;
    },

    // Simulate updating a transaction
    updateTransaction: async (id: string, transactionData: any): Promise<Transaction> => {
      const existingTransaction = DEMO_TRANSACTIONS.find(t => t._id === id);
      if (!existingTransaction) {
        throw new Error('Transaction not found');
      }
      return {
        ...existingTransaction,
        ...transactionData,
        updatedAt: new Date(),
      };
    },

    // Simulate deleting a transaction
    deleteTransaction: async (id: string): Promise<void> => {
      // In demo mode, just simulate success
      return Promise.resolve();
    },

    // Simulate adding recurring transaction
    addRecurringTransaction: async (data: any): Promise<RecurringTransaction> => {
      const newRecurring: RecurringTransaction = {
        _id: `demo-recurring-${Date.now()}`,
        userId: DEMO_USER._id,
        ...data,
        totalOccurrences: 0,
        isActive: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return newRecurring;
    },

    // Simulate processing recurring transactions
    processRecurringTransactions: async () => {
      return {
        data: {
          processedTransactions: [],
          updatedRecurringTransactions: [],
        },
        message: 'Demo mode: No actual processing performed',
      };
    },
  };

  return {
    isDemoMode,
    enableDemoMode,
    disableDemoMode,
    getDemoUser,
    getDemoTransactions,
    getDemoRecurringTransactions,
    getDemoBudgets,
    getDemoStats,
    getDemoRecurringStats,
    demoAPI,
  };
}