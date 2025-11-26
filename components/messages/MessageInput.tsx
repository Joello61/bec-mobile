import React, { useState, useRef } from 'react';
import { View, TextInput, Pressable, Platform } from 'react-native';
import { Send } from 'lucide-react-native';

interface MessageInputProps {
  onSend: (content: string) => void;
  isLoading?: boolean;
  placeholder?: string;
}

export default function MessageInput({
  onSend,
  isLoading = false,
  placeholder = 'Écrivez votre message...',
}: MessageInputProps) {
  const [message, setMessage] = useState('');
  const [inputHeight, setInputHeight] = useState(44);
  const inputRef = useRef<TextInput>(null);

  const handleSend = () => {
    const trimmedMessage = message.trim();
    if (!trimmedMessage || isLoading) return;

    onSend(trimmedMessage);
    setMessage('');
    setInputHeight(44); // Reset height
    inputRef.current?.focus(); // Keep focus after send
  };

  const handleContentSizeChange = (event: any) => {
    // Auto-grow jusqu'à 120px max
    const newHeight = Math.min(Math.max(44, event.nativeEvent.contentSize.height), 120);
    setInputHeight(newHeight);
  };

  return (
    <View className="border-t border-gray-200 dark:border-gray-700 px-4 py-3 bg-white dark:bg-gray-900">
      <View className="flex-row items-end gap-3">
        {/* TextInput auto-grow */}
        <TextInput
          ref={inputRef}
          value={message}
          onChangeText={setMessage}
          placeholder={placeholder}
          placeholderTextColor="#9ca3af" // gray-400
          multiline
          textAlignVertical="top"
          onContentSizeChange={handleContentSizeChange}
          className="flex-1 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          style={{
            height: inputHeight,
            maxHeight: 120,
          }}
          returnKeyType="default"
          blurOnSubmit={false}
          // Auto-capitalize sur iOS
          autoCapitalize="sentences"
          autoCorrect={true}
        />

        {/* Bouton Envoyer */}
        <Pressable
          onPress={handleSend}
          disabled={!message.trim() || isLoading}
          className={`w-11 h-11 rounded-xl items-center justify-center ${
            message.trim() && !isLoading
              ? 'bg-primary active:bg-primary-dark'
              : 'bg-gray-300 dark:bg-gray-700'
          }`}
        >
          <Send
            size={20}
            className={message.trim() && !isLoading ? 'text-white' : 'text-gray-500'}
          />
        </Pressable>
      </View>
    </View>
  );
}