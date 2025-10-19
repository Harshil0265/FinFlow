'use client';

import { User } from 'lucide-react';
import { User as UserType } from '@/types';
import { getAvatarById } from '@/lib/avatars';

interface UserAvatarProps {
  user: UserType | null;
  size?: 'sm' | 'md' | 'lg';
  showName?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'w-6 h-6 text-xs',
  md: 'w-8 h-8 text-sm',
  lg: 'w-10 h-10 text-base',
};

const textSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
};

export function UserAvatar({ user, size = 'md', showName = false, className = '' }: UserAvatarProps) {
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getAvatarColor = (name: string) => {
    const colors = [
      'bg-gradient-to-r from-blue-400 to-blue-600',
      'bg-gradient-to-r from-green-400 to-green-600',
      'bg-gradient-to-r from-purple-400 to-purple-600',
      'bg-gradient-to-r from-pink-400 to-pink-600',
      'bg-gradient-to-r from-indigo-400 to-indigo-600',
      'bg-gradient-to-r from-yellow-400 to-yellow-600',
      'bg-gradient-to-r from-red-400 to-red-600',
      'bg-gradient-to-r from-teal-400 to-teal-600',
    ];
    
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (!user) {
    return (
      <div className={`${sizeClasses[size]} bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center ${className}`}>
        <User className="w-1/2 h-1/2 text-gray-500 dark:text-gray-400" />
      </div>
    );
  }

  // Check if user has a digital avatar
  const digitalAvatar = user.avatar ? getAvatarById(user.avatar) : null;

  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      {digitalAvatar ? (
        // Render digital avatar SVG
        <div 
          className={`${sizeClasses[size]} rounded-full overflow-hidden`}
          dangerouslySetInnerHTML={{ __html: digitalAvatar.svg }}
        />
      ) : user.avatar && user.avatar.startsWith('http') ? (
        // Render uploaded image
        <img
          src={user.avatar}
          alt={user.name}
          className={`${sizeClasses[size]} rounded-full object-cover`}
        />
      ) : (
        // Render initials fallback
        <div className={`${sizeClasses[size]} ${getAvatarColor(user.name)} rounded-full flex items-center justify-center text-white font-semibold`}>
          {getInitials(user.name)}
        </div>
      )}
      
      {showName && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-medium text-gray-900 dark:text-white`}>
            {user.name}
          </span>
          <span className={`${size === 'sm' ? 'text-xs' : 'text-xs'} text-gray-500 dark:text-gray-400`}>
            {user.email}
          </span>
        </div>
      )}
    </div>
  );
}