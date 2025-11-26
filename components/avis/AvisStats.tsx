import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { Star } from 'lucide-react-native';
import type { AvisStats as AvisStatsType } from '@/types';

interface AvisStatsProps {
  stats: AvisStatsType;
}

export default function AvisStats({ stats }: AvisStatsProps) {
  const ratings = [5, 4, 3, 2, 1];

  return (
    <View className="gap-4">
      {/* Average */}
      <View className="items-center pb-4 border-b border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center gap-2 mb-2">
          <Text className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            {stats.average.toFixed(1)}
          </Text>
          <Star 
            size={32} 
            className="text-amber-500 dark:text-amber-400"
            fill="currentColor"
          />
        </View>
        <Text className="text-sm text-gray-600 dark:text-gray-400">
          Basé sur {stats.total} avis
        </Text>
      </View>

      {/* Distribution */}
      <View className="gap-2">
        {ratings.map((rating, index) => {
          const count = stats.distribution[rating as keyof typeof stats.distribution] || 0;
          const percentage = stats.total > 0 ? (count / stats.total) * 100 : 0;

          return (
            <RatingBar
              key={rating}
              rating={rating}
              count={count}
              percentage={percentage}
              delay={(5 - rating) * 100}
            />
          );
        })}
      </View>
    </View>
  );
}

// Composant séparé pour la barre de rating avec animation
interface RatingBarProps {
  rating: number;
  count: number;
  percentage: number;
  delay: number;
}

function RatingBar({ rating, count, percentage, delay }: RatingBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(percentage, { duration: 500 })
    );
  }, [percentage, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className="flex-row items-center gap-3">
      {/* Rating label */}
      <View className="flex-row items-center gap-1 w-16">
        <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
          {rating}
        </Text>
        <Star 
          size={14} 
          className="text-amber-500 dark:text-amber-400"
          fill="currentColor"
        />
      </View>

      {/* Progress bar */}
      <View className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          style={animatedStyle}
          className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
        />
      </View>

      {/* Count */}
      <Text className="text-sm text-gray-600 dark:text-gray-400 w-12 text-right">
        {count}
      </Text>
    </View>
  );
}