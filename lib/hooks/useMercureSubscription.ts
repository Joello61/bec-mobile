import { useEffect } from 'react';
import { mercureService } from '@/lib/services/mercureService';
import type { StableContext } from '@/types/realtime';
import { EventType, EventTypeValue } from '@/lib/utils/eventType';
import { dispatchMercureEvent } from '../handlers';

/**
 * Hook global React Native pour initialiser la connexion Mercure
 * et écouter tous les flux principaux (globaux).
 */
export function useGlobalMercureSubscription(stable: StableContext) {
  useEffect(() => {
    if (!stable?.userId) return;

    const baseUrl = process.env.EXPO_PUBLIC_API_DOMAIN || process.env.API_BASE_URL;
    const isAdmin = Boolean(stable.isAdmin); // Toujours false sur mobile

    // Topics Mercure à écouter
    const topics = [
      `${baseUrl}/users/${stable.userId}`,    // Événements personnels
      `${baseUrl}/demandes`,                  // Nouvelles demandes publiques
      `${baseUrl}/voyages`,                   // Nouveaux voyages publics
      `${baseUrl}/propositions`,              // Propositions reçues/envoyées
      `${baseUrl}/public`,                    // Événements publics globaux
    ];

    // Ajouter les topics au service Mercure
    topics.forEach((topic) => mercureService.addTopic(topic));
    
    // Se connecter au hub Mercure
    mercureService.connect();

    console.log('[Mercure] Connecté aux topics globaux:', topics);

    // S'abonner à tous les types d'événements
    const eventTypes = Object.values(EventType) as EventTypeValue[];
    const unsubscribers = eventTypes.map((eventType) =>
      mercureService.on(eventType, (data: any) =>
        dispatchMercureEvent(eventType, data, stable)
      )
    );

    // Cleanup : déconnexion et nettoyage
    return () => {
      console.log('[Mercure] Déconnexion et nettoyage des listeners');
      unsubscribers.forEach((unsub) => unsub());
      mercureService.disconnect();
    };
  }, [stable.userId, stable.isAdmin]);
}