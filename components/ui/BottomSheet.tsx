import React from 'react';
import { 
  Modal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  KeyboardAvoidingView, 
  Platform,
  ScrollView,
  type DimensionValue
} from 'react-native';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react-native';

export interface BottomSheetProps {
  isVisible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  height?: DimensionValue; 
}

export default function BottomSheet({
  isVisible,
  onClose,
  title,
  children,
  height = 'auto',
}: BottomSheetProps) {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1}
        onPress={onClose}
        className="bg-black/60 justify-end"
      >
        <TouchableWithoutFeedback>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            className={cn(
              'bg-white w-full rounded-t-3xl shadow-xl overflow-hidden',
              height === 'auto' ? 'max-h-[85%]' : ''
            )}
            style={{ height: height === 'auto' ? undefined : height }}
          >
            
            <View className="px-6 pt-5 pb-3 flex-row items-center justify-between border-b border-gray-100 bg-white z-10">
              <View className="flex-1 pr-4">
                {title && (
                  <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                    {title}
                  </Text>
                )}
              </View>
              
              <TouchableOpacity 
                onPress={onClose}
                className="p-2 bg-gray-100 rounded-full active:bg-gray-200"
                accessibilityLabel="Fermer"
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            <View className="absolute top-2 left-1/2 -ml-5 w-10 h-1 bg-gray-300 rounded-full" />

            <ScrollView 
              contentContainerStyle={{ padding: 24, paddingBottom: 40 }}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {children}
            </ScrollView>

          </KeyboardAvoidingView>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </Modal>
  );
}