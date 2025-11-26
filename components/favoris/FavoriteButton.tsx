import React, { useState } from 'react';
import { Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => Promise<void>;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function FavoriteButton({ 
  isFavorite, 
  onToggle, 
  size = 'md',
  className 
}: FavoriteButtonProps) {
  const [isLoading, setIsLoading] = useState(false);
  const scale = useSharedValue(1);

  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const iconSizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  const handlePress = async () => {
    if (isLoading) return;

    // Animation de scale sur le press
    scale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    // Animation supplémentaire si on ajoute aux favoris
    if (!isFavorite) {
      scale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
    }

    setIsLoading(true);
    try {
      await onToggle();
    } finally {
      setIsLoading(false);
    }
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Pressable
      onPress={handlePress}
      disabled={isLoading}
      className={cn(
        'rounded-full flex items-center justify-center',
        isFavorite 
          ? 'bg-primary/10 dark:bg-primary/20' 
          : 'bg-white/90 dark:bg-gray-800/90 border border-gray-200 dark:border-gray-700',
        sizes[size],
        isLoading && 'opacity-50',
        className
      )}
      accessibilityRole="button"
      accessibilityLabel={isFavorite ? 'Retirer des favoris' : 'Ajouter aux favoris'}
      accessibilityState={{ disabled: isLoading }}
    >
      <Animated.View style={animatedStyle}>
        {isLoading ? (
          <ActivityIndicator 
            size="small" 
            color={isFavorite ? '#00695c' : '#757575'} 
          />
        ) : (
          <Heart
            size={iconSizes[size]}
            className={cn(
              isFavorite 
                ? 'text-primary dark:text-primary-light' 
                : 'text-gray-600 dark:text-gray-400'
            )}
            fill={isFavorite ? 'currentColor' : 'none'}
          />
        )}
      </Animated.View>
    </Pressable>
  );
}