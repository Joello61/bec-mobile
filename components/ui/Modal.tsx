import React from 'react';
import { 
  Modal as RNModal, 
  View, 
  Text, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  ScrollView,
  Platform,
  type ViewProps
} from 'react-native';
import { cn } from '@/lib/utils/cn';
import { X } from 'lucide-react-native';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'full';
  showCloseButton?: boolean;
  closeOnOverlayClick?: boolean;
}

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  size = 'md',
  showCloseButton = true,
  closeOnOverlayClick = true,
}: ModalProps) {

  // Mapping des tailles Web vers des largeurs Mobile
  const sizeClasses = {
    sm: 'w-[85%] max-w-[320px]',
    md: 'w-[90%] max-w-[400px]',
    lg: 'w-[95%] max-w-[600px]',
    xl: 'w-[95%] max-w-[800px]',
    full: 'w-full h-full rounded-none', // Mode plein écran
  };

  return (
    <RNModal
      visible={isOpen}
      transparent={true}
      animationType="fade" // Animation d'apparition standard
      onRequestClose={onClose} // Gère le bouton retour Android
      statusBarTranslucent // L'overlay couvre aussi la barre d'état
    >
      {/* 1. OVERLAY (Fond sombre) */}
      <TouchableOpacity
        style={{ flex: 1 }}
        activeOpacity={1} // Pas d'effet visuel au clic sur le fond
        onPress={closeOnOverlayClick ? onClose : undefined}
        className="bg-black/60 items-center justify-center p-4"
      >
        {/* 2. PROTECTION (Empêche la fermeture au clic sur la modale) */}
        <TouchableWithoutFeedback>
          <View
            className={cn(
              'bg-white rounded-xl shadow-xl overflow-hidden max-h-[85%]',
              sizeClasses[size]
            )}
          >
            {/* 3. HEADER */}
            {(title || showCloseButton) && (
              <View className="flex-row items-center justify-between px-5 py-4 border-b border-gray-100">
                <View className="flex-1">
                  {title && (
                    <Text className="text-lg font-bold text-gray-900" numberOfLines={1}>
                      {title}
                    </Text>
                  )}
                </View>
                
                {showCloseButton && (
                  <TouchableOpacity
                    onPress={onClose}
                    className="p-1 bg-gray-100 rounded-full active:bg-gray-200 ml-3"
                    hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }} // Agrandit la zone tactile
                  >
                    <X size={20} color="#6b7280" />
                  </TouchableOpacity>
                )}
              </View>
            )}

            {/* 4. CONTENT (Scrollable si trop long) */}
            <ScrollView 
              contentContainerStyle={{ padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {children}
            </ScrollView>

          </View>
        </TouchableWithoutFeedback>
      </TouchableOpacity>
    </RNModal>
  );
}

// === MODAL FOOTER ===
export interface ModalFooterProps extends ViewProps {
  children: React.ReactNode;
}

export function ModalFooter({ children, className, ...props }: ModalFooterProps) {
  return (
    <View 
      className={cn('px-5 py-4 border-t border-gray-100 flex-row justify-end gap-3 bg-gray-50', className)} 
      {...props}
    >
      {children}
    </View>
  );
}