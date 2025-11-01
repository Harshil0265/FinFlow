'use client';

import { useUser } from '@clerk/nextjs';

export default function TestClerkPage() {
  const { user, isLoaded } = useUser();

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Clerk Test Page</h1>
      {user ? (
        <div>
          <p>✅ Clerk is working!</p>
          <p>User ID: {user.id}</p>
          <p>Email: {user.emailAddresses[0]?.emailAddress}</p>
          <p>Name: {user.fullName || user.firstName}</p>
        </div>
      ) : (
        <div>
          <p>❌ No user found</p>
          <p>Please sign in to test Clerk integration</p>
        </div>
      )}
    </div>
  );
}