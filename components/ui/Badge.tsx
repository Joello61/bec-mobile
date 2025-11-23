import React from 'react';
import { View, Text, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

export interface BadgeProps extends ViewProps {
  variant?: 'default' | 'success' | 'warning' | 'error' | 'info' | 'neutral';
  size?: 'sm' | 'md' | 'lg';
  dot?: boolean;
  children?: React.ReactNode;
}

export default function Badge({
  className,
  variant = 'default',
  size = 'md',
  dot = false,
  children,
  ...props
}: BadgeProps) {
  
  const baseContainerStyles = 'flex-row items-center justify-center rounded-full self-start';

  const containerVariants = {
    default: 'bg-primary/10',
    success: 'bg-success/10',
    warning: 'bg-warning/10',
    error: 'bg-error/10',
    info: 'bg-info/10',
    neutral: 'bg-gray-100',
  };

  const containerSizes = {
    sm: 'px-2 py-0.5',
    md: 'px-3 py-1',
    lg: 'px-4 py-1.5',
  };

  // 2. Styles du TEXTE (Text)
  const baseTextStyles = 'font-medium';

  const textVariants = {
    default: 'text-primary',
    success: 'text-success',
    warning: 'text-warning-dark',
    error: 'text-error',
    info: 'text-info',
    neutral: 'text-gray-700',
  };

  const textSizes = {
    sm: 'text-xs',
    md: 'text-sm',
    lg: 'text-base',
  };

  // 3. Styles du POINT (Dot)
  const dotVariants = {
    default: 'bg-primary',
    success: 'bg-success',
    warning: 'bg-warning',
    error: 'bg-error',
    info: 'bg-info',
    neutral: 'bg-gray-500',
  };

  return (
    <View
      className={cn(
        baseContainerStyles,
        containerVariants[variant],
        containerSizes[size],
        className
      )}
      {...props}
    >
      {dot && (
        <View
          className={cn(
            'w-2 h-2 rounded-full mr-1.5',
            dotVariants[variant]
          )}
        />
      )}
      
      <Text
        className={cn(
          baseTextStyles,
          textVariants[variant],
          textSizes[size]
        )}
      >
        {children}
      </Text>
    </View>
  );
}