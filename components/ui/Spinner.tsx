import React from 'react';
import { ActivityIndicator, View, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

export interface SpinnerProps extends ViewProps {
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'secondary' | 'white' | 'neutral';
}

export default function Spinner({
  size = 'md',
  variant = 'primary',
  className,
  ...props
}: SpinnerProps) {
  
  // Mapping des couleurs
  const colors = {
    primary: '#00695c',   // Votre vert principal
    secondary: '#ffb300', // Votre jaune
    white: '#ffffff',
    neutral: '#9ca3af',   // Gris
  };

  const sizeMap: Record<string, 'small' | 'large'> = {
    sm: 'small',
    md: 'small', // Par défaut
    lg: 'large',
  };

  // Ajustement de l'échelle pour les tailles intermédiaires si besoin
  const scaleMap = {
    sm: 0.8,
    md: 1,
    lg: 1.2, // Un peu plus grand que le 'large' standard
  };

  return (
    <View 
      className={cn('items-center justify-center', className)} 
      {...props}
    >
      <ActivityIndicator 
        size={sizeMap[size]} 
        color={colors[variant]} 
        style={{ transform: [{ scale: scaleMap[size] }] }}
      />
    </View>
  );
}