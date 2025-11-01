'use client';

import { useUser } from '@clerk/nextjs';
import Link from 'next/link';

export default function SimpleTestPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
        <h1 className="text-2xl font-bold text-center mb-6">FinFlow - Simple Test</h1>
        
        {user ? (
          <div className="space-y-4">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                {user.imageUrl ? (
                  <img 
                    src={user.imageUrl} 
                    alt="Profile" 
                    className="w-16 h-16 rounded-full"
                  />
                ) : (
                  <span className="text-2xl text-blue-600">
                    {user.firstName?.[0] || user.emailAddresses[0]?.emailAddress[0] || 'U'}
                  </span>
                )}
              </div>
              <h2 className="text-xl font-semibold">Welcome!</h2>
              <p className="text-gray-600">{user.emailAddresses[0]?.emailAddress}</p>
              <p className="text-sm text-gray-500">
                {user.fullName || user.firstName || 'User'}
              </p>
            </div>
            
            <div className="border-t pt-4">
              <p className="text-sm text-green-600 text-center mb-4">
                ✅ Clerk authentication is working!
              </p>
              <div className="space-y-2">
                <Link 
                  href="/dashboard" 
                  className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
                >
                  Go to Dashboard
                </Link>
                <Link 
                  href="/demo" 
                  className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors"
                >
                  Try Demo Mode
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center space-y-4">
            <p className="text-gray-600">You are not signed in</p>
            <div className="space-y-2">
              <Link 
                href="/sign-in" 
                className="block w-full bg-blue-600 text-white text-center py-2 px-4 rounded hover:bg-blue-700 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/sign-up" 
                className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded hover:bg-green-700 transition-colors"
              >
                Sign Up
              </Link>
              <Link 
                href="/demo" 
                className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded hover:bg-gray-700 transition-colors"
              >
                Try Demo Mode
              </Link>
            </div>
          </div>
        )}
        
        <div className="mt-6 pt-4 border-t text-center">
          <Link 
            href="/" 
            className="text-blue-600 hover:text-blue-700 text-sm"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}