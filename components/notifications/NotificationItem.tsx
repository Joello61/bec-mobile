import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { 
  MessageCircle, 
  Star, 
  Package, 
  FileText, 
  X, 
  Lightbulb 
} from 'lucide-react-native';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { AppNotification, AppNotificationType } from '@/types';

interface NotificationItemProps {
  notification: AppNotification;
  onClick?: () => void;
  onDismiss?: () => void;
}

const notificationIcons: Record<AppNotificationType, React.ComponentType<any>> = {
  matching_voyage: Package,
  matching_demande: FileText,
  new_message: MessageCircle,
  avis_recu: Star,
  voyage_statut: Package,
  demande_statut: FileText,
  new_proposition: Lightbulb,
};

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function NotificationItem({ 
  notification, 
  onClick, 
  onDismiss 
}: NotificationItemProps) {
  const scale = useSharedValue(1);
  const IconComponent = notificationIcons[notification.type];

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.98, { damping: 10 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1, { damping: 10 });
  };

  const handleDismiss = (e: any) => {
    e.stopPropagation?.();
    onDismiss?.();
  };

  return (
    <AnimatedPressable
      onPress={onClick}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animatedStyle}
      className={cn(
        'relative p-4 flex-row items-start gap-3 border-2 rounded-lg',
        !notification.lue
          ? 'bg-primary/5 dark:bg-primary/10 border-primary/20 dark:border-primary/30'
          : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
      )}
      accessibilityRole="button"
      accessibilityLabel={notification.titre}
      accessibilityHint="Appuyez pour voir les détails"
    >
      {/* Indicateur non lu - Point sur l'icône mobile */}
      {!notification.lue && (
        <View className="absolute top-2 left-2 w-2 h-2 bg-primary dark:bg-primary-light rounded-full z-10" />
      )}

      {/* Icon */}
      <View
        className={cn(
          'w-12 h-12 rounded-lg flex items-center justify-center',
          !notification.lue
            ? 'bg-primary/15 dark:bg-primary/20'
            : 'bg-gray-100 dark:bg-gray-700'
        )}
      >
        <IconComponent
          size={20}
          className={cn(
            !notification.lue
              ? 'text-primary dark:text-primary-light'
              : 'text-gray-600 dark:text-gray-400'
          )}
        />
      </View>

      {/* Content */}
      <View className="flex-1 pr-8">
        <View className="flex-row items-start justify-between gap-2 mb-1">
          <Text
            className={cn(
              'text-base font-medium leading-tight flex-1',
              !notification.lue
                ? 'text-gray-900 dark:text-gray-100'
                : 'text-gray-700 dark:text-gray-300'
            )}
            numberOfLines={2}
          >
            {notification.titre}
          </Text>
          {/* Indicateur non lu - Point desktop (visible sur grand écran) */}
          {!notification.lue && (
            <View className="w-2 h-2 bg-primary dark:bg-primary-light rounded-full mt-1.5" />
          )}
        </View>

        <Text
          className="text-sm text-gray-600 dark:text-gray-400 mb-1.5"
          numberOfLines={2}
        >
          {notification.message}
        </Text>

        <Text className="text-xs text-gray-500 dark:text-gray-400">
          {formatDateRelative(notification.createdAt)}
        </Text>
      </View>

      {/* Dismiss Button */}
      {onDismiss && (
        <Pressable
          onPress={handleDismiss}
          className="absolute top-2 right-2 p-1.5 active:bg-gray-200 dark:active:bg-gray-700 rounded-full z-10"
          accessibilityRole="button"
          accessibilityLabel="Supprimer la notification"
          hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
        >
          <X size={16} className="text-gray-400 dark:text-gray-500" />
        </Pressable>
      )}
    </AnimatedPressable>
  );
}