import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { Info } from 'lucide-react-native';
import { useCurrencyFormat } from '@/lib/hooks/useCurrencyFormat';
import type { ConvertedAmount } from '@/types';

interface CurrencyDisplayProps {
  amount: number | string;
  currency: string;
  converted?: ConvertedAmount;
  viewerCurrency?: string;
  showOriginal?: boolean;
  field?: 'prixParKilo' | 'commission';
  className?: string;
  compact?: boolean;
  onInfoPress?: () => void; // Callback pour afficher un tooltip/modal sur mobile
}

export default function CurrencyDisplay({
  amount,
  currency,
  converted,
  viewerCurrency,
  showOriginal = true,
  field = 'prixParKilo',
  className = '',
  compact = false,
  onInfoPress,
}: CurrencyDisplayProps) {
  const { formatPrice, formatAmount } = useCurrencyFormat();

  // Vérifier si une conversion est disponible et applicable
  const hasConversion =
    converted &&
    converted.targetCurrency === viewerCurrency &&
    currency !== viewerCurrency;

  // Montant à afficher
  const displayAmount = hasConversion
    ? formatPrice(amount, currency, converted, field)
    : formatAmount(amount, currency);

  // Pas de conversion ou tooltip désactivé
  if (!hasConversion || !showOriginal) {
    return (
      <Text className={`font-bold text-gray-900 dark:text-white ${className}`}>
        {displayAmount}
      </Text>
    );
  }

  // Mode compact (pour les cards mobiles)
  if (compact) {
    return (
      <View className="flex-row items-center gap-1.5">
        <Text className={`font-bold text-gray-900 dark:text-white ${className}`}>
          {displayAmount}
        </Text>
        
        {/* Icône info optionnelle */}
        {onInfoPress && (
          <Pressable
            onPress={onInfoPress}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Info 
              size={14} 
              className="text-gray-400 dark:text-gray-500" 
            />
          </Pressable>
        )}
      </View>
    );
  }

  // Mode normal avec possibilité d'info
  return (
    <View className="flex-row items-center gap-2">
      <Text className={`font-bold text-gray-900 dark:text-white ${className}`}>
        {displayAmount}
      </Text>
      
      {/* Bouton info pour afficher les détails de conversion */}
      {onInfoPress && (
        <Pressable
          onPress={onInfoPress}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          className="active:opacity-60"
        >
          <Info 
            size={16} 
            className="text-gray-400 dark:text-gray-500" 
          />
        </Pressable>
      )}
    </View>
  );
}