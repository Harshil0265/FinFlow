'use client';

import { motion } from 'framer-motion';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-10 h-10',
  lg: 'w-12 h-12',
  xl: 'w-16 h-16',
};

const textSizeClasses = {
  sm: 'text-lg',
  md: 'text-xl',
  lg: 'text-2xl',
  xl: 'text-3xl',
};

export function Logo({ size = 'md', showText = true, className = '' }: LogoProps) {
  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      {/* Logo Icon */}
      <motion.div
        className={`${sizeClasses[size]} relative`}
        whileHover={{ scale: 1.05 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        {/* Outer Circle with Gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl shadow-lg">
          {/* Inner Design */}
          <div className="relative w-full h-full flex items-center justify-center">
            {/* Flow Lines */}
            <svg
              viewBox="0 0 40 40"
              className="w-full h-full p-2"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              {/* Background Circle */}
              <circle
                cx="20"
                cy="20"
                r="18"
                fill="rgba(255,255,255,0.1)"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="0.5"
              />
              
              {/* Flow Lines - Representing Financial Flow */}
              <motion.path
                d="M8 15 Q20 10 32 15"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 1.5, delay: 0.2 }}
              />
              <motion.path
                d="M8 20 Q20 15 32 20"
                stroke="rgba(255,255,255,0.8)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.5, delay: 0.4 }}
              />
              <motion.path
                d="M8 25 Q20 30 32 25"
                stroke="rgba(255,255,255,0.6)"
                strokeWidth="2"
                strokeLinecap="round"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.6 }}
                transition={{ duration: 1.5, delay: 0.6 }}
              />
              
              {/* Central Dollar Symbol */}
              <motion.text
                x="20"
                y="25"
                textAnchor="middle"
                className="fill-white font-bold text-xs"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                $
              </motion.text>
              
              {/* Flowing Dots */}
              <motion.circle
                cx="12"
                cy="15"
                r="1.5"
                fill="white"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              />
              <motion.circle
                cx="28"
                cy="20"
                r="1.5"
                fill="rgba(255,255,255,0.8)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              />
              <motion.circle
                cx="16"
                cy="25"
                r="1.5"
                fill="rgba(255,255,255,0.6)"
                initial={{ scale: 0 }}
                animate={{ scale: [0, 1, 0] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1.5 }}
              />
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Brand Text */}
      {showText && (
        <motion.div
          className="flex flex-col"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <h1 className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700 bg-clip-text text-transparent`}>
            FinFlow
          </h1>
          {size !== 'sm' && (
            <p className="text-xs text-muted-foreground -mt-1">
              Smart Finance
            </p>
          )}
        </motion.div>
      )}
    </div>
  );
}

// Simple version for favicons and small spaces
export function LogoIcon({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-600 to-indigo-700 rounded-xl flex items-center justify-center shadow-lg">
        <svg
          viewBox="0 0 24 24"
          className="w-3/4 h-3/4"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M4 9 Q12 6 20 9"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 12 Q12 9 20 12"
            stroke="rgba(255,255,255,0.8)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <path
            d="M4 15 Q12 18 20 15"
            stroke="rgba(255,255,255,0.6)"
            strokeWidth="1.5"
            strokeLinecap="round"
          />
          <text
            x="12"
            y="16"
            textAnchor="middle"
            className="fill-white font-bold text-xs"
          >
            $
          </text>
        </svg>
      </div>
    </div>
  );
}