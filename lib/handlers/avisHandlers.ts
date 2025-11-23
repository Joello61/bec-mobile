import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux avis entre utilisateurs
 */
export const handleAvisEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.AVIS_CREATED:
      // Rafraîchir la liste des avis de l'utilisateur
      stable.refetchUserAvis?.(stable.userId);

      // Si l’utilisateur est la cible de l’avis
      if (data.cibleId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Nouvel avis reçu',
          body: data.message ?? 
            `Vous avez reçu un nouvel avis de ${data.auteur ?? 'un utilisateur'} (note : ${data.note ?? '-'}/5).`,
          data: {
            type: 'avis',
            avisId: data.avisId,
            action: 'view_profile', // ⚠️ Redirection vers le profil
          },
        });

        // ⚠️ Incrémenter le badge car c'est une interaction importante
        await incrementBadge();
      }
      break;

    case EventType.AVIS_UPDATED:
      stable.refetchUserAvis?.(stable.userId);

      if (data.cibleId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Avis mis à jour',
          body: data.message ?? 
            `Un avis que vous aviez reçu a été modifié. Nouvelle note : ${data.note ?? '-'}/5.`,
          data: {
            type: 'avis',
            avisId: data.avisId,
            action: 'view_profile',
          },
        });
        
        await incrementBadge();
      }
      break;

    case EventType.AVIS_DELETED:
      stable.refetchUserAvis?.(stable.userId);

      if (data.cibleId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Avis supprimé',
          body: data.message ?? 'Un avis que vous aviez reçu a été supprimé.',
          data: {
            type: 'avis',
            action: 'view_profile',
          },
        });
      }
      break;

    default:
      break;
  }
};