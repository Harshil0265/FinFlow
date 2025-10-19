'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, LogIn, UserPlus, X, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DemoBannerProps {
  onClose?: () => void;
}

export function DemoBanner({ onClose }: DemoBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

  const handleClose = () => {
    setIsVisible(false);
    onClose?.();
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg"
        >
          <div className="container mx-auto px-4 py-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Sparkles className="w-5 h-5 text-yellow-300" />
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <p className="font-semibold">
                    🎉 You're viewing FinFlow in Demo Mode
                  </p>
                  <p className="text-sm text-blue-100">
                    Explore all features with sample data • No registration required
                  </p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <Link href="/login">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                  >
                    <LogIn className="w-4 h-4 mr-2" />
                    Login
                  </Button>
                </Link>
                <Link href="/register">
                  <Button 
                    variant="secondary" 
                    size="sm"
                    className="bg-white text-blue-600 hover:bg-white/90"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Sign Up Free
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleClose}
                  className="text-white hover:bg-white/20 h-8 w-8"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}