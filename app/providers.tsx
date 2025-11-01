'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';

import { LoadingProvider } from '@/components/providers/loading-provider';
import { TransactionProvider } from '@/components/providers/transaction-provider';
import { RecurringTransactionProvider } from '@/components/providers/recurring-transaction-provider';
import { Toaster } from 'react-hot-toast';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000, // 1 minute
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <LoadingProvider>
        <TransactionProvider>
          <RecurringTransactionProvider>
            {children}
            <Toaster 
              position="top-right"
              toastOptions={{
                duration: 4000,
                style: {
                  background: 'hsl(var(--background))',
                  color: 'hsl(var(--foreground))',
                  border: '1px solid hsl(var(--border))',
                },
              }}
            />
          </RecurringTransactionProvider>
        </TransactionProvider>
      </LoadingProvider>
    </QueryClientProvider>
  );
}