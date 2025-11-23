import { Router } from 'expo-router';
import type { User } from '@/types/user';

/**
 * Type global partagé entre tous les handlers d'événements Mercure pour React Native.
 */
export interface StableContext {
  // === Données utilisateur ===
  userId: number;
  user?: User;
  isAdmin?: boolean;

  router: Router;

  refetchNotif?: () => void;
  refetchNotifCount?: () => void;
  
  refetchConvs?: () => void;
  refetchMessageCount?: () => void;
  
  refetchDemandes?: () => void;
  refetchUserDemandes?: (userId: number) => void;
  
  refetchVoyages?: () => void;
  refetchUserVoyages?: (userId: number) => void;
  
  refetchFavoris?: () => void;
  refetchFavorisDemandes?: () => void;
  refetchFavorisVoyages?: () => void;
  
  refetchUser?: () => void;
  
  // === Admin & Support ===
  refetchAdminStats?: () => void;
  refetchUsers?: () => void;
  refetchContacts?: () => void;
  refetchSignalements?: () => void;

  // === Propositions & Avis ===
  refetchPropositions?: () => void;
  refetchPropositionsVoyage?: (voyageId: number) => void;
  refetchUserAvis?: (userId: number) => void;

  // === Helpers ===
  logEvent?: (type: string, data: any) => void;
}