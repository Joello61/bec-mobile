import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Bell, ArrowRight } from 'lucide-react-native';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardNotification, AppNotificationType } from '@/types';
import { Card, CardContent } from '../ui/Card';
import EmptyState from '../common/EmptyState';
import NotificationItem from '../notifications/NotificationItem';

interface RecentNotificationsProps {
  notifications: DashboardNotification[];
  nonLues: number;
}

export default function RecentNotifications({ 
  notifications, 
  nonLues 
}: RecentNotificationsProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center relative">
              <Bell size={20} className="text-primary dark:text-primary-light" />
              {nonLues > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-error dark:bg-red-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {nonLues > 9 ? '9+' : nonLues}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Notifications
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {nonLues > 0 
                  ? `${nonLues} non lue${nonLues > 1 ? 's' : ''}` 
                  : 'Toutes vos notifications'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/(protected)/notifications")}
            className="active:opacity-70"
          >
            <View className="flex-row items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Voir tout
              </Text>
              <ArrowRight size={16} className="text-gray-700 dark:text-gray-300" />
            </View>
          </Pressable>
        </View>

        {/* List */}
        {notifications.length === 0 ? (
          <EmptyState
            icon={<Bell size={64} className="text-gray-400 dark:text-gray-500" />}
            title="Aucune notification"
            description="Vous êtes à jour !"
          />
        ) : (
          <View className="gap-2">
            {notifications.map((notification, index) => (
              <Animated.View
                key={notification.id}
                entering={FadeInRight.delay(index * 100)}
              >
                <NotificationItem
                  notification={{
                    ...notification,
                    type: notification.type as AppNotificationType,
                  }}
                />
              </Animated.View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}