import { useCallback, useEffect } from 'react';
import { useAddressStore } from '@/lib/store/addressStore';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour gérer l'adresse de l'utilisateur
 */
export function useAddress() {
  const address = useAddressStore((state) => state.address);
  const modificationInfo = useAddressStore((state) => state.modificationInfo);
  const isLoading = useAddressStore((state) => state.isLoading);
  const error = useAddressStore((state) => state.error);
  
  const fetchModificationInfo = useAddressStore((state) => state.fetchModificationInfo);
  const updateAddress = useAddressStore((state) => state.updateAddress);
  const clearError = useAddressStore((state) => state.clearError);

  return {
    address,
    modificationInfo,
    isLoading,
    error,
    fetchModificationInfo,
    updateAddress,
    clearError,
  };
}

/**
 * Hook pour charger automatiquement les infos de modification
 */
export function useAddressModificationInfo() {
  const { modificationInfo, isLoading, error, fetchModificationInfo } = useAddress();

  useFocusEffect(
    useCallback(() => {
      fetchModificationInfo();
    }, [fetchModificationInfo])
  );

  return {
    modificationInfo,
    isLoading,
    error,
    refetch: fetchModificationInfo,
  };
}

/**
 * Hook pour vérifier si l'utilisateur peut modifier son adresse
 * (Logique pure, pas de changement nécessaire)
 */
export function useCanModifyAddress() {
  const { modificationInfo } = useAddress();
  
  return {
    canModify: modificationInfo?.canModify ?? true,
    daysRemaining: modificationInfo?.daysRemaining ?? 0,
    nextModificationDate: modificationInfo?.nextModificationDate,
    message: modificationInfo?.message,
  };
}