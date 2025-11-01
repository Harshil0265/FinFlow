import { auth, currentUser } from '@clerk/nextjs/server';
import { NextRequest } from 'next/server';

/**
 * Get the current user from Clerk authentication
 * Use this in API routes to get authenticated user information
 */
export async function getAuthenticatedUser() {
  try {
    const { userId } = await auth();
    
    if (!userId) {
      return { user: null, error: 'Not authenticated' };
    }

    const clerkUser = await currentUser();
    
    if (!clerkUser) {
      return { user: null, error: 'User not found' };
    }

    // Convert Clerk user to our User format
    const user = {
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

    return { user, error: null };
  } catch (error) {
    console.error('Auth error:', error);
    return { user: null, error: 'Authentication failed' };
  }
}

/**
 * Verify authentication and return user ID
 * Simplified version for API routes that only need the user ID
 */
export async function getAuthenticatedUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error('Auth error:', error);
    return null;
  }
}

/**
 * Create authentication response for API routes
 */
export function createAuthResponse(status: number, message: string, data?: any) {
  return Response.json(
    {
      success: status < 400,
      message,
      data,
    },
    { status }
  );
}

/**
 * Middleware helper to check authentication
 */
export async function requireAuth() {
  const userId = await getAuthenticatedUserId();
  
  if (!userId) {
    throw new Error('Authentication required');
  }
  
  return userId;
}