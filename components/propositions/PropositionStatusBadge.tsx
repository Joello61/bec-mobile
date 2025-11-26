import React from 'react';
import { View, Text } from 'react-native';
import { Clock, CheckCircle, XCircle } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';
import type { PropositionStatut } from '@/types';

interface PropositionStatusBadgeProps {
  statut: PropositionStatut;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export function PropositionStatusBadge({
  statut,
  className,
  size = 'md',
}: PropositionStatusBadgeProps) {
  const config = {
    en_attente: {
      label: 'En attente',
      icon: Clock,
      className: 'bg-amber-100 dark:bg-amber-900/20 border-amber-200 dark:border-amber-800',
      textClass: 'text-amber-700 dark:text-amber-400',
      iconClass: 'text-amber-600 dark:text-amber-400',
    },
    acceptee: {
      label: 'Acceptée',
      icon: CheckCircle,
      className: 'bg-green-100 dark:bg-green-900/20 border-green-200 dark:border-green-800',
      textClass: 'text-green-700 dark:text-green-400',
      iconClass: 'text-green-600 dark:text-green-400',
    },
    refusee: {
      label: 'Refusée',
      icon: XCircle,
      className: 'bg-red-100 dark:bg-red-900/20 border-red-200 dark:border-red-800',
      textClass: 'text-red-700 dark:text-red-400',
      iconClass: 'text-red-600 dark:text-red-400',
    },
    annulee: {
      label: 'Annulée',
      icon: XCircle,
      className: 'bg-gray-100 dark:bg-gray-800 border-gray-200 dark:border-gray-700',
      textClass: 'text-gray-700 dark:text-gray-400',
      iconClass: 'text-gray-600 dark:text-gray-400',
    },
  };

  const { label, icon: Icon, className: statusClass, textClass, iconClass } = config[statut];

  const sizeConfig = {
    sm: {
      containerClass: 'px-2 py-0.5',
      iconSize: 12,
      textClass: 'text-xs',
    },
    md: {
      containerClass: 'px-3 py-1',
      iconSize: 14,
      textClass: 'text-xs',
    },
    lg: {
      containerClass: 'px-4 py-1.5',
      iconSize: 16,
      textClass: 'text-sm',
    },
  };

  const { containerClass, iconSize, textClass: sizeTextClass } = sizeConfig[size];

  return (
    <View
      className={cn(
        'flex-row items-center gap-1.5 rounded-full border self-start',
        statusClass,
        containerClass,
        className
      )}
    >
      <Icon size={iconSize} className={iconClass} />
      <Text className={cn('font-medium', textClass, sizeTextClass)}>
        {label}
      </Text>
    </View>
  );
}