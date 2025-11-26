import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeIn, FadeInDown } from 'react-native-reanimated';
import { AlertCircle, RefreshCw } from 'lucide-react-native';
import Button from '../ui/Button';

interface ErrorStateProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({
  title = 'Une erreur est survenue',
  message = 'Impossible de charger les données. Veuillez réessayer.',
  onRetry,
}: ErrorStateProps) {
  return (
    <Animated.View
      entering={FadeIn.duration(400)}
      className="flex-1 items-center justify-center px-6 py-12"
    >
      {/* Cercle avec icône d'erreur */}
      <Animated.View
        entering={FadeInDown.delay(100).springify()}
        className="w-24 h-24 mb-6 rounded-full bg-red-100 dark:bg-red-900/20 items-center justify-center"
      >
        <AlertCircle size={48} className="text-red-600 dark:text-red-400" />
      </Animated.View>

      {/* Titre */}
      <Animated.View entering={FadeInDown.delay(200).springify()}>
        <Text className="text-xl font-semibold text-gray-900 dark:text-white mb-2 text-center">
          {title}
        </Text>
      </Animated.View>

      {/* Message d'erreur */}
      <Animated.View
        entering={FadeInDown.delay(300).springify()}
        className="max-w-sm mb-6"
      >
        <Text className="text-gray-600 dark:text-gray-400 text-center leading-6">
          {message}
        </Text>
      </Animated.View>

      {/* Bouton réessayer */}
      {onRetry && (
        <Animated.View
          entering={FadeInDown.delay(400).springify()}
          className="w-full max-w-xs"
        >
          <Button
            variant="outline"
            onPress={onRetry}
            leftIcon={<RefreshCw size={16} />}
          >
            Réessayer
          </Button>
        </Animated.View>
      )}
    </Animated.View>
  );
}