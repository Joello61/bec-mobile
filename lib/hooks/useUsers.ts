import { useCallback, useEffect } from 'react';
import { useUserStore } from '@/lib/store/userStore';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour charger un utilisateur spécifique (Profil public ou autre user)
 */
export function useUser(id: number) {
  const currentUser = useUserStore((state) => state.currentUser);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const fetchUser = useUserStore((state) => state.fetchUser);

  useFocusEffect(
    useCallback(() => {
      if (id) {
        fetchUser(id);
      }
    }, [id, fetchUser])
  );

  return {
    user: currentUser,
    isLoading,
    error,
    refetch: () => fetchUser(id),
  };
}

/**
 * Hook pour rechercher des utilisateurs
 */
export function useSearchUsers(query: string) {
  const searchResults = useUserStore((state) => state.searchResults);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const searchUsers = useUserStore((state) => state.searchUsers);

  useEffect(() => {
    if (query && query.length >= 2) {
      const timeoutId = setTimeout(() => {
        searchUsers(query);
      }, 300); // Debounce de 300ms

      return () => clearTimeout(timeoutId);
    }
  }, [query, searchUsers]);

  return {
    users: searchResults,
    isLoading,
    error,
  };
}

/**
 * Hook pour mettre à jour le profil utilisateur
 */
export function useUpdateProfile() {
  const updateMe = useUserStore((state) => state.updateMe);
  const isLoading = useUserStore((state) => state.isLoading);
  const error = useUserStore((state) => state.error);
  const clearError = useUserStore((state) => state.clearError);

  return {
    updateMe,
    isLoading,
    error,
    clearError,
  };
}

/**
 * Hook pour gérer l'avatar (upload/delete)
 */
export function useAvatar() {
  const uploadAvatar = useUserStore((state) => state.uploadAvatar);
  const deleteAvatar = useUserStore((state) => state.deleteAvatar);
  const isUploadingAvatar = useUserStore((state) => state.isUploadingAvatar);
  const error = useUserStore((state) => state.error);
  const clearError = useUserStore((state) => state.clearError);
  const currentUser = useUserStore((state) => state.currentUser);

  return {
    uploadAvatar,
    deleteAvatar,
    isUploading: isUploadingAvatar,
    error,
    clearError,
    currentAvatar: currentUser?.photo || null,
  };
}