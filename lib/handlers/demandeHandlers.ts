import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux demandes d'envoi
 */
export const handleDemandeEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    case EventType.DEMANDE_CREATED:
      if (data.createdBy === stable.userId) return;

      // Rafraîchir les données
      stable.refetchDemandes?.();

      await showLocalNotification({
        title: data.titre ?? 'Nouvelle demande publiée',
        body: data.message ?? 
          `Une nouvelle demande d'envoi de ${data.villeDepart ?? 'inconnue'} à ${data.villeArrivee ?? 'inconnue'} vient d'être créée.`,
        data: {
          type: 'demande',
          demandeId: data.demandeId,
          action: 'view_explore',
        },
      });
      
      // ⚠️ Incrémenter le badge
      await incrementBadge();
      break;

    case EventType.DEMANDE_UPDATED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserDemandes?.(stable.userId);
      }
      stable.refetchDemandes?.();
      
      // ⚠️ Notification native
      await showLocalNotification({
        title: data.titre ?? 'Demande mise à jour',
        body: data.message ?? "Une demande d'envoi a été modifiée.",
        data: {
          type: 'demande',
          demandeId: data.demandeId,
          action: 'view_demande', // ⚠️ Router vers détail demande
        },
      });
      
      await incrementBadge();
      break;

    case EventType.DEMANDE_CANCELLED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserDemandes?.(stable.userId);
      }
      stable.refetchDemandes?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Demande annulée',
        body: data.message ?? "Une demande d'envoi a été annulée.",
        data: {
          type: 'demande',
          demandeId: data.demandeId,
        },
      });
      break;

    case EventType.DEMANDE_EXPIRED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserDemandes?.(stable.userId);
      }
      stable.refetchDemandes?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Demande expirée',
        body: data.message ?? "Une demande d'envoi est arrivée à expiration.",
        data: {
          type: 'demande',
          demandeId: data.demandeId,
        },
      });
      break;

    case EventType.DEMANDE_STATUT_UPDATED:
      if (data.createdBy === stable.userId) {
        stable.refetchUserDemandes?.(stable.userId);
      }
      stable.refetchDemandes?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Statut mis à jour',
        body: data.message ?? `Le statut de votre demande est désormais : ${data.statut ?? 'mis à jour'}.`,
        data: {
          type: 'demande',
          demandeId: data.demandeId,
          action: 'view_demande',
        },
      });
      
      await incrementBadge();
      break;

    case EventType.DEMANDE_MATCHED:
      stable.refetchUserDemandes?.(stable.userId);
      
      await showLocalNotification({
        title: data.titre ?? 'Correspondance trouvée ! 🎉',
        body: data.message ?? 
          `Un voyage correspondant à votre demande a été trouvé (${data.matchCount ?? 1} voyage${data.matchCount > 1 ? 's' : ''}).`,
        data: {
          type: 'demande',
          demandeId: data.demandeId,
          action: 'view_my_demande', // ⚠️ Vers mes demandes
        },
        sound: true, // ⚠️ Son pour événement important
      });
      
      await incrementBadge();
      break;

    case EventType.DEMANDE_FAVORITED:
      stable.refetchFavoris?.(); // ⚠️ refetchFavorisDemandes → refetchFavoris
      
      await showLocalNotification({
        title: data.titre ?? 'Demande ajoutée aux favoris',
        body: data.message ?? 'Vous avez ajouté cette demande à vos favoris.',
        data: {
          type: 'favori',
          demandeId: data.demandeId,
        },
      });
      break;

    case EventType.DEMANDE_UNFAVORITED:
      stable.refetchFavoris?.();
      break;

    default:
      break;
  }
};