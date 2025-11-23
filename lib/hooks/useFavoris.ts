import { useCallback, useEffect } from 'react';
import { useFavoriStore } from '@/lib/store/favoriStore';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour gérer tous les favoris
 */
export function useFavoris() {
  const favoris = useFavoriStore((state) => state.favoris);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const error = useFavoriStore((state) => state.error);
  const fetchFavoris = useFavoriStore((state) => state.fetchFavoris);

  useFocusEffect(
    useCallback(() => {
      fetchFavoris();
    }, [fetchFavoris])
  );

  const refetch = useCallback(() => {
    fetchFavoris();
  }, [fetchFavoris]);

  return {
    favoris,
    isLoading,
    error,
    refetch,
  };
}

/**
 * Hook pour gérer les favoris voyages
 */
export function useFavorisVoyages() {
  const favorisVoyages = useFavoriStore((state) => state.favorisVoyages);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const fetchFavorisVoyages = useFavoriStore((state) => state.fetchFavorisVoyages);

  useFocusEffect(
    useCallback(() => {
      fetchFavorisVoyages();
    }, [fetchFavorisVoyages])
  );

  const refetch = useCallback(() => {
    fetchFavorisVoyages();
  }, [fetchFavorisVoyages]);

  return {
    favorisVoyages,
    isLoading,
    refetch,
  };
}

/**
 * Hook pour gérer les favoris demandes
 */
export function useFavorisDemandes() {
  const favorisDemandes = useFavoriStore((state) => state.favorisDemandes);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const fetchFavorisDemandes = useFavoriStore((state) => state.fetchFavorisDemandes);

  useEffect(() => {
    fetchFavorisDemandes();
  }, [fetchFavorisDemandes]);

  const refetch = useCallback(() => {
    fetchFavorisDemandes();
  }, [fetchFavorisDemandes]);

  return {
    favorisDemandes,
    isLoading,
    refetch
  };
}

/**
 * Hook pour les actions sur les favoris
 */
export function useFavoriActions() {
  const addVoyageToFavoris = useFavoriStore((state) => state.addVoyageToFavoris);
  const addDemandeToFavoris = useFavoriStore((state) => state.addDemandeToFavoris);
  const removeFavori = useFavoriStore((state) => state.removeFavori);
  const isFavoriVoyage = useFavoriStore((state) => state.isFavoriVoyage);
  const isFavoriDemande = useFavoriStore((state) => state.isFavoriDemande);
  const isLoading = useFavoriStore((state) => state.isLoading);
  const error = useFavoriStore((state) => state.error);

  return {
    addVoyageToFavoris,
    addDemandeToFavoris,
    removeFavori,
    isFavoriVoyage,
    isFavoriDemande,
    isLoading,
    error,
  };
}