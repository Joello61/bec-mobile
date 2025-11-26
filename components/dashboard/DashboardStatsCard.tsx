import React, { useEffect, useMemo } from 'react';
import { View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
} from 'react-native-reanimated';
import { TrendingUp, Award, Star } from 'lucide-react-native';
import type { DashboardStats } from '@/types';
import { Card, CardContent } from '../ui/Card';

interface DashboardStatsCardProps {
  stats: DashboardStats;
}

export default function DashboardStatsCard({ stats }: DashboardStatsCardProps) {
  const maxNotes = useMemo(
    () => Math.max(...Object.values(stats.repartitionNotes)),
    [stats.repartitionNotes]
  );

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
            <TrendingUp size={20} className="text-primary dark:text-primary-light" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Mes Statistiques
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Vos performances
            </Text>
          </View>
        </View>

        {/* Main Stats */}
        <View className="flex-row gap-4 mb-6">
          <View className="flex-1 items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Text className="text-2xl font-bold text-primary dark:text-primary-light">
              {stats.voyagesEffectues}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
              Voyages effectués
            </Text>
          </View>
          <View className="flex-1 items-center p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
            <Text className="text-2xl font-bold text-primary dark:text-primary-light">
              {stats.bagagesTransportes}
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 mt-1 text-center">
              Bagages transportés
            </Text>
          </View>
        </View>

        {/* Rating */}
        {stats.nombreAvis > 0 ? (
          <>
            <View className="flex-row items-center justify-between mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-center gap-2">
                <Award size={20} className="text-amber-500 dark:text-amber-400" />
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Note moyenne
                </Text>
              </View>
              <View className="flex-row items-center gap-2">
                <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  {stats.noteMoyenne.toFixed(1)}
                </Text>
                <Star 
                  size={20} 
                  className="text-amber-500 dark:text-amber-400"
                  fill="currentColor"
                />
              </View>
            </View>

            {/* Rating Distribution */}
            <View className="gap-2">
              <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-3">
                Répartition des notes ({stats.nombreAvis} avis)
              </Text>
              {[5, 4, 3, 2, 1].map((note, index) => {
                const count = stats.repartitionNotes[note as keyof typeof stats.repartitionNotes];
                const percentage = stats.nombreAvis > 0 ? (count / stats.nombreAvis) * 100 : 0;
                const barWidth = maxNotes > 0 ? (count / maxNotes) * 100 : 0;

                return (
                  <RatingBar
                    key={note}
                    note={note}
                    count={count}
                    percentage={percentage}
                    barWidth={barWidth}
                    delay={index * 100}
                  />
                );
              })}
            </View>
          </>
        ) : (
          <View className="items-center py-6">
            <Star size={32} className="text-gray-300 dark:text-gray-600 mb-2" />
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Aucun avis reçu pour le moment
            </Text>
          </View>
        )}
      </CardContent>
    </Card>
  );
}

// Composant de barre de rating avec animation
interface RatingBarProps {
  note: number;
  count: number;
  percentage: number;
  barWidth: number;
  delay: number;
}

function RatingBar({ note, count, percentage, barWidth, delay }: RatingBarProps) {
  const width = useSharedValue(0);

  useEffect(() => {
    width.value = withDelay(
      delay,
      withTiming(barWidth, { duration: 500 })
    );
  }, [barWidth, delay]);

  const animatedStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View className="flex-row items-center gap-2">
      <Text className="text-xs font-medium text-gray-600 dark:text-gray-400 w-6">
        {note}★
      </Text>
      <View className="flex-1 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
        <Animated.View
          style={animatedStyle}
          className="h-full bg-amber-500 dark:bg-amber-400 rounded-full"
        />
      </View>
      <Text className="text-xs text-gray-500 dark:text-gray-400 w-12 text-right">
        {count > 0 ? `${percentage.toFixed(0)}%` : '0%'}
      </Text>
    </View>
  );
}