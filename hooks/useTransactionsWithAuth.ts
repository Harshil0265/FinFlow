'use client';

import { useCallback } from 'react';
import { useTransactionStore, transactionAPI, useTransactionStats } from './useTransactions';
import { useAuth } from './useAuth';

export function useTransactionsWithAuth() {
  const { accessToken } = useAuth();
  const store = useTransactionStore();

  const fetchTransactions = useCallback(async () => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }
    
    // Prevent multiple fetches within 30 seconds
    const now = Date.now();
    if (store.isLoading || (store.isInitialized && (now - store.lastFetch) < 30000)) {
      return;
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const transactions = await transactionAPI.fetchTransactions(accessToken);
      store.setTransactions(transactions);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      store.setError(error.message);
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const addTransaction = useCallback(async (transactionData: Parameters<typeof transactionAPI.addTransaction>[0]) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const newTransaction = await transactionAPI.addTransaction(transactionData, accessToken);
      store.addTransactionToState(newTransaction);
      return newTransaction;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const updateTransaction = useCallback(async (id: string, transactionData: Parameters<typeof transactionAPI.updateTransaction>[1]) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const updatedTransaction = await transactionAPI.updateTransaction(id, transactionData, accessToken);
      store.updateTransactionInState(id, updatedTransaction);
      return updatedTransaction;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const deleteTransaction = useCallback(async (id: string) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      await transactionAPI.deleteTransaction(id, accessToken);
      store.removeTransactionFromState(id);
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const updateTransactionNotes = useCallback(async (id: string, notes: string) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    try {
      const updatedTransaction = await transactionAPI.updateTransactionNotes(id, notes, accessToken);
      store.updateTransactionInState(id, { notes: updatedTransaction.notes });
      return updatedTransaction;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    }
  }, [accessToken, store]);

  return {
    transactions: store.transactions,
    isLoading: store.isLoading,
    error: store.error,
    isInitialized: store.isInitialized,
    fetchTransactions,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    updateTransactionNotes,
    clearTransactions: store.clearAll,
    hasAuth: !!accessToken,
  };
}

export { useTransactionStats };