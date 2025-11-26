import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Href, useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Plane, Package, MessageCircle, Zap } from 'lucide-react-native';
import { Card, CardContent } from '../ui/Card';

export default function QuickActions() {
  const router = useRouter();

  const actions = [
    {
        icon: Plane,
        label: "Créer un voyage",
        href: "/(protected)/voyages/create" as Href,
        color: "text-blue-600 dark:text-blue-400",
    },
    {
        icon: Package,
        label: "Faire une demande",
        href: "/(protected)/demandes/create" as Href,
        color: "text-primary dark:text-primary-light",
    },
    {
        icon: MessageCircle,
        label: "Voir mes messages",
        href: "/(protected)/messages" as Href,
        color: "text-green-600 dark:text-green-400",
    },
    ];

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex-row items-center gap-3 mb-6">
          <View className="w-10 h-10 rounded-lg bg-primary dark:bg-primary-light flex items-center justify-center">
            <Zap size={20} className="text-white dark:text-gray-900" />
          </View>
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              Actions rapides
            </Text>
            <Text className="text-sm text-gray-500 dark:text-gray-400">
              Accédez rapidement aux fonctionnalités
            </Text>
          </View>
        </View>

        {/* Actions */}
        <View className="gap-3">
          {actions.map((action, index) => (
            <Animated.View
              key={action.label}
              entering={FadeInRight.delay(index * 100)}
            >
              <Pressable
                onPress={() => router.push(action.href)}
                className="active:opacity-70"
              >
                <View className="p-4 rounded-lg bg-primary/10 dark:bg-primary/20 active:bg-primary/20 dark:active:bg-primary/30">
                  <View className="flex-row items-center gap-3">
                    <View className="w-10 h-10 rounded-lg bg-white dark:bg-gray-800 flex items-center justify-center">
                      <action.icon size={20} className={action.color} />
                    </View>
                    <Text className="font-medium text-primary dark:text-primary-light">
                      {action.label}
                    </Text>
                  </View>
                </View>
              </Pressable>
            </Animated.View>
          ))}
        </View>
      </CardContent>
    </Card>
  );
}