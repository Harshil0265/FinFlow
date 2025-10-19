'use client';

import { useEffect, useState } from 'react';

interface HydrationProviderProps {
  children: React.ReactNode;
}

export function HydrationProvider({ children }: HydrationProviderProps) {
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    // This ensures the component only renders on the client after hydration
    setIsHydrated(true);
  }, []);

  // During SSR and before hydration, render a minimal version
  if (!isHydrated) {
    return (
      <div className="min-h-screen bg-background">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}