import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { Bell } from 'lucide-react-native';
import type { AppNotification } from '@/types';
import LoadingSkeleton from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';
import NotificationItem from './NotificationItem';

interface NotificationListProps {
  notifications: AppNotification[];
  onNotificationClick?: (notification: AppNotification) => void;
  onDismiss?: (id: number) => void;
  onMarkAllAsRead?: () => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function NotificationList({
  notifications,
  onNotificationClick,
  onDismiss,
  onMarkAllAsRead,
  isLoading = false,
  onRefresh,
  isRefreshing = false,
}: NotificationListProps) {
  const hasUnread = notifications.some((n) => !n.lue);

  // Loading State
  if (isLoading) {
    return (
      <View className="gap-3">
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            className="p-4 rounded-lg flex-row items-start gap-3"
          >
            <LoadingSkeleton width={48} height={48} className='border rounded-lg'/>
            <View className="flex-1 gap-2">
              <LoadingSkeleton width="75%" height={16} />
              <LoadingSkeleton width="100%" height={12} />
              <LoadingSkeleton width="25%" height={12} />
            </View>
          </View>
        ))}
      </View>
    );
  }

  // Empty State
  if (notifications.length === 0) {
    return (
      <EmptyState
        icon={<Bell size={64} className="text-gray-400 dark:text-gray-500" />}
        title="Aucune notification"
        description="Vous êtes à jour ! Revenez plus tard."
      />
    );
  }

  return (
    <View className="flex-1">
      {/* Header Actions */}
      {hasUnread && onMarkAllAsRead && (
        <View className="mb-4">
          <Button
            variant="ghost"
            size="sm"
            onPress={onMarkAllAsRead}
            className="self-end"
          >
            Tout marquer comme lu
          </Button>
        </View>
      )}

      {/* List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item, index }) => (
          <Animated.View
            entering={FadeIn.delay(index * 50)}
            exiting={FadeOut}
          >
            <NotificationItem
              notification={item}
              onClick={() => onNotificationClick?.(item)}
              onDismiss={onDismiss ? () => onDismiss(item.id) : undefined}
            />
          </Animated.View>
        )}
        contentContainerStyle={{ gap: 12, paddingBottom: 24 }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
      />
    </View>
  );
}