import React, { forwardRef } from 'react';
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

export interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  required?: boolean;
}

const Input = forwardRef<React.ComponentRef<typeof TextInput>, InputProps>(
  (
    {
      className,
      label,
      error,
      helperText,
      leftIcon,
      rightIcon,
      required,
      style,
      ...props
    },
    ref
  ) => {
    
    // Styles de base du TextInput
    const baseInputStyles = 'w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900';

    return (
      <View className="w-full mb-4">
        {/* 1. LABEL */}
        {label && (
          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <Text className="text-error ml-1">*</Text>}
          </Text>
        )}

        {/* 2. CONTAINER RELATIF (Pour les icônes) */}
        <View className="relative flex-row items-center">
          
          {/* Icône Gauche */}
          {leftIcon && (
            <View className="absolute left-3 z-10 justify-center h-full">
              {/* On peut wrapper l'icône pour forcer la couleur si besoin */}
              {leftIcon}
            </View>
          )}

          {/* Champ de saisie */}
          <TextInput
            ref={ref}
            className={cn(
              baseInputStyles,
              leftIcon && 'pl-10',   // Espace pour l'icône gauche
              rightIcon && 'pr-10',  // Espace pour l'icône droite
              error && 'border-error text-error', // Style d'erreur
              className
            )}
            placeholderTextColor="#9ca3af" // gray-400
            {...props}
          />

          {/* Icône Droite */}
          {rightIcon && (
            <View className="absolute right-3 z-10 justify-center h-full">
              {rightIcon}
            </View>
          )}
        </View>

        {/* 3. MESSAGES (Erreur ou Aide) */}
        {error ? (
          <Text className="mt-1 text-sm text-error font-medium">
            {error}
          </Text>
        ) : helperText ? (
          <Text className="mt-1 text-sm text-gray-500">
            {helperText}
          </Text>
        ) : null}
      </View>
    );
  }
);

Input.displayName = 'Input';

export default Input;