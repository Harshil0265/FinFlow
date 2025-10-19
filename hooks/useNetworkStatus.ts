'use client';

import { useState, useEffect } from 'react';
import { useLoading } from '@/components/providers/loading-provider';

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true);
  const [connectionType, setConnectionType] = useState<string>('unknown');
  const { setLoading } = useLoading();

  useEffect(() => {
    // Initial status
    setIsOnline(navigator.onLine);

    // Get connection info if available
    const connection = (navigator as any).connection || (navigator as any).mozConnection || (navigator as any).webkitConnection;
    if (connection) {
      setConnectionType(connection.effectiveType || 'unknown');
    }

    const handleOnline = () => {
      setIsOnline(true);
      setLoading(false);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setLoading(true, 'Connection lost. Trying to reconnect...');
    };

    const handleConnectionChange = () => {
      if (connection) {
        setConnectionType(connection.effectiveType || 'unknown');
        
        // Show loading for slow connections
        if (connection.effectiveType === 'slow-2g' || connection.effectiveType === '2g') {
          setLoading(true, 'Slow connection detected. Loading...');
          
          // Auto-hide after a delay
          setTimeout(() => {
            setLoading(false);
          }, 3000);
        }
      }
    };

    // Event listeners
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    if (connection) {
      connection.addEventListener('change', handleConnectionChange);
    }

    // Cleanup
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      
      if (connection) {
        connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, [setLoading]);

  return {
    isOnline,
    connectionType,
    isSlowConnection: connectionType === 'slow-2g' || connectionType === '2g',
  };
}