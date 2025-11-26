import React from 'react';
import { View, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';

interface StarRatingProps {
  rating: number;
  maxRating?: number;
  size?: 'sm' | 'md' | 'lg';
  interactive?: boolean;
  onChange?: (rating: number) => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function StarRating({
  rating,
  maxRating = 5,
  size = 'md',
  interactive = false,
  onChange,
}: StarRatingProps) {
  const sizes = {
    sm: 16,
    md: 20,
    lg: 24,
  };

  return (
    <View className="flex-row items-center gap-1">
      {[...Array(maxRating)].map((_, index) => {
        const starValue = index + 1;
        const isFilled = starValue <= rating;

        return (
          <StarButton
            key={index}
            value={starValue}
            isFilled={isFilled}
            size={sizes[size]}
            interactive={interactive}
            onPress={() => interactive && onChange?.(starValue)}
          />
        );
      })}
    </View>
  );
}

// Composant Star individuel avec animation
interface StarButtonProps {
  value: number;
  isFilled: boolean;
  size: number;
  interactive: boolean;
  onPress: () => void;
}

function StarButton({ value, isFilled, size, interactive, onPress }: StarButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (interactive) {
      scale.value = withSpring(1.2, { damping: 10 });
    }
  };

  const handlePressOut = () => {
    if (interactive) {
      scale.value = withSpring(1, { damping: 10 });
    }
  };

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={!interactive}
      style={animatedStyle}
      accessibilityRole="button"
      accessibilityLabel={`${value} étoile${value > 1 ? 's' : ''}`}
      accessibilityState={{ disabled: !interactive }}
    >
      <Star
        size={size}
        className={cn(
          isFilled 
            ? 'text-amber-500 dark:text-amber-400' 
            : 'text-gray-300 dark:text-gray-600'
        )}
        fill={isFilled ? 'currentColor' : 'none'}
      />
    </AnimatedPressable>
  );
}