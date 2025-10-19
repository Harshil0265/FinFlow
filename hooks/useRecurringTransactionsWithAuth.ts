'use client';

import { useCallback } from 'react';
import { useRecurringTransactionStore, recurringTransactionAPI } from './useRecurringTransactions';
import { useAuth } from './useAuth';

export function useRecurringTransactionsWithAuth() {
  const { accessToken } = useAuth();
  const store = useRecurringTransactionStore();

  const fetchRecurringTransactions = useCallback(async (status?: 'active' | 'inactive' | 'all') => {
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
      const recurringTransactions = await recurringTransactionAPI.fetchRecurringTransactions(accessToken, status);
      store.setRecurringTransactions(recurringTransactions);
    } catch (error: any) {
      console.error('Error fetching recurring transactions:', error);
      store.setError(error.message);
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const addRecurringTransaction = useCallback(async (transactionData: any) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const newRecurringTransaction = await recurringTransactionAPI.addRecurringTransaction(transactionData, accessToken);
      store.addRecurringTransactionToState(newRecurringTransaction);
      return newRecurringTransaction;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const updateRecurringTransaction = useCallback(async (id: string, transactionData: any) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const updatedRecurringTransaction = await recurringTransactionAPI.updateRecurringTransaction(id, transactionData, accessToken);
      store.updateRecurringTransactionInState(id, updatedRecurringTransaction);
      return updatedRecurringTransaction;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const deleteRecurringTransaction = useCallback(async (id: string) => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      await recurringTransactionAPI.deleteRecurringTransaction(id, accessToken);
      store.removeRecurringTransactionFromState(id);
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store]);

  const processRecurringTransactions = useCallback(async () => {
    if (!accessToken) {
      throw new Error('No authentication token available');
    }

    store.setLoading(true);
    store.setError(null);
    
    try {
      const result = await recurringTransactionAPI.processRecurringTransactions(accessToken);
      // Refresh the list after processing
      await fetchRecurringTransactions();
      return result;
    } catch (error: any) {
      store.setError(error.message);
      throw error;
    } finally {
      store.setLoading(false);
    }
  }, [accessToken, store, fetchRecurringTransactions]);

  return {
    recurringTransactions: store.recurringTransactions,
    isLoading: store.isLoading,
    error: store.error,
    isInitialized: store.isInitialized,
    fetchRecurringTransactions,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
    processRecurringTransactions,
    clearRecurringTransactions: store.clearAll,
    hasAuth: !!accessToken,
  };
}