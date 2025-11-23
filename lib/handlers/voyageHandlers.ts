import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux voyages (création, mise à jour, annulation, etc.)
 */
export const handleVoyageEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {

    case EventType.VOYAGE_CREATED:
      // On ne notifie pas le créateur lui-même
      if (data.createdBy === stable.userId) return;
      
      console.log('Nouveau voyage créé:', data.voyageId);
      stable.refetchVoyages?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Nouveau voyage ajouté',
        body: data.message ?? 
          `Un nouveau voyage de ${data.villeDepart ?? 'inconnue'} à ${data.villeArrivee ?? 'inconnue'} vient d’être publié.`,
        data: {
          type: 'voyage',
          voyageId: data.voyageId,
          action: 'view_explore',
        },
      });
      
      await incrementBadge();
      break;

    case EventType.VOYAGE_UPDATED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserVoyages?.(stable.userId);
      }
      stable.refetchVoyages?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage mis à jour',
        body: data.message ?? 'Un voyage a été modifié. Pensez à vérifier les nouvelles informations.',
        data: {
          type: 'voyage',
          voyageId: data.voyageId,
          action: 'view_voyage',
        },
      });
      
      await incrementBadge();
      break;

    case EventType.VOYAGE_CANCELLED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserVoyages?.(stable.userId);
      }
      stable.refetchVoyages?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage annulé',
        body: data.message ?? 'Un voyage a été annulé par le voyageur ou par le système.',
        data: {
          type: 'voyage',
          voyageId: data.voyageId,
          action: 'view_voyage',
        },
      });
      break;

    case EventType.VOYAGE_COMPLETED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserVoyages?.(stable.userId);
      }
      stable.refetchVoyages?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage terminé',
        body: data.message ?? 'Le voyage a été marqué comme complété avec succès.',
        data: {
          type: 'voyage',
          voyageId: data.voyageId,
          action: 'view_voyage',
        },
      });
      
      await incrementBadge();
      break;

    case EventType.VOYAGE_EXPIRED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserVoyages?.(stable.userId);
      }
      stable.refetchVoyages?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage expiré',
        body: data.message ?? 'Un voyage est arrivé à expiration et a été désactivé automatiquement.',
        data: {
          type: 'voyage',
          voyageId: data.voyageId,
          action: 'view_voyage',
        },
      });
      break;

    case EventType.VOYAGE_FAVORITED:
      stable.refetchFavoris?.(); 
      
      await showLocalNotification({
        title: data.titre ?? 'Voyage ajouté aux favoris',
        body: data.message ?? 'Vous avez ajouté ce voyage à vos favoris.',
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

    default:
      break;
  }
};