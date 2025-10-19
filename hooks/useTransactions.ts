'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Transaction } from '@/types';

interface TransactionState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
  isInitialized: boolean;
  lastFetch: number;
  
  // Actions
  setTransactions: (transactions: Transaction[]) => void;
  addTransactionToState: (transaction: Transaction) => void;
  updateTransactionInState: (id: string, transaction: Partial<Transaction>) => void;
  removeTransactionFromState: (id: string) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setInitialized: (initialized: boolean) => void;
  clearAll: () => void;
}

export const useTransactionStore = create<TransactionState>()(
  persist(
    (set, get) => ({
      transactions: [],
      isLoading: false,
      error: null,
      isInitialized: false,
      lastFetch: 0,

      setTransactions: (transactions) => {
        set({ 
          transactions, 
          isInitialized: true, 
          lastFetch: Date.now(),
          error: null 
        });
      },

      addTransactionToState: (transaction) => {
        set(state => ({
          transactions: [transaction, ...state.transactions]
        }));
      },

      updateTransactionInState: (id, updatedData) => {
        set(state => ({
          transactions: state.transactions.map(t => 
            t._id === id ? { ...t, ...updatedData } : t
          )
        }));
      },

      removeTransactionFromState: (id) => {
        set(state => ({
          transactions: state.transactions.filter(t => t._id !== id)
        }));
      },

      setLoading: (loading) => set({ isLoading: loading }),
      setError: (error) => set({ error }),
      setInitialized: (initialized) => set({ isInitialized: initialized }),
      
      clearAll: () => {
        set({
          transactions: [],
          isLoading: false,
          error: null,
          isInitialized: false,
          lastFetch: 0,
        });
      },
    }),
    {
      name: 'transaction-storage',
      partialize: (state) => ({
        transactions: state.transactions,
        isInitialized: state.isInitialized,
        lastFetch: state.lastFetch,
      }),
    }
  )
);

// API functions (not in store to prevent recreation)
export const transactionAPI = {
  async fetchTransactions(accessToken: string): Promise<Transaction[]> {
    const response = await fetch('/api/transactions', {
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch transactions');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return data.data.map((transaction: any) => ({
      ...transaction,
      date: new Date(transaction.date),
      createdAt: new Date(transaction.createdAt),
      updatedAt: new Date(transaction.updatedAt),
    }));
  },

  async addTransaction(transactionData: Omit<Transaction, '_id' | 'userId' | 'createdAt' | 'updatedAt'>, accessToken: string): Promise<Transaction> {
    const response = await fetch('/api/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to add transaction');
    }

    const data = await response.json();
    
    // Convert date strings to Date objects
    return {
      ...data.data,
      date: new Date(data.data.date),
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    };
  },

  async updateTransaction(id: string, transactionData: Partial<Transaction>, accessToken: string): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(transactionData),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update transaction');
    }

    const data = await response.json();
    
    return {
      ...data.data,
      date: new Date(data.data.date),
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    };
  },

  async deleteTransaction(id: string, accessToken: string): Promise<void> {
    const response = await fetch(`/api/transactions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to delete transaction');
    }
  },

  async updateTransactionNotes(id: string, notes: string, accessToken: string): Promise<Transaction> {
    const response = await fetch(`/api/transactions/${id}/notes`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify({ notes }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to update notes');
    }

    const data = await response.json();
    
    return {
      ...data.data,
      date: new Date(data.data.date),
      createdAt: new Date(data.data.createdAt),
      updatedAt: new Date(data.data.updatedAt),
    };
  },
};

// Hook for transaction statistics
export const useTransactionStats = () => {
  const { transactions } = useTransactionStore();
  
  const currentMonth = new Date();
  const monthlyTransactions = transactions.filter(t => {
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

  const recentTransactions = transactions
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
};