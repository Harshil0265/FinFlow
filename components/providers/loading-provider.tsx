'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { LoadingScreen } from '@/components/ui/loading';
import { AnimatePresence } from 'framer-motion';

interface LoadingContextType {
  isLoading: boolean;
  setLoading: (loading: boolean, message?: string) => void;
  message: string;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

export function useLoading() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}

interface LoadingProviderProps {
  children: ReactNode;
}

export function LoadingProvider({ children }: LoadingProviderProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading FinFlow...');
  const [initialLoading, setInitialLoading] = useState(true);

  // Initial app loading
  useEffect(() => {
    const timer = setTimeout(() => {
      setInitialLoading(false);
    }, 2000); // Show loading for 2 seconds on initial load

    return () => clearTimeout(timer);
  }, []);

  // Network-based loading detection
  useEffect(() => {
    const handleOnline = () => {
      if (!navigator.onLine) {
        setLoading(true, 'Connecting to FinFlow...');
      }
    };

    const handleOffline = () => {
      setLoading(true, 'Connection lost. Reconnecting...');
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const setLoading = (loading: boolean, loadingMessage?: string) => {
    setIsLoading(loading);
    if (loadingMessage) {
      setMessage(loadingMessage);
    }
  };

  return (
    <LoadingContext.Provider value={{ isLoading, setLoading, message }}>
      {children}
      <AnimatePresence>
        {(isLoading || initialLoading) && (
          <LoadingScreen 
            message={initialLoading ? 'Welcome to FinFlow' : message} 
            size="lg" 
          />
        )}
      </AnimatePresence>
    </LoadingContext.Provider>
  );
}