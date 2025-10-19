'use client';

import { useEffect, ReactNode } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { LoadingScreen } from '@/components/ui/loading';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { initialize, isLoading, isInitialized } = useAuth();

  useEffect(() => {
    initialize();
  }, [initialize]);

  // Show loading screen while initializing auth
  if (!isInitialized || isLoading) {
    return <LoadingScreen message="Initializing FinFlow..." size="lg" />;
  }

  return <>{children}</>;
}