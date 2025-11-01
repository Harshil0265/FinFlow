'use client';

import { ReactNode } from 'react';

interface TransactionProviderProps {
  children: ReactNode;
}

export function TransactionProvider({ children }: TransactionProviderProps) {
  // Simplified provider to avoid hook conflicts during Clerk initialization
  return <>{children}</>;
}