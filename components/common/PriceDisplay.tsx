import React from 'react';
import { View, Text } from 'react-native';
import { DollarSign, Package } from 'lucide-react-native';
import CurrencyDisplay from './CurrencyDisplay';
import type { ConvertedAmount } from '@/types';
import { cn } from '@/lib/utils/cn';

interface PriceDisplayProps {
  prixParKilo?: string | null;
  commission?: string | null;
  currency: string;
  converted?: ConvertedAmount;
  viewerCurrency?: string;
  layout?: 'horizontal' | 'vertical';
  showIcons?: boolean;
  compact?: boolean; // Mode compact pour cards mobiles
  className?: string;
}

/**
 * Composant pour afficher les prix (par kilo et commission) avec conversion
 * Mode compact optimisé pour les cards mobiles
 */
export default function PriceDisplay({
  prixParKilo,
  commission,
  currency,
  converted,
  viewerCurrency,
  layout = 'vertical',
  showIcons = true,
  compact = false,
  className = '',
}: PriceDisplayProps) {
  
  // ==================== MODE COMPACT (Cards Mobiles) ====================
  if (compact) {
    // Afficher UNIQUEMENT le prix principal (prixParKilo OU commission)
    const mainPrice = prixParKilo || commission;
    const mainField = prixParKilo ? 'prixParKilo' : 'commission';

    if (!mainPrice) {
      return (
        <Text className="text-sm text-muted italic">
          Prix non spécifié
        </Text>
      );
    }

    // Format compact : montant + suffix (/kg)
    return (
      <View className={cn('flex flex-row items-center gap-1', className)}>
        <CurrencyDisplay
          amount={mainPrice}
          currency={currency}
          converted={converted}
          viewerCurrency={viewerCurrency}
          field={mainField}
          className="text-lg font-bold text-primary"
          compact={true}
        />
        {prixParKilo && (
          <Text className="text-sm text-muted">/kg</Text>
        )}
      </View>
    );
  }

  // ==================== MODE NORMAL (Pages détails) ====================
  const containerClass = layout === 'horizontal' 
    ? 'flex flex-row gap-4' 
    : 'flex flex-col gap-3';

  return (
    <View className={cn(containerClass, className)}>
      {/* Prix par kilo */}
      {prixParKilo && (
        <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary/20">
          <View className="flex flex-row items-center justify-between gap-3">
            <View className="flex flex-row items-center gap-2 flex-1">
              {showIcons && (
                <DollarSign size={18} className="text-primary" />
              )}
              <Text className="text-sm font-medium text-foreground">
                Prix par kilo
              </Text>
            </View>
            <CurrencyDisplay
              amount={prixParKilo}
              currency={currency}
              converted={converted}
              viewerCurrency={viewerCurrency}
              field="prixParKilo"
              className="text-lg text-primary font-semibold"
            />
          </View>
        </View>
      )}

      {/* Commission bagage */}
      {commission && (
        <View className="bg-primary/10 rounded-lg px-4 py-3 border border-primary/20">
          <View className="flex flex-row items-center justify-between gap-3">
            <View className="flex flex-row items-center gap-2 flex-1">
              {showIcons && (
                <Package size={18} className="text-primary" />
              )}
              <Text className="text-sm font-medium text-foreground">
                Commission bagage
              </Text>
            </View>
            <CurrencyDisplay
              amount={commission}
              currency={currency}
              converted={converted}
              viewerCurrency={viewerCurrency}
              field="commission"
              className="text-lg text-primary font-semibold"
            />
          </View>
        </View>
      )}

      {/* Aucun prix */}
      {!prixParKilo && !commission && (
        <Text className="text-sm text-muted italic">
          Aucun prix spécifié
        </Text>
      )}
    </View>
  );
}