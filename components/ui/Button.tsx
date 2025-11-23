import React, { forwardRef } from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator, type TouchableOpacityProps } from 'react-native';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { cn } from '@/lib/utils/cn';

export interface ButtonProps extends TouchableOpacityProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

const Button = forwardRef<React.ComponentRef<typeof TouchableOpacity>, ButtonProps>(
  (
    {
      className,
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    const containerBase = 'flex-row items-center justify-center rounded-lg';
    
    const containerVariants = {
      primary: 'bg-primary active:opacity-90',
      secondary: 'bg-secondary active:opacity-90',
      outline: 'bg-transparent border border-primary active:bg-primary/10',
      ghost: 'bg-transparent active:bg-gray-100',
      danger: 'bg-error active:opacity-90',
    };

    const containerSizes = {
      sm: 'px-3 py-2',
      md: 'px-4 py-3',
      lg: 'px-6 py-4',
    };

    const textBase = 'font-medium text-center';

    const textVariants = {
      primary: 'text-white font-bold',
      secondary: 'text-gray-900 font-bold',
      outline: 'text-primary font-semibold',
      ghost: 'text-gray-900',
      danger: 'text-white font-bold',
    };

    const textSizes = {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    };

    const getLoaderColor = () => {
      if (variant === 'primary' || variant === 'danger') return 'white';
      if (variant === 'secondary') return '#212121';
      return '#00695c';
    };

    return (
      <TouchableOpacity
        ref={ref}
        className={cn(
          containerBase,
          containerVariants[variant],
          containerSizes[size],
          (disabled || isLoading) && 'opacity-50',
          className
        )}
        disabled={disabled || isLoading}
        activeOpacity={0.7}
        {...props}
      >
        {isLoading ? (
          <ActivityIndicator size="small" color={getLoaderColor()} />
        ) : (
          <>
            {leftIcon && <View className="mr-2">{leftIcon}</View>}
            
            <Text
              className={cn(
                textBase,
                textVariants[variant],
                textSizes[size]
              )}
            >
              {children}
            </Text>

            {rightIcon && <View className="ml-2">{rightIcon}</View>}
          </>
        )}
      </TouchableOpacity>
    );
  }
);

Button.displayName = 'Button';

export default Button;