import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { MessageCircle, ArrowRight } from 'lucide-react-native';
import { formatDateRelative } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardMessage } from '@/types';
import { cn } from '@/lib/utils/cn';
import { Card, CardContent } from '../ui/Card';
import EmptyState from '../common/EmptyState';
import Avatar from '../ui/Avatar';

interface RecentMessagesProps {
  messages: DashboardMessage[];
  nonLus: number;
}

export default function RecentMessages({ messages, nonLus }: RecentMessagesProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center relative">
              <MessageCircle size={20} className="text-primary dark:text-primary-light" />
              {nonLus > 0 && (
                <View className="absolute -top-1 -right-1 w-5 h-5 bg-error dark:bg-red-500 rounded-full flex items-center justify-center">
                  <Text className="text-white text-xs font-bold">
                    {nonLus > 9 ? '9+' : nonLus}
                  </Text>
                </View>
              )}
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Messages
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {nonLus > 0 
                  ? `${nonLus} non lu${nonLus > 1 ? 's' : ''}` 
                  : 'Tous vos messages'}
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/(protected)/messages")}
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
        {messages.length === 0 ? (
          <EmptyState
            icon={<MessageCircle size={64} className="text-gray-400 dark:text-gray-500" />}
            title="Aucun message"
            description="Votre messagerie est vide"
          />
        ) : (
          <View className="gap-3">
            {messages.map((message, index) => (
              <Animated.View
                key={message.id}
                entering={FadeInRight.delay(index * 100)}
              >
                <Pressable
                  onPress={() => router.push({
                    pathname: "/(protected)/messages/[id]",
                    params: { id: message.expediteur.id.toString() }
                  })}
                  className="active:opacity-70"
                >
                  <View
                    className={cn(
                      'p-4 border rounded-lg',
                      !message.lu
                        ? 'bg-accent/5 dark:bg-accent/10 border-accent/30 dark:border-accent/40'
                        : 'border-gray-200 dark:border-gray-700 active:border-primary dark:active:border-primary-light active:bg-primary/5 dark:active:bg-primary/10'
                    )}
                  >
                    <View className="flex-row items-start gap-3">
                      <Avatar
                        src={undefined}
                        fallback={`${message.expediteur.nom} ${message.expediteur.prenom}`}
                        size="md"
                      />
                      <View className="flex-1">
                        <View className="flex-row items-start justify-between gap-2 mb-1">
                          <Text
                            className={cn(
                              'text-sm font-medium flex-1',
                              !message.lu 
                                ? 'text-gray-900 dark:text-gray-100' 
                                : 'text-gray-700 dark:text-gray-300'
                            )}
                          >
                            {message.expediteur.prenom} {message.expediteur.nom}
                          </Text>
                          {!message.lu && (
                            <View className="w-2 h-2 bg-accent dark:bg-accent-light rounded-full mt-1" />
                          )}
                        </View>
                        <Text
                          className="text-sm text-gray-600 dark:text-gray-400"
                          numberOfLines={2}
                        >
                          {message.contenu}
                        </Text>
                        <Text className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {formatDateRelative(message.createdAt)}
                        </Text>
                      </View>
                    </View>
                  </View>
                </Pressable>
              </Animated.View>
            ))}
          </View>
        )}
      </CardContent>
    </Card>
  );
}