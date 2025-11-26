import React from 'react';
import { View, Text, FlatList } from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { MessageSquare } from 'lucide-react-native';
import type { Conversation } from '@/types';
import LoadingSkeleton from '../common/LoadingSkeleton';
import ConversationItem from './ConversationItem';

interface ConversationListProps {
  conversations: Conversation[];
  currentUserId: number;
  activeConversationId?: number;
  onConversationClick: (conversationId: number) => void;
  isLoading?: boolean;
}

export default function ConversationList({
  conversations,
  currentUserId,
  activeConversationId,
  onConversationClick,
  isLoading = false,
}: ConversationListProps) {
  // État de chargement
  if (isLoading) {
    return (
      <View className="flex-1">
        {[...Array(5)].map((_, i) => (
          <View
            key={i}
            className="p-4 border-b border-gray-100 dark:border-gray-800"
          >
            <View className="flex-row items-start gap-3">
              <LoadingSkeleton variant="circular" width={40} height={40} />
              <View className="flex-1 space-y-2">
                <LoadingSkeleton width="75%" height={16} />
                <LoadingSkeleton width="100%" height={14} />
              </View>
            </View>
          </View>
        ))}
      </View>
    );
  }

  // État vide
  if (conversations.length === 0) {
    return (
      <Animated.View
        entering={FadeIn.duration(400)}
        className="flex-1 items-center justify-center py-12 px-4"
      >
        <View className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
          <MessageSquare size={32} className="text-gray-400 dark:text-gray-600" />
        </View>
        
        <Text className="text-base font-medium text-gray-900 dark:text-white mb-1">
          Aucune conversation
        </Text>
        
        <Text className="text-sm text-gray-600 dark:text-gray-400 text-center">
          Commencez à échanger avec des voyageurs ou des clients
        </Text>
      </Animated.View>
    );
  }

  // Liste des conversations
  return (
    <FlatList
      data={conversations}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item }) => (
        <ConversationItem
          conversation={item}
          currentUserId={currentUserId}
          isActive={activeConversationId === item.id}
          onClick={() => onConversationClick(item.id)}
        />
      )}
      className="flex-1 bg-white dark:bg-gray-900"
      contentContainerStyle={{
        flexGrow: 1,
      }}
      ItemSeparatorComponent={() => (
        <View className="h-px bg-gray-100 dark:bg-gray-800" />
      )}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={5}
    />
  );
}