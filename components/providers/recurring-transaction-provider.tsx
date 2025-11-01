'use client';

import { ReactNode } from 'react';

interface RecurringTransactionProviderProps {
  children: ReactNode;
}

export function RecurringTransactionProvider({ children }: RecurringTransactionProviderProps) {
  // Simplified provider to avoid hook conflicts during Clerk initialization
  return <>{children}</>;
}