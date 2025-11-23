import { useCallback } from 'react';
// ✅ CORRECTION : Import en kebab-case
import { useSettingsStore } from '@/lib/store/settingsStore';
import { useFocusEffect } from 'expo-router';

/**
 * Hook pour charger et gérer les paramètres utilisateur
 */
export function useSettings() {
  const settings = useSettingsStore((state) => state.settings);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  const fetchSettings = useSettingsStore((state) => state.fetchSettings);

  useFocusEffect(
    useCallback(() => {
      fetchSettings();
    }, [fetchSettings])
  );

  return {
    settings,
    isLoading,
    error,
    refetch: fetchSettings,
  };
}

/**
 * Hook pour les actions de modification des paramètres
 */
export function useSettingsActions() {
  const updateSettings = useSettingsStore((state) => state.updateSettings);
  const resetSettings = useSettingsStore((state) => state.resetSettings);
  const exportData = useSettingsStore((state) => state.exportData);
  const isLoading = useSettingsStore((state) => state.isLoading);
  const error = useSettingsStore((state) => state.error);
  const clearError = useSettingsStore((state) => state.clearError);

  return {
    updateSettings,
    resetSettings,
    exportData,
    isLoading,
    error,
    clearError,
  };
}