import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Check, CheckCheck, Flag } from 'lucide-react-native';
import { formatDateRelative } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { Message } from '@/types';
import Avatar from '../ui/Avatar';

interface MessageBubbleProps {
  message: Message;
  isOwn: boolean;
  showAvatar?: boolean;
  onSignaler?: (messageId: number) => void;
}

export default function MessageBubble({
  message,
  isOwn,
  showAvatar = true,
  onSignaler,
}: MessageBubbleProps) {
  const [showMenu, setShowMenu] = useState(false);

  const handleSignaler = () => {
    setShowMenu(false);
    onSignaler?.(message.id);
  };

  // Long press handler pour afficher le menu sur mobile
  const handleLongPress = () => {
    if (!isOwn && onSignaler) {
      setShowMenu(true);
    }
  };

  return (
    <Animated.View
      entering={FadeInDown.duration(200)}
      className={cn('flex-row gap-3', isOwn && 'flex-row-reverse')}
    >
      {/* Avatar */}
      {showAvatar && !isOwn && (
        <View className="w-8">
          <Avatar
            src={message.expediteur.photo}
            fallback={`${message.expediteur.nom} ${message.expediteur.prenom}`}
            size="sm"
          />
        </View>
      )}

      {/* Spacer si pas d'avatar */}
      {!showAvatar && !isOwn && <View className="w-8" />}

      {/* Message Content */}
      <Pressable
        onLongPress={handleLongPress}
        delayLongPress={500}
        className={cn('flex-col max-w-[75%]', isOwn && 'items-end')}
      >
        {/* Bubble */}
        <View
          className={cn(
            'px-4 py-2.5 rounded-2xl',
            isOwn
              ? 'bg-primary rounded-br-sm'
              : 'bg-gray-100 dark:bg-gray-800 rounded-bl-sm'
          )}
        >
          <Text
            className={cn(
              'text-sm leading-5',
              isOwn ? 'text-white' : 'text-gray-900 dark:text-white'
            )}
            selectable
          >
            {message.contenu}
          </Text>
        </View>

        {/* Meta Info (date + statut de lecture) */}
        <View
          className={cn(
            'flex-row items-center gap-1 mt-1 px-2',
            isOwn && 'flex-row-reverse'
          )}
        >
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateRelative(message.createdAt)}
          </Text>
          
          {isOwn && (
            <View>
              {message.lu ? (
                <CheckCheck size={14} className="text-primary" />
              ) : (
                <Check size={14} className="text-gray-500 dark:text-gray-400" />
              )}
            </View>
          )}
        </View>
      </Pressable>

      {/* Bottom Sheet Menu (pour signaler) */}
      <Modal
        visible={showMenu}
        transparent
        animationType="fade"
        onRequestClose={() => setShowMenu(false)}
      >
        <Pressable
          className="flex-1 bg-black/50 justify-end"
          onPress={() => setShowMenu(false)}
        >
          {/* Bottom Sheet */}
          <Pressable onPress={(e) => e.stopPropagation()}>
            <Animated.View
              entering={FadeInDown.springify()}
              className="bg-white dark:bg-gray-900 rounded-t-3xl px-6 py-8 pb-safe"
            >
              {/* Header */}
              <View className="items-center mb-6">
                <View className="w-12 h-1 bg-gray-300 dark:bg-gray-700 rounded-full mb-4" />
                <Text className="text-lg font-semibold text-gray-900 dark:text-white">
                  Options du message
                </Text>
              </View>

              {/* Action: Signaler */}
              <Pressable
                onPress={handleSignaler}
                className="flex-row items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl active:opacity-70"
              >
                <View className="w-10 h-10 bg-red-100 dark:bg-red-900/40 rounded-full items-center justify-center">
                  <Flag size={20} className="text-red-600 dark:text-red-400" />
                </View>
                <View className="flex-1">
                  <Text className="text-base font-medium text-gray-900 dark:text-white mb-0.5">
                    Signaler ce message
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Contenu inapproprié ou abusif
                  </Text>
                </View>
              </Pressable>

              {/* Bouton Annuler */}
              <Pressable
                onPress={() => setShowMenu(false)}
                className="mt-4 p-4 bg-gray-100 dark:bg-gray-800 rounded-xl active:opacity-70"
              >
                <Text className="text-center text-base font-medium text-gray-900 dark:text-white">
                  Annuler
                </Text>
              </Pressable>
            </Animated.View>
          </Pressable>
        </Pressable>
      </Modal>
    </Animated.View>
  );
}