'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TestBasicPage() {
  const [message, setMessage] = useState('FinFlow is working!');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">FinFlow</h1>
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">💰</span>
          </div>
          <p className="text-lg text-green-600 mb-6">{message}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => setMessage('React is working! ✅')}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Test React
            </button>
            
            <Link 
              href="/simple-test"
              className="block w-full bg-green-600 text-white text-center py-2 px-4 rounded-lg hover:bg-green-700 transition-colors"
            >
              Test Clerk Integration
            </Link>
            
            <Link 
              href="/demo"
              className="block w-full bg-purple-600 text-white text-center py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors"
            >
              Try Demo Mode
            </Link>
            
            <Link 
              href="/"
              className="block w-full bg-gray-600 text-white text-center py-2 px-4 rounded-lg hover:bg-gray-700 transition-colors"
            >
              Go to Home
            </Link>
          </div>
          
          <div className="mt-6 pt-4 border-t text-sm text-gray-500">
            <p>Basic functionality test page</p>
            <p>No authentication required</p>
          </div>
        </div>
      </div>
    </div>
  );
}