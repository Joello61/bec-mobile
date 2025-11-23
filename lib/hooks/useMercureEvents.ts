import { useEffect, useMemo } from 'react';
import { useRouter } from 'expo-router';
import type { StableContext } from '@/types/realtime';

import { useGlobalMercureSubscription } from './useMercureSubscription';
import { useNotifications } from './useNotifications';
import { useAuth } from './useAuth';
import { useConversations } from './useConversations';
import { useDemandes } from './useDemandes';
import { useFavoris } from './useFavoris';
import { useVoyages } from './useVoyages';

export function useMercureEvents() {
  const router = useRouter();
  const { isAuthenticated, user } = useAuth();

  // === Récupération de tous les hooks refetch ===
  const { refetch: refetchNotif } = useNotifications();
  const { refetch: refetchConvs } = useConversations();
  const { refetch: refetchDemandes } = useDemandes();
  const { refetch: refetchVoyages } = useVoyages();
  const { refetch: refetchFavoris } = useFavoris();

  // === Contexte stable partagé pour tous les handlers ===
  const stable = useMemo<StableContext>(
    () => ({
      userId: user?.id ?? 0,
      user: user ?? undefined,
      isAdmin: false,
      router,
      refetchNotif,
      refetchConvs,
      refetchDemandes,
      refetchVoyages,
      refetchFavoris,
    }),
    [
      user,
      router,
      refetchNotif,
      refetchConvs,
      refetchDemandes,
      refetchVoyages,
      refetchFavoris,
    ]
  );

  // Hook de souscription Mercure (appelé directement)
  useGlobalMercureSubscription(stable);

  // Simple log d'état
  useEffect(() => {
    console.log('[Mercure] Prêt à dispatcher les événements via handlers...');
  }, []);
}