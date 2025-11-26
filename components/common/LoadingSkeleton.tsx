import React, { useEffect } from 'react';
import { DimensionValue, View, ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { cn } from '@/lib/utils/cn';
import { Card } from '../ui/Card';

interface LoadingSkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: DimensionValue;
  height?: DimensionValue
  className?: string;
  count?: number;
}

export default function LoadingSkeleton({
  variant = 'text',
  width,
  height,
  className,
  count = 1,
}: LoadingSkeletonProps) {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0.5, { duration: 800, easing: Easing.inOut(Easing.ease) }),
        withTiming(1, { duration: 800, easing: Easing.inOut(Easing.ease) })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  const variants = {
    text: 'h-4 rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg',
  };

  const style: ViewStyle = {
    width: width,
    height: height,
  };

  const skeleton = (
    <Animated.View
      style={[animatedStyle, style]}
      className={cn(
        'bg-gray-200 dark:bg-gray-700',
        variants[variant],
        className
      )}
    />
  );

  if (count === 1) {
    return skeleton;
  }

  return (
    <View className="space-y-3">
      {[...Array(count)].map((_, i) => (
        <View key={i}>{skeleton}</View>
      ))}
    </View>
  );
}

// Composants pré-configurés pour usage courant

export function CardSkeleton() {
  return (
    <Card className="p-5">
      <View className="space-y-3">
        {/* Header avec avatar et texte */}
        <View className="flex-row items-center gap-3">
          <LoadingSkeleton variant="circular" width={40} height={40} />
          <View className="flex-1 space-y-2">
            <LoadingSkeleton width="60%" height={16} />
            <LoadingSkeleton width="40%" height={14} />
          </View>
        </View>

        {/* Contenu */}
        <LoadingSkeleton count={3} height={16} />
      </View>
    </Card>
  );
}

export function ListSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View className="space-y-4">
      {[...Array(count)].map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </View>
  );
}

// Skeleton spécifique pour VoyageCard
export function VoyageCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      {/* Header */}
      <View className="bg-gray-100 dark:bg-gray-800 px-4 py-3">
        <View className="flex-row items-center gap-2 mb-3">
          <LoadingSkeleton variant="rectangular" width={36} height={36} />
          <View className="flex-1">
            <LoadingSkeleton width="40%" height={12} className="mb-1" />
            <LoadingSkeleton width="60%" height={16} />
          </View>
        </View>

        {/* Itinéraire */}
        <View className="flex-row items-center gap-2">
          <LoadingSkeleton width="40%" height={20} className="flex-1" />
          <LoadingSkeleton variant="circular" width={32} height={32} />
          <LoadingSkeleton width="40%" height={20} className="flex-1" />
        </View>
      </View>

      {/* Body */}
      <View className="px-4 py-3.5 space-y-2.5">
        <View className="flex-row justify-between">
          <LoadingSkeleton width="35%" height={16} />
          <LoadingSkeleton width="25%" height={16} />
        </View>

        {/* Footer */}
        <View className="flex-row items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
          <LoadingSkeleton variant="circular" width={28} height={28} />
          <LoadingSkeleton width="50%" height={14} className="flex-1" />
          <LoadingSkeleton width="20%" height={14} />
        </View>
      </View>
    </Card>
  );
}

// Skeleton pour DemandeCard
export function DemandeCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <View className="bg-gray-100 dark:bg-gray-800 px-4 py-3">
        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-row items-center gap-2">
            <LoadingSkeleton variant="circular" width={40} height={40} />
            <View>
              <LoadingSkeleton width={100} height={14} className="mb-1" />
              <LoadingSkeleton width={60} height={12} />
            </View>
          </View>
          <LoadingSkeleton variant="rectangular" width={80} height={24} />
        </View>
      </View>

      <View className="px-4 py-4 space-y-3">
        <LoadingSkeleton width="80%" height={16} />
        <LoadingSkeleton count={2} height={14} />
        
        <View className="flex-row gap-2 mt-2">
          <LoadingSkeleton width="30%" height={28} />
          <LoadingSkeleton width="30%" height={28} />
        </View>
      </View>
    </Card>
  );
}