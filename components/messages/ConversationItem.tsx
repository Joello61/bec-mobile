import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { formatDateRelative, truncate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Conversation, User } from '@/types';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

interface ConversationItemProps {
  conversation: Conversation;
  currentUserId: number;
  isActive?: boolean;
  onClick: () => void;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function ConversationItem({
  conversation,
  currentUserId,
  isActive = false,
  onClick,
}: ConversationItemProps) {
  // Déterminer l'autre participant
  const otherUser: User =
    conversation.participant1.id === currentUserId
      ? conversation.participant2
      : conversation.participant1;

  const hasUnread = conversation.messagesNonLus > 0;
  const lastMessage = conversation.dernierMessage;

  // Animation de scale au press
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isActive ? 0.98 : 1, { duration: 150 }),
      },
    ],
  }));

  return (
    <AnimatedPressable
      onPress={onClick}
      style={animatedStyle}
      className={cn(
        'p-4 flex-row items-start gap-3 border-b border-gray-100 dark:border-gray-800',
        isActive && 'bg-primary/10 dark:bg-primary/20',
        hasUnread && !isActive && 'bg-primary/5 dark:bg-primary/10'
      )}
    >
      {/* Avatar */}
      <Avatar
        src={otherUser.photo}
        fallback={`${otherUser.nom} ${otherUser.prenom}`}
        size="md"
        verified={otherUser.emailVerifie}
      />

      {/* Contenu */}
      <View className="flex-1">
        {/* Header: Nom + Date */}
        <View className="flex-row items-start justify-between gap-2 mb-1">
          <Text
            className={cn(
              'font-medium flex-1',
              hasUnread
                ? 'text-gray-900 dark:text-white'
                : 'text-gray-700 dark:text-gray-300'
            )}
            numberOfLines={1}
          >
            {otherUser.prenom} {otherUser.nom}
          </Text>
          
          {lastMessage && (
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              {formatDateRelative(lastMessage.createdAt)}
            </Text>
          )}
        </View>

        {/* Dernier message + Badge non lu */}
        {lastMessage ? (
          <View className="flex-row items-center gap-2">
            <Text
              className={cn(
                'text-sm flex-1',
                hasUnread
                  ? 'text-gray-900 dark:text-white font-medium'
                  : 'text-gray-600 dark:text-gray-400'
              )}
              numberOfLines={1}
            >
              {truncate(lastMessage.contenu, 50)}
            </Text>
            
            {hasUnread && (
              <Badge variant="default" size="sm">
                {conversation.messagesNonLus}
              </Badge>
            )}
          </View>
        ) : (
          <Text className="text-sm text-gray-500 dark:text-gray-400 italic">
            Aucun message
          </Text>
        )}
      </View>
    </AnimatedPressable>
  );
}