import { useCallback } from 'react';
import type { ConvertedAmount } from '@/types'; 
import { useUserCurrency } from '@/lib/hooks/useCurrency';

/**
 * Hook pour formater les montants avec gestion de la conversion
 */
export function useCurrencyFormat() {
  const { userCurrency } = useUserCurrency();

  /**
   * Formate un montant selon une devise (sans conversion)
   */
  const formatAmount = useCallback((
    amount: number | string,
    currencyCode: string
  ): string => {
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) return '—';

    // Cas spécial pour le FCFA (pas de décimales)
    if (currencyCode === 'XAF' || currencyCode === 'XOF') {
      // Intl est supporté nativement grâce au moteur Hermes d'Expo
      return new Intl.NumberFormat('fr-FR', {
        style: 'decimal',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(numAmount) + ' FCFA';
    }

    // Autres devises
    try {
      return new Intl.NumberFormat('fr-FR', {
        style: 'currency',
        currency: currencyCode,
      }).format(numAmount);
    } catch (error) {
      // Fallback si la devise est inconnue ou erreur Intl
      return `${numAmount.toFixed(2)} ${currencyCode}`;
    }
  }, []);

  /**
   * Formate un prix en utilisant les montants convertis si disponibles
   */
  const formatPrice = useCallback((
    amount: number | string,
    currency: string,
    converted?: ConvertedAmount | null, // Ajout de | null pour la robustesse
    field: 'prixParKilo' | 'commission' = 'prixParKilo'
  ): string => {
    // Si converti et que la devise cible correspond à celle de l'utilisateur
    if (converted && converted.targetCurrency === userCurrency) {
      if (field === 'prixParKilo' && converted.prixParKiloFormatted) {
        return converted.prixParKiloFormatted;
      }
      if (field === 'commission' && converted.commissionFormatted) {
        return converted.commissionFormatted;
      }
    }

    // Sinon, formatage normal
    return formatAmount(amount, currency);
  }, [userCurrency, formatAmount]);

  /**
   * Récupère le symbole d'une devise
   */
  const getCurrencySymbol = useCallback((currencyCode: string): string => {
    const symbols: Record<string, string> = {
      EUR: '€',
      USD: '$',
      CAD: 'CAD $',
      GBP: '£',
      XAF: 'FCFA',
      XOF: 'FCFA',
      CHF: 'CHF',
      JPY: '¥',
      CNY: '¥',
    };
    return symbols[currencyCode.toUpperCase()] || currencyCode;
  }, []);

  /**
   * Vérifie si un montant doit être converti
   */
  const shouldConvert = useCallback((currency: string): boolean => {
    return currency.toUpperCase() !== userCurrency.toUpperCase();
  }, [userCurrency]);

  return {
    formatPrice,
    formatAmount,
    getCurrencySymbol,
    shouldConvert,
    userCurrency,
  };
}