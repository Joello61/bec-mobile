import React from 'react';
import { Text } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { Package } from 'lucide-react-native';
import Button from '../ui/Button';

interface EmptyStateProps {
  icon?: React.ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export default function EmptyState({
  icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  // Icône par défaut si non fournie
  const defaultIcon = (
    <Package size={32} className="text-gray-400 dark:text-gray-600" />
  );

  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-6 py-12"
    >
      {/* Cercle avec icône */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="w-24 h-24 mb-6 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center"
      >
        {icon || defaultIcon}
      </Animated.View>

      {/* Titre */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          {title}
        </Text>
      </Animated.View>

      {/* Description */}
      {description && (
        <Animated.View
          entering={FadeInDown.delay(300).springify()}
          className="max-w-sm mb-6"
        >
          <Text className="text-gray-600 dark:text-gray-400 text-center leading-6">
            {description}
          </Text>
        </Animated.View>
      )}

      {/* Action button */}
      {action && (
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="w-full max-w-xs"
        >
          <Button variant="primary" onPress={action.onPress}>
            {action.label}
          </Button>
        </Animated.View>
      )}
    </Animated.View>
  );
}