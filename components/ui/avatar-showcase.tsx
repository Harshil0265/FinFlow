'use client';

import { motion } from 'framer-motion';
import { UserAvatar } from './user-avatar';
import { User as UserType } from '@/types';
import { getAvatarById } from '@/lib/avatars';

interface AvatarShowcaseProps {
  user: UserType | null;
  className?: string;
}

export function AvatarShowcase({ user, className = '' }: AvatarShowcaseProps) {
  if (!user) return null;

  const digitalAvatar = user.avatar ? getAvatarById(user.avatar) : null;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className={`relative ${className}`}
    >
      {/* Main Avatar */}
      <div className="relative">
        <UserAvatar user={user} size="lg" />
        
        {/* Animated Ring */}
        <motion.div
          className="absolute inset-0 rounded-full border-2 border-primary/30"
          animate={{
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        
        {/* Style Badge */}
        {digitalAvatar && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="absolute -bottom-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center text-xs font-bold text-primary-foreground"
          >
            {digitalAvatar.style.charAt(0).toUpperCase()}
          </motion.div>
        )}
      </div>
      
      {/* Avatar Info */}
      {digitalAvatar && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-2 text-center"
        >
          <p className="text-xs font-medium text-muted-foreground">
            {digitalAvatar.name}
          </p>
          <p className="text-xs text-muted-foreground capitalize">
            {digitalAvatar.style} • {digitalAvatar.gender}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
}