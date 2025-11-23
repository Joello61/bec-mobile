import React from 'react';
import { View, Text, TouchableOpacity, type ViewProps } from 'react-native';
import { cn } from '@/lib/utils/cn';

export interface CardProps extends ViewProps {
  variant?: 'default' | 'bordered' | 'elevated';
  hoverable?: boolean;
  onPress?: () => void;
}

export function Card({ 
  className, 
  variant = 'default',
  hoverable = false,
  onPress,
  children,
  ...props 
}: CardProps) {
  
  const variants = {
    default: 'bg-white rounded-lg', 
    bordered: 'bg-white rounded-lg border border-gray-200',
    elevated: 'bg-white rounded-lg shadow-sm border border-gray-100',
  };

  const Container = (hoverable || onPress) ? TouchableOpacity : View;

  return (
    <Container
      className={cn(
        variants[variant],
        'overflow-hidden', 
        className
      )}
      activeOpacity={hoverable || onPress ? 0.7 : 1}
      onPress={onPress}
      {...props as any}
    >
      {children}
    </Container>
  );
}

export interface CardHeaderProps extends ViewProps {
  title?: React.ReactNode;
  description?: React.ReactNode;
  action?: React.ReactNode;
}

export function CardHeader({ 
  className, 
  title,
  description,
  action,
  children,
  ...props 
}: CardHeaderProps) {
  return (
    <View className={cn('p-6 pb-4', className)} {...props}>
      <View className="flex-row items-start justify-between gap-4">
        <View className="flex-1">
          {title && (
            typeof title === 'string' ? (
              <Text className="text-xl font-semibold text-gray-900 mb-1">
                {title}
              </Text>
            ) : title
          )}
          
          {description && (
            typeof description === 'string' ? (
              <Text className="text-sm text-gray-500">
                {description}
              </Text>
            ) : description
          )}
          
          {children}
        </View>
        
        {action && <View>{action}</View>}
      </View>
    </View>
  );
}

export interface CardContentProps extends ViewProps {}

export function CardContent({ className, children, ...props }: CardContentProps) {
  return (
    <View className={cn('p-6 pt-0', className)} {...props}>
      {children}
    </View>
  );
}

export interface CardFooterProps extends ViewProps {}

export function CardFooter({ className, children, ...props }: CardFooterProps) {
  return (
    <View 
      className={cn('p-6 pt-4 border-t border-gray-100 flex-row items-center justify-between', className)} 
      {...props}
    >
      {children}
    </View>
  );
}