import { useCallback, useEffect } from 'react';
import { useContactStore } from '@/lib/store/contactStore';
import { useAuth } from './useAuth';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour créer un contact (formulaire public)
 */
export function useCreateContact() {
  const createContact = useContactStore((state) => state.createContact);
  const isLoading = useContactStore((state) => state.isLoading);
  const error = useContactStore((state) => state.error);
  const successMessage = useContactStore((state) => state.successMessage);
  const clearError = useContactStore((state) => state.clearError);
  const clearSuccess = useContactStore((state) => state.clearSuccess);

  return {
    createContact,
    isLoading,
    error,
    successMessage,
    clearError,
    clearSuccess,
  };
}