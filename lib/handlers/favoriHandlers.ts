import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux favoris (voyages et demandes)
 */
export const handleFavoriEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.VOYAGE_FAVORITED:
      stable.refetchFavoris?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage ajouté aux favoris',
        body: data.message ?? 'Vous avez ajouté un voyage à vos favoris.',
        data: {
          type: 'favori',
          entityType: 'voyage',
          action: 'view_favoris',
        },
      });
      break;

    case EventType.VOYAGE_UNFAVORITED:
      stable.refetchFavoris?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage retiré des favoris',
        body: data.message ?? 'Ce voyage a été retiré de vos favoris.',
        data: {
          type: 'favori',
          entityType: 'voyage',
          action: 'view_favoris',
        },
      });
      break;

    case EventType.DEMANDE_FAVORITED:
      stable.refetchFavoris?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Demande ajoutée aux favoris',
        body: data.message ?? 'Vous avez ajouté une demande à vos favoris.',
        data: {
          type: 'favori',
          entityType: 'demande',
          action: 'view_favoris',
        },
      });
      break;

    case EventType.DEMANDE_UNFAVORITED:
      stable.refetchFavoris?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Demande retirée des favoris',
        body: data.message ?? 'Cette demande a été retirée de vos favoris.',
        data: {
          type: 'favori',
          entityType: 'demande',
          action: 'view_favoris',
        },
      });
      break;

    default:
      break;
  }
};