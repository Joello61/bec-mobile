import { useCallback, useEffect } from 'react';
import { useSignalementStore } from '@/lib/store/signalementStore';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour charger MES signalements (UTILISATEUR)
 */
export function useMesSignalements(page = 1, limit = 10, statut?: string) {
  const mesSignalements = useSignalementStore((state) => state.mesSignalements);
  const pagination = useSignalementStore((state) => state.pagination);
  const isLoading = useSignalementStore((state) => state.isLoading);
  const error = useSignalementStore((state) => state.error);
  const fetchMesSignalements = useSignalementStore((state) => state.fetchMesSignalements);

  useFocusEffect(
    useCallback(() => {
      fetchMesSignalements(page, limit, statut);
    }, [page, limit, statut, fetchMesSignalements])
  );

  const refetch = useCallback(() => {
    fetchMesSignalements(page, limit, statut);
  }, [page, limit, statut, fetchMesSignalements]);

  return {
    mesSignalements,
    pagination,
    isLoading,
    error,
    refetch
  };
}

/**
 * Hook pour les actions sur les signalements
 */
export function useSignalementActions() {
  const createSignalement = useSignalementStore((state) => state.createSignalement);
  const processSignalement = useSignalementStore((state) => state.processSignalement);
  const isLoading = useSignalementStore((state) => state.isLoading);
  const error = useSignalementStore((state) => state.error);
  const clearError = useSignalementStore((state) => state.clearError);

  return {
    createSignalement,
    processSignalement,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook pour le compteur de signalements en attente (Badge Admin)
 */
export function usePendingSignalements() {
  const pendingCount = useSignalementStore((state) => state.pendingCount);
  const fetchPendingCount = useSignalementStore((state) => state.fetchPendingCount);

  useFocusEffect(
    useCallback(() => {
      fetchPendingCount();
    }, [fetchPendingCount])
  );

  const refetch = useCallback(() => {
    fetchPendingCount();
  }, [fetchPendingCount]);

  return {
    pendingCount,
    refetch,
  };
}