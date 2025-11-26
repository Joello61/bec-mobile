import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  Pressable,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import Animated, { FadeIn } from 'react-native-reanimated';
import { ArrowLeft, MessageSquare } from 'lucide-react-native';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import type { Message, User } from '@/types';
import type { CreateSignalementFormData } from '@/lib/validations';
import Avatar from '../ui/Avatar';
import SignalementForm from '../forms/SignalementForm';
import MessageInput from './MessageInput';
import MessageBubble from './MessageBubble';

interface ChatBoxProps {
  messages: Message[];
  recipient: User;
  currentUserId: number;
  onSendMessage: (content: string) => void;
  onBack?: () => void;
  isLoading?: boolean;
}

export default function ChatBox({
  messages,
  recipient,
  currentUserId,
  onSendMessage,
  onBack,
  isLoading = false,
}: ChatBoxProps) {
  const [messageToSignal, setMessageToSignal] = useState<number | null>(null);
  const scrollViewRef = useRef<ScrollView>(null);
  const { createSignalement } = useSignalementActions();

  const scrollToBottom = () => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  };

  useEffect(() => {
    // Délai pour laisser le temps au layout de se calculer
    const timer = setTimeout(() => {
      scrollToBottom();
    }, 100);
    return () => clearTimeout(timer);
  }, [messages]);

  const handleSignaler = (messageId: number) => {
    setMessageToSignal(messageId);
  };

  const handleSubmitSignalement = async (data: CreateSignalementFormData) => {
    await createSignalement(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-white dark:bg-gray-900"
      keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
    >
      {/* Header */}
      <View className="flex-row items-center gap-3 p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        {onBack && (
          <Pressable
            onPress={onBack}
            className="p-2 active:bg-gray-100 dark:active:bg-gray-800 rounded-lg"
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <ArrowLeft size={20} className="text-gray-900 dark:text-white" />
          </Pressable>
        )}
        
        <Avatar
          src={recipient.photo}
          fallback={`${recipient.nom} ${recipient.prenom}`}
          size="md"
          verified={recipient.emailVerifie}
        />
        
        <View className="flex-1">
          <Text className="font-semibold text-gray-900 dark:text-white">
            {recipient.prenom} {recipient.nom}
          </Text>
          {recipient.bio && (
            <Text
              className="text-sm text-gray-600 dark:text-gray-400"
              numberOfLines={1}
            >
              {recipient.bio}
            </Text>
          )}
        </View>
      </View>

      {/* Messages ScrollView */}
      <ScrollView
        ref={scrollViewRef}
        className="flex-1 px-4"
        contentContainerStyle={{
          paddingVertical: 16,
          flexGrow: 1,
        }}
        onContentSizeChange={scrollToBottom}
      >
        {messages.length === 0 ? (
          <Animated.View
            entering={FadeIn.duration(400)}
            className="flex-1 items-center justify-center py-12"
          >
            <View className="w-16 h-16 mb-4 rounded-full bg-gray-100 dark:bg-gray-800 items-center justify-center">
              <MessageSquare size={32} className="text-gray-400 dark:text-gray-600" />
            </View>
            <Text className="text-gray-600 dark:text-gray-400 text-center px-8">
              Commencez la conversation en envoyant un message
            </Text>
          </Animated.View>
        ) : (
          <View className="space-y-4">
            {messages.map((message, index) => {
              const isOwn = message.expediteur.id === currentUserId;
              const prevMessage = messages[index - 1];
              const showAvatar =
                !prevMessage || prevMessage.expediteur.id !== message.expediteur.id;

              return (
                <MessageBubble
                  key={message.id}
                  message={message}
                  isOwn={isOwn}
                  showAvatar={showAvatar}
                  onSignaler={handleSignaler}
                />
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Message Input */}
      <MessageInput onSend={onSendMessage} isLoading={isLoading} />

      {/* Modal de signalement */}
      {messageToSignal && (
        <SignalementForm
          isOpen={true}
          onClose={() => setMessageToSignal(null)}
          onSubmit={handleSubmitSignalement}
          messageId={messageToSignal}
        />
      )}
    </KeyboardAvoidingView>
  );
}