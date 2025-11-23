import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { addressApi } from '@/lib/api/address';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { 
  Address, 
  AddressModificationInfo, 
  UpdateAddressInput 
} from '@/types/address';

interface AddressState {
  address: Address | null;
  modificationInfo: AddressModificationInfo | null;
  isLoading: boolean;
  error: string | null;

  // Actions
  fetchModificationInfo: () => Promise<void>;
  updateAddress: (data: UpdateAddressInput) => Promise<void>;
  setAddress: (address: Address | null) => void;
  clearError: () => void;
  reset: () => void;
}

export const useAddressStore = create<AddressState>()(
  persist(
    (set) => ({
      address: null,
      modificationInfo: null,
      isLoading: false,
      error: null,

      fetchModificationInfo: async () => {
        set({ isLoading: true, error: null });
        try {
          const info = await addressApi.getModificationInfo();
          set({ 
            modificationInfo: info,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des informations',
            isLoading: false 
          });
        }
      },

      updateAddress: async (data: UpdateAddressInput) => {
        set({ isLoading: true, error: null });
        try {
          const response = await addressApi.updateAddress(data);
          set({ 
            address: response.address,
            isLoading: false 
          });
          
          // Recharger les infos de modification pour mettre à jour les quotas/dates
          const info = await addressApi.getModificationInfo();
          set({ modificationInfo: info });
          
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la mise à jour de l\'adresse',
            isLoading: false 
          });
          throw error;
        }
      },

      setAddress: (address) => set({ address }),

      clearError: () => set({ error: null }),

      reset: () => set({ 
        address: null,
        modificationInfo: null,
        error: null 
      }),
    }),
    {
      name: STORAGE_KEYS.ADDRESS_STORE,
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
        address: state.address,
        modificationInfo: state.modificationInfo,
      }),
    }
  )
);