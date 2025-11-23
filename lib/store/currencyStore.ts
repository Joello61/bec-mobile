import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { currenciesApi } from '@/lib/api/currencies';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { Currency, ConversionInfo } from '@/types';

interface CurrencyState {
  currencies: Currency[];
  popularCurrencies: Currency[];
  defaultCurrency: string;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchCurrencies: () => Promise<void>;
  fetchPopularCurrencies: (limit?: number) => Promise<void>;
  getCurrency: (code: string) => Promise<Currency | null>;
  convert: (amount: number, from: string, to: string) => Promise<ConversionInfo | null>;
  detectByCountry: (country: string) => Promise<string | null>;
  formatAmount: (amount: number, currency: string) => Promise<string | null>;
  updateRates: () => Promise<void>;
  clearError: () => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set, get) => ({
      currencies: [],
      popularCurrencies: [],
      defaultCurrency: 'EUR',
      isLoading: false,
      error: null,

      fetchCurrencies: async () => {
        set({ isLoading: true, error: null });
        try {
          const currencies = await currenciesApi.getAll();
          set({ currencies, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des devises', 
            isLoading: false 
          });
        }
      },

      fetchPopularCurrencies: async (limit = 5) => {
        set({ isLoading: true, error: null });
        try {
          const popularCurrencies = await currenciesApi.getPopular(limit);
          set({ popularCurrencies, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des devises populaires', 
            isLoading: false 
          });
        }
      },

      getCurrency: async (code: string) => {
        // Chercher d'abord dans le cache local
        const cached = get().currencies.find(c => c.code === code.toUpperCase());
        if (cached) return cached;

        // Sinon, appeler l'API
        set({ isLoading: true, error: null });
        try {
          const currency = await currenciesApi.getByCode(code);
          
          // Mettre à jour le cache local
          set((state) => ({
            currencies: [...state.currencies.filter(c => c.code !== currency.code), currency],
            isLoading: false
          }));
          
          return currency;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement de la devise', 
            isLoading: false 
          });
          return null;
        }
      },

      convert: async (amount: number, from: string, to: string) => {
        if (from.toUpperCase() === to.toUpperCase()) {
          // Pas de conversion nécessaire
          const currency = await get().getCurrency(from);
          if (!currency) return null;

          return {
            originalAmount: amount,
            originalCurrency: from.toUpperCase(),
            originalFormatted: `${amount.toFixed(currency.decimals)} ${currency.symbol}`,
            convertedAmount: amount,
            convertedCurrency: to.toUpperCase(),
            convertedFormatted: `${amount.toFixed(currency.decimals)} ${currency.symbol}`,
            exchangeRate: '1.000000',
          };
        }

        set({ isLoading: true, error: null });
        try {
          const conversionInfo = await currenciesApi.convert(amount, from, to);
          set({ isLoading: false });
          return conversionInfo;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la conversion', 
            isLoading: false 
          });
          return null;
        }
      },

      detectByCountry: async (country: string) => {
        set({ isLoading: true, error: null });
        try {
          const result = await currenciesApi.detectByCountry(country);
          set({ isLoading: false });
          return result.currencyCode;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la détection de la devise', 
            isLoading: false 
          });
          return null;
        }
      },

      formatAmount: async (amount: number, currency: string) => {
        set({ isLoading: true, error: null });
        try {
          const formatted = await currenciesApi.format(amount, currency);
          set({ isLoading: false });
          return formatted;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du formatage', 
            isLoading: false 
          });
          return null;
        }
      },

      updateRates: async () => {
        set({ isLoading: true, error: null });
        try {
          await currenciesApi.updateRates();
          // Recharger les devises après la mise à jour pour avoir les taux frais
          await get().fetchCurrencies();
          set({ isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la mise à jour des taux', 
            isLoading: false 
          });
        }
      },

      clearError: () => set({ error: null }),
    }),
    {
      name: STORAGE_KEYS.CURRENCY_STORE,
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await storage.getItem(name);
          return value;
        },
        setItem: async (name: string, value: string) => {
          await storage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          await storage.removeItem(name);
        },
      })),
      partialize: (state) => ({
        currencies: state.currencies,
        popularCurrencies: state.popularCurrencies,
        defaultCurrency: state.defaultCurrency,
      }),
    }
  )
);