import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle } from 'lucide-react-native';
import Modal, { ModalFooter } from '../ui/Modal';
import Button from '../ui/Button';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  variant?: 'danger' | 'warning' | 'info';
  isLoading?: boolean;
}

export default function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmLabel = 'Confirmer',
  cancelLabel = 'Annuler',
  variant = 'danger',
  isLoading = false,
}: ConfirmDialogProps) {
  const variantConfig = {
    danger: {
      bgClass: 'bg-red-100 dark:bg-red-900/20',
      iconClass: 'text-red-600 dark:text-red-400',
    },
    warning: {
      bgClass: 'bg-amber-100 dark:bg-amber-900/20',
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
    info: {
      bgClass: 'bg-blue-100 dark:bg-blue-900/20',
      iconClass: 'text-blue-600 dark:text-blue-400',
    },
  };

  const config = variantConfig[variant];

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <View className="p-6">
        {/* Header avec icône */}
        <View className="flex-row items-start gap-4 mb-4">
          {/* Icône variant */}
          <View
            className={`w-12 h-12 rounded-full items-center justify-center ${config.bgClass}`}
          >
            <AlertTriangle size={24} className={config.iconClass} />
          </View>

          {/* Texte */}
          <View className="flex-1">
            <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              {title}
            </Text>
            <Text className="text-gray-600 dark:text-gray-400 leading-5">
              {message}
            </Text>
          </View>
        </View>

        {/* Footer avec boutons */}
        <ModalFooter className="px-0 py-0 border-0">
          <View className="flex-row gap-3 w-full">
            <View className="flex-1">
              <Button
                variant="outline"
                onPress={onClose}
                disabled={isLoading}
              >
                {cancelLabel}
              </Button>
            </View>
            
            <View className="flex-1">
              <Button
                variant={variant === 'danger' ? 'danger' : 'primary'}
                onPress={onConfirm}
                isLoading={isLoading}
              >
                {confirmLabel}
              </Button>
            </View>
          </View>
        </ModalFooter>
      </View>
    </Modal>
  );
}