import { useState, useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { usersApi } from '@/lib/api/users';
import type { DashboardData } from '@/types';

export function useDashboard() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboard = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const dashboardData = await usersApi.dashboard();
      setData(dashboardData);
    } catch (err: any) {
      setError(
        err instanceof Error 
          ? err.message 
          : typeof err === 'string' 
            ? err 
            : 'Erreur lors du chargement du dashboard'
      );
    } finally {
      setIsLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      fetchDashboard();
    }, [fetchDashboard])
  );

  return {
    data,
    isLoading,
    error,
    refresh: fetchDashboard,
  };
}