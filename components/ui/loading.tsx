'use client';

import { motion } from 'framer-motion';
import { Logo } from './logo';

interface LoadingProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  message?: string;
  fullScreen?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-24 h-24',
};

const messageSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

// Animated Loading Spinner with FinFlow Design
export function LoadingSpinner({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {/* Outer rotating ring */}
      <motion.div
        className="absolute inset-0 rounded-full border-2 border-transparent bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700"
        style={{
          background: 'conic-gradient(from 0deg, #3b82f6, #8b5cf6, #4f46e5, #3b82f6)',
          mask: 'radial-gradient(circle at center, transparent 60%, black 61%)',
          WebkitMask: 'radial-gradient(circle at center, transparent 60%, black 61%)',
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      
      {/* Inner flowing dots */}
      <div className="absolute inset-0 flex items-center justify-center">
        <svg
          viewBox="0 0 40 40"
          className="w-3/4 h-3/4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Flow Lines */}
          <motion.path
            d="M8 15 Q20 10 32 15"
            stroke="url(#flowGradient1)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 1 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut"
            }}
          />
          <motion.path
            d="M8 20 Q20 15 32 20"
            stroke="url(#flowGradient2)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.8 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.2
            }}
          />
          <motion.path
            d="M8 25 Q20 30 32 25"
            stroke="url(#flowGradient3)"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ pathLength: 1, opacity: 0.6 }}
            transition={{ 
              duration: 1.5, 
              repeat: Infinity,
              repeatType: "reverse",
              ease: "easeInOut",
              delay: 0.4
            }}
          />
          
          {/* Animated Dots */}
          <motion.circle
            cx="12"
            cy="15"
            r="1.5"
            fill="#3b82f6"
            animate={{ 
              scale: [0, 1, 0],
              x: [0, 20, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
          <motion.circle
            cx="28"
            cy="20"
            r="1.5"
            fill="#8b5cf6"
            animate={{ 
              scale: [0, 1, 0],
              x: [0, -20, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 0.5
            }}
          />
          <motion.circle
            cx="16"
            cy="25"
            r="1.5"
            fill="#4f46e5"
            animate={{ 
              scale: [0, 1, 0],
              x: [0, 15, 0]
            }}
            transition={{ 
              duration: 2, 
              repeat: Infinity,
              ease: "easeInOut",
              delay: 1
            }}
          />
          
          {/* Gradients */}
          <defs>
            <linearGradient id="flowGradient1" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <linearGradient id="flowGradient2" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#4f46e5" />
            </linearGradient>
            <linearGradient id="flowGradient3" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#4f46e5" />
              <stop offset="100%" stopColor="#3b82f6" />
            </linearGradient>
          </defs>
        </svg>
      </div>
    </div>
  );
}

// Full Loading Screen Component
export function LoadingScreen({ message = "Loading FinFlow...", size = 'lg' }: LoadingProps) {
  return (
    <motion.div
      className="fixed inset-0 bg-white dark:bg-gray-900 flex flex-col items-center justify-center z-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-50 dark:from-blue-900/10 dark:via-purple-900/10 dark:to-indigo-900/10" />
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      {/* Main Content */}
      <div className="relative flex flex-col items-center space-y-8">
        {/* Animated Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={size} showText={true} />
        </motion.div>

        {/* Loading Spinner */}
        <LoadingSpinner size={size} />

        {/* Loading Message */}
        <motion.div
          className="text-center space-y-2"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <p className={`${messageSizeClasses[size]} font-medium text-gray-700 dark:text-gray-300`}>
            {message}
          </p>
          <motion.div
            className="flex space-x-1 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-blue-500 rounded-full"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.5, 1, 0.5],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>

        {/* Progress Indicator */}
        <motion.div
          className="w-64 h-1 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden"
          initial={{ opacity: 0, width: 0 }}
          animate={{ opacity: 1, width: 256 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <motion.div
            className="h-full bg-gradient-to-r from-blue-500 via-purple-600 to-indigo-700 rounded-full"
            animate={{
              x: [-256, 256],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      </div>
    </motion.div>
  );
}

// Inline Loading Component
export function InlineLoading({ message = "Loading...", size = 'md', className = '' }: LoadingProps) {
  return (
    <div className={`flex flex-col items-center justify-center space-y-4 p-8 ${className}`}>
      <LoadingSpinner size={size} />
      <motion.p
        className={`${messageSizeClasses[size]} text-gray-600 dark:text-gray-400 text-center`}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        {message}
      </motion.p>
    </div>
  );
}

// Page Loading Component
export function PageLoading({ message = "Loading page...", size = 'lg' }: LoadingProps) {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Logo size={size} showText={true} />
        </motion.div>
        
        <LoadingSpinner size={size} />
        
        <motion.p
          className={`${messageSizeClasses[size]} text-gray-700 dark:text-gray-300`}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          {message}
        </motion.p>
      </div>
    </div>
  );
}

// Button Loading State
export function ButtonLoading({ size = 'sm' }: { size?: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <div className="flex items-center space-x-2">
      <LoadingSpinner size={size} />
      <span>Loading...</span>
    </div>
  );
}