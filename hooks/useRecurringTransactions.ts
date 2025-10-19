'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface RecurringTransaction {
  _id: string;
  userId: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  paymentMethod: string;
  description?: string;
  recurringRule: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
    interval: number;
    dayOfWeek?: number;
    dayOfMonth?: number;
  };
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

interface RecurringTransactionState {
  recurringTransactions: RecurringTransaction[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetch: number;
  
  // Actions
  setRecurringTransactions: (transactions: RecurringTransaction[]) => void;
  addRecurringTransactionToState: (transaction: RecurringTransaction) => void;
  updateRecurringTransactionInState: (id: string, transaction: Partial<RecurringTransaction>) => void;
  removeRecurringTransactionFromState: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  clearAll: () => void;
}

export const useRecurringTransactionStore = create<RecurringTransactionState>()(
  persist(
    (set, get) => ({
      recurringTransactions: [],
      isLoading: false,
      error: null,
      isInitialized: false,
      lastFetch: 0,

      setRecurringTransactions: (recurringTransactions) => {
        set({ 
          recurringTransactions, 
          isInitialized: true, 
          lastFetch: Date.now(),
          error: null 
        });
      },

      addRecurringTransactionToState: (transaction) => {
        set(state => ({
          recurringTransactions: [transaction, ...state.recurringTransactions]
        }));
      },

      updateRecurringTransactionInState: (id, updatedData) => {
        set(state => ({
          recurringTransactions: state.recurringTransactions.map(t => 
            t._id === id ? { ...t, ...updatedData } : t
          )
        }));
      },

      removeRecurringTransactionFromState: (id) => {
        set(state => ({
          recurringTransactions: state.recurringTransactions.filter(t => t._id !== id)
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      clearAll: () => {
        set({
          recurringTransactions: [],
          isLoading: false,
          error: null,
          isInitialized: false,
          lastFetch: 0,
        });
      },
    }),
    {
      name: 'recurring-transaction-storage',
      partialize: (state) => ({
        recurringTransactions: state.recurringTransactions,
        isInitialized: state.isInitialized,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

// API functions
export const recurringTransactionAPI = {
  async fetchRecurringTransactions(accessToken: string, status?: 'active' | 'inactive' | 'all'): Promise<RecurringTransaction[]> {
    const params = new URLSearchParams();
    if (status) params.append('status', status);
    
    const response = await fetch(`/api/recurring-transactions?${params}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch recurring transactions');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return data.data.map((transaction: any) => ({
      ...transaction,
      startDate: new Date(transaction.startDate),
      endDate: transaction.endDate ? new Date(transaction.endDate) : undefined,
      nextDueDate: new Date(transaction.nextDueDate),
      lastProcessed: transaction.lastProcessed ? new Date(transaction.lastProcessed) : undefined,
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
    }));
  },

  async addRecurringTransaction(transactionData: any, accessToken: string): Promise<RecurringTransaction> {
    const response = await fetch('/api/recurring-transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add recurring transaction');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return {
      ...data.data,
      startDate: new Date(data.data.startDate),
      endDate: data.data.endDate ? new Date(data.data.endDate) : undefined,
      nextDueDate: new Date(data.data.nextDueDate),
      lastProcessed: data.data.lastProcessed ? new Date(data.data.lastProcessed) : undefined,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    };
  },

  async updateRecurringTransaction(id: string, transactionData: any, accessToken: string): Promise<RecurringTransaction> {
    const response = await fetch(`/api/recurring-transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update recurring transaction');
    }

    const data = await response.json();
    
    return {
      ...data.data,
      startDate: new Date(data.data.startDate),
      endDate: data.data.endDate ? new Date(data.data.endDate) : undefined,
      nextDueDate: new Date(data.data.nextDueDate),
      lastProcessed: data.data.lastProcessed ? new Date(data.data.lastProcessed) : undefined,
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedDate),
    };
  },

  async deleteRecurringTransaction(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`/api/recurring-transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete recurring transaction');
    }
  },

  async processRecurringTransactions(accessToken: string): Promise<any> {
    const response = await fetch('/api/recurring-transactions', {
      method: 'PATCH',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to process recurring transactions');
    }

    return response.json();
  },
};