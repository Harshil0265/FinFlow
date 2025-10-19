'use client';

import { useEffect, ReactNode, useRef } from 'react';
import { useRecurringTransactionsWithAuth } from '@/hooks/useRecurringTransactionsWithAuth';
import { useAuth } from '@/hooks/useAuth';

interface RecurringTransactionProviderProps {
  children: ReactNode;
}

export function RecurringTransactionProvider({ children }: RecurringTransactionProviderProps) {
  const { user, accessToken } = useAuth();
  const { fetchRecurringTransactions, clearRecurringTransactions, isInitialized } = useRecurringTransactionsWithAuth();
  const hasFetched = useRef(false);

  useEffect(() => {
    if (user && accessToken && !isInitialized && !hasFetched.current) {
      hasFetched.current = true;
      fetchRecurringTransactions('active').catch(error => {
        console.error('Failed to fetch recurring transactions:', error);
        hasFetched.current = false; // Allow retry on error
      });
    } else if (!user || !accessToken) {
      clearRecurringTransactions();
      hasFetched.current = false;
    }
  }, [user?.email, accessToken]); // Minimal dependencies

  return <>{children}</>;
}