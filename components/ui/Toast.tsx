import React, { createContext, useContext, useState, useCallback, useRef } from 'react';
import { View, Text, TouchableOpacity, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';

// === 1. TYPES ===

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastData {
  id: string;
  title: string;
  message: string;
  type: ToastType;
  duration?: number;
}

interface ToastContextType {
  show: (params: Omit<ToastData, 'id'>) => void;
  hide: (id: string) => void;
}

// === 2. CONTEXTE ===

const ToastContext = createContext<ToastContextType | null>(null);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
};

// === 3. COMPOSANT VISUEL (ITEM) ===

const ToastItem = ({ notification, onDismiss }: { notification: ToastData; onDismiss: (id: string) => void }) => {
  const { id, title, message, type = 'info' } = notification;

  const styles = {
    success: {
      bg: 'bg-white border-l-4 border-l-success',
      icon: <CheckCircle size={24} color="#00695c" />,
      title: 'text-success',
    },
    error: {
      bg: 'bg-white border-l-4 border-l-error',
      icon: <AlertCircle size={24} color="#ef4444" />,
      title: 'text-error',
    },
    warning: {
      bg: 'bg-white border-l-4 border-l-warning',
      icon: <AlertTriangle size={24} color="#f59e0b" />,
      title: 'text-warning-dark',
    },
    info: {
      bg: 'bg-white border-l-4 border-l-info',
      icon: <Info size={24} color="#0ea5e9" />,
      title: 'text-info',
    },
  };

  const currentStyle = styles[type];

  return (
    <Animated.View
      entering={FadeInUp.duration(300)}
      exiting={FadeOutUp.duration(300)}
      // ✅ CORRECTION : Utilisation de LinearTransition au lieu de Layout
      layout={LinearTransition.springify()}
      className={cn(
        'mx-4 mb-3 p-4 rounded-lg shadow-sm elevation-3 flex-row items-start',
        currentStyle.bg
      )}
    >
      <View className="mr-3 mt-0.5">
        {currentStyle.icon}
      </View>

      <View className="flex-1 mr-2">
        <Text className={cn('font-bold text-base mb-1', currentStyle.title)}>
          {title}
        </Text>
        <Text className="text-gray-600 text-sm leading-5">
          {message}
        </Text>
      </View>

      <TouchableOpacity
        onPress={() => onDismiss(id)}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <X size={20} color="#9ca3af" />
      </TouchableOpacity>
    </Animated.View>
  );
};

// === 4. PROVIDER (Gestionnaire d'état) ===

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([]);
  const insets = useSafeAreaInsets();

  const hide = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const show = useCallback((params: Omit<ToastData, 'id'>) => {
    const id = Date.now().toString() + Math.random().toString();
    const newToast = { ...params, id };

    setToasts((prev) => [...prev, newToast]);

    if (params.duration !== 0) {
      setTimeout(() => {
        hide(id);
      }, params.duration || 4000); // 4s par défaut
    }
  }, [hide]);

  return (
    <ToastContext.Provider value={{ show, hide }}>
      {children}
      
      {/* Container d'affichage (Z-Index élevé pour passer au dessus de tout) */}
      <View
        className="absolute left-0 right-0 z-[9999]"
        style={{ top: insets.top + 10 }}
        pointerEvents="box-none"
      >
        {toasts.map((toast) => (
          <ToastItem 
            key={toast.id} 
            notification={toast} 
            onDismiss={hide} 
          />
        ))}
      </View>
    </ToastContext.Provider>
  );
}