import { StableContext } from '@/types/realtime';

// === Import de tous les handlers ===
import { handleUserEvents } from './userHandlers';
import { handleVoyageEvents } from './voyageHandlers';
import { handleDemandeEvents } from './demandeHandlers';
import { handlePropositionEvents } from './propositionHandlers';
import { handleMessageEvents } from './messageHandlers';
import { handleNotificationEvents } from './notificationHandlers';
import { handleSignalementEvents } from './signalementHandlers';
import { handleAvisEvents } from './avisHandlers';
import { handleFavoriEvents } from './favoriHandlers';
import { handleSettingsEvents } from './settingsHandlers';

/**
 * Routeur global des événements Mercure → Handler approprié
 */
export const dispatchMercureEvent = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  try {
    console.debug(`[Mercure Dispatch] Event received: ${eventType}`);

    switch (true) {
        
      case eventType.startsWith('user.'):
        await handleUserEvents(eventType, data, stable);
        break;

      case eventType.startsWith('voyage.'):
        await handleVoyageEvents(eventType, data, stable);
        break;

      case eventType.startsWith('demande.'):
        await handleDemandeEvents(eventType, data, stable);
        break;

      case eventType.startsWith('proposition.'):
        await handlePropositionEvents(eventType, data, stable);
        break;

      // Gestion unifiée des messages et conversations
      case eventType.startsWith('message.') || eventType.startsWith('conversation.'):
        await handleMessageEvents(eventType, data, stable);
        break;

      case eventType.startsWith('notification.'):
        await handleNotificationEvents(eventType, data, stable);
        break;

      case eventType.startsWith('signalement.'):
        await handleSignalementEvents(eventType, data, stable);
        break;

      case eventType.startsWith('avis.'):
        await handleAvisEvents(eventType, data, stable);
        break;

      case eventType.includes('favorited') || eventType.includes('unfavorited'):
        await handleFavoriEvents(eventType, data, stable);
        break;

      case eventType.startsWith('settings.') || eventType.includes('updated'):
        await handleSettingsEvents(eventType, data, stable);
        break;

      default:
        console.warn(`[Mercure] Aucun handler trouvé pour "${eventType}"`, data);
        break;
    }
  } catch (err) {
    console.error(`[Mercure] Erreur critique dans le handler pour "${eventType}":`, err);
  }
};