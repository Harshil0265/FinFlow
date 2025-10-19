'use client';

import { useEffect, ReactNode } from 'react';
import { useTransactionsWithAuth } from '@/hooks/useTransactionsWithAuth';
import { useAuth } from '@/hooks/useAuth';

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  const { user, accessToken } = useAuth();
  const { fetchTransactions, clearTransactions, isInitialized } = useTransactionsWithAuth();

  useEffect(() => {
    if (user && accessToken && !isInitialized) {
      // Only fetch if not already initialized
      fetchTransactions().catch(error => {
        console.error('Failed to fetch transactions:', error);
      });
    } else if (!user || !accessToken) {
      // User is logged out, clear transactions
      clearTransactions();
    }
  }, [user?.email, accessToken, isInitialized]); // Only depend on stable values

  return <>{children}</>;
}