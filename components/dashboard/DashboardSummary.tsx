import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Plane, Package, Bell, MessageCircle } from 'lucide-react-native';
import type { DashboardSummary as DashboardSummaryType } from '@/types';
import { Card, CardContent } from '../ui/Card';

interface DashboardSummaryProps {
  data: DashboardSummaryType;
}

export default function DashboardSummary({ data }: DashboardSummaryProps) {
  const cards = [
    {
      title: 'Voyages actifs',
      value: data.voyagesActifs,
      icon: Plane,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/30',
    },
    {
      title: 'Demandes en cours',
      value: data.demandesEnCours,
      icon: Package,
      color: 'text-primary dark:text-primary-light',
      bgColor: 'bg-primary/10 dark:bg-primary/20',
    },
    {
      title: 'Notifications',
      value: data.notificationsNonLues,
      icon: Bell,
      color: 'text-amber-600 dark:text-amber-400',
      bgColor: 'bg-amber-100 dark:bg-amber-900/30',
    },
    {
      title: 'Messages',
      value: data.messagesNonLus,
      icon: MessageCircle,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/30',
    },
  ];

  return (
    <View className="gap-4">
      {cards.map((card, index) => (
        <Animated.View
          key={card.title}
          entering={FadeInDown.delay(index * 100)}
        >
          <Card>
            <CardContent className="p-6">
              <View className="flex-row items-center justify-between">
                <View className="flex-1">
                  <Text className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    {card.title}
                  </Text>
                  <Text className="text-3xl font-bold text-gray-900 dark:text-gray-100 mt-2">
                    {card.value}
                  </Text>
                </View>
                <View className={`w-12 h-12 rounded-lg ${card.bgColor} flex items-center justify-center`}>
                  <card.icon size={24} className={card.color} />
                </View>
              </View>
            </CardContent>
          </Card>
        </Animated.View>
      ))}
    </View>
  );
}