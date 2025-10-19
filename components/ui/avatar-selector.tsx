'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Filter, User, Palette, Briefcase, Coffee, Zap } from 'lucide-react';
import { Button } from './button';
import { Card, CardContent, CardHeader, CardTitle } from './card';
import { Modal } from './modal';
import { digitalAvatars, getAvatarsByGender, getAvatarsByStyle, type AvatarOption } from '@/lib/avatars';

interface AvatarSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (avatarId: string) => void;
  currentAvatarId?: string;
}

const styleIcons = {
  professional: Briefcase,
  casual: Coffee,
  creative: Palette,
  modern: Zap,
};

const styleColors = {
  professional: 'text-blue-600 bg-blue-100 dark:bg-blue-900/20',
  casual: 'text-green-600 bg-green-100 dark:bg-green-900/20',
  creative: 'text-purple-600 bg-purple-100 dark:bg-purple-900/20',
  modern: 'text-cyan-600 bg-cyan-100 dark:bg-cyan-900/20',
};

export function AvatarSelector({ isOpen, onClose, onSelect, currentAvatarId }: AvatarSelectorProps) {
  const [selectedGender, setSelectedGender] = useState<'all' | 'male' | 'female' | 'neutral'>('all');
  const [selectedStyle, setSelectedStyle] = useState<'all' | 'professional' | 'casual' | 'creative' | 'modern'>('all');
  const [hoveredAvatar, setHoveredAvatar] = useState<string | null>(null);

  const getFilteredAvatars = () => {
    let filtered = digitalAvatars;
    
    if (selectedGender !== 'all') {
      filtered = getAvatarsByGender(selectedGender);
    }
    
    if (selectedStyle !== 'all') {
      filtered = filtered.filter(avatar => avatar.style === selectedStyle);
    }
    
    return filtered;
  };

  const filteredAvatars = getFilteredAvatars();

  const handleAvatarSelect = (avatarId: string) => {
    onSelect(avatarId);
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Choose Your Avatar">
      <div className="space-y-6">
        {/* Filters */}
        <div className="space-y-4">
          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Gender
            </h4>
            <div className="flex flex-wrap gap-2">
              {['all', 'male', 'female', 'neutral'].map((gender) => (
                <Button
                  key={gender}
                  variant={selectedGender === gender ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setSelectedGender(gender as any)}
                  className="capitalize"
                >
                  {gender === 'all' ? 'All' : gender}
                </Button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-sm font-medium mb-2 flex items-center">
              <Palette className="w-4 h-4 mr-2" />
              Style
            </h4>
            <div className="flex flex-wrap gap-2">
              {['all', 'professional', 'casual', 'creative', 'modern'].map((style) => {
                const Icon = style !== 'all' ? styleIcons[style as keyof typeof styleIcons] : User;
                return (
                  <Button
                    key={style}
                    variant={selectedStyle === style ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setSelectedStyle(style as any)}
                    className="capitalize flex items-center"
                  >
                    <Icon className="w-3 h-3 mr-1" />
                    {style}
                  </Button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Avatar Grid */}
        <div className="max-h-96 overflow-y-auto">
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
            <AnimatePresence>
              {filteredAvatars.map((avatar, index) => {
                const isSelected = currentAvatarId === avatar.id;
                const isHovered = hoveredAvatar === avatar.id;
                const StyleIcon = styleIcons[avatar.style];
                
                return (
                  <motion.div
                    key={avatar.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="relative"
                  >
                    <Card
                      className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                        isSelected 
                          ? 'ring-2 ring-primary shadow-lg' 
                          : 'hover:ring-1 hover:ring-primary/50'
                      }`}
                      onClick={() => handleAvatarSelect(avatar.id)}
                      onMouseEnter={() => setHoveredAvatar(avatar.id)}
                      onMouseLeave={() => setHoveredAvatar(null)}
                    >
                      <CardContent className="p-2">
                        <div className="relative">
                          {/* Avatar SVG */}
                          <div 
                            className="w-full aspect-square rounded-lg overflow-hidden"
                            dangerouslySetInnerHTML={{ __html: avatar.svg }}
                          />
                          
                          {/* Selected Indicator */}
                          {isSelected && (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              className="absolute -top-1 -right-1 w-6 h-6 bg-primary rounded-full flex items-center justify-center"
                            >
                              <Check className="w-3 h-3 text-primary-foreground" />
                            </motion.div>
                          )}
                          
                          {/* Style Badge */}
                          <div className={`absolute bottom-1 right-1 w-6 h-6 rounded-full flex items-center justify-center ${styleColors[avatar.style]}`}>
                            <StyleIcon className="w-3 h-3" />
                          </div>
                        </div>
                        
                        {/* Avatar Name */}
                        <div className="mt-2 text-center">
                          <p className="text-xs font-medium truncate">{avatar.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {avatar.gender} • {avatar.style}
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Hover Tooltip */}
                    <AnimatePresence>
                      {isHovered && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute -top-12 left-1/2 transform -translate-x-1/2 z-10"
                        >
                          <div className="bg-popover text-popover-foreground px-2 py-1 rounded-md text-xs whitespace-nowrap shadow-lg border">
                            {avatar.name}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
          
          {filteredAvatars.length === 0 && (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-muted-foreground mx-auto mb-2" />
              <p className="text-muted-foreground">No avatars found with current filters</p>
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSelectedGender('all');
                  setSelectedStyle('all');
                }}
                className="mt-2"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-between items-center pt-4 border-t">
          <p className="text-sm text-muted-foreground">
            {filteredAvatars.length} avatar{filteredAvatars.length !== 1 ? 's' : ''} available
          </p>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}