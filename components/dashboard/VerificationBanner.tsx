import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInDown, FadeOutUp } from 'react-native-reanimated';
import { TriangleAlert } from 'lucide-react-native';
import { ROUTES } from '@/lib/utils/constants';
import { useAuth } from '@/lib/hooks/useAuth';

export default function VerificationBanner() {
  const { user } = useAuth();
  const router = useRouter();

  // Ne rien afficher si pas d'utilisateur ou profil déjà complet
  if (!user || user.isProfileComplete) {
    return null;
  }

  return (
    <Animated.View
      entering={FadeInDown}
      exiting={FadeOutUp}
      className="bg-primary/10 dark:bg-primary/20 border-l-4 border-primary dark:border-primary-light p-4 mb-6 rounded-lg"
    >
      <View className="flex-row items-center justify-between gap-4">
        {/* Icon + Text */}
        <View className="flex-row items-center gap-3 flex-1">
          <View className="w-10 h-10 rounded-full bg-primary/20 dark:bg-primary/30 flex items-center justify-center">
            <TriangleAlert size={24} className="text-primary dark:text-primary-light" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-1">
              Profil incomplet
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
              Complétez votre profil pour créer des voyages, demandes et envoyer des messages
            </Text>
          </View>
        </View>

        {/* CTA Button */}
        <Pressable
          onPress={() => router.push("/(protected)/complete-profile")}
          className="px-4 py-2 bg-primary dark:bg-primary-light rounded-lg active:opacity-80"
          accessibilityRole="button"
          accessibilityLabel="Compléter votre profil maintenant"
        >
          <Text className="text-white dark:text-gray-900 text-sm font-medium">
            Compléter
          </Text>
        </Pressable>
      </View>
    </Animated.View>
  );
}