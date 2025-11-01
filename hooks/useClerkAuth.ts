'use client';

import { useUser, useAuth as useClerkAuthHook } from '@clerk/nextjs';
import { useEffect, useState } from 'react';
import { User } from '@/types';

export function useAuth() {
  const { user: clerkUser, isLoaded: userLoaded } = useUser();
  const { isSignedIn, isLoaded: authLoaded, signOut } = useClerkAuthHook();
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (authLoaded && userLoaded) {
      if (isSignedIn && clerkUser) {
        // Convert Clerk user to our User type
        const finflowUser: User = {
          _id: clerkUser.id,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.fullName || clerkUser.firstName || 'User',
          avatar: clerkUser.imageUrl,
          preferences: {
            currency: 'USD',
            dateFormat: 'MM/dd/yyyy',
            theme: 'system' as const,
          },
          createdAt: clerkUser.createdAt || new Date(),
          updatedAt: clerkUser.updatedAt || new Date(),
        };
        setUser(finflowUser);
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [clerkUser, isSignedIn, authLoaded, userLoaded]);

  const logout = async () => {
    try {
      await signOut();
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return {
    user,
    isLoading: isLoading || !authLoaded || !userLoaded,
    isAuthenticated: isSignedIn && !!user,
    logout,
    // Clerk-specific properties
    clerkUser,
    isSignedIn,
  };
}

// For backward compatibility, export the same interface
export { useAuth as default };