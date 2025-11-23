import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux signalements (création, traitement, rejet)
 */
export const handleSignalementEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.SIGNALEMENT_CREATED:
       // Auteur du signalement → confirmation
      if (data.auteurId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Signalement envoyé',
          body: data.message ?? 'Votre signalement a bien été enregistré. L’équipe va l’examiner sous peu.',
          data: {
            type: 'signalement',
            signalementId: data.signalementId,
            action: 'view_my_signalements',
          },
        });
      }
      break;

    case EventType.SIGNALEMENT_HANDLED:
      // Auteur → notification de résolution (Feedback important)
      if (data.auteurId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Signalement traité',
          body: data.message ??
            'Votre signalement a été traité par l’équipe de modération. Merci pour votre vigilance.',
          data: {
            type: 'signalement',
            signalementId: data.signalementId,
            action: 'view_my_signalements',
          },
        });
        
        // Le feedback de modération mérite un badge
        await incrementBadge();
      }

      // Utilisateur signalé → avertissement éventuel (Critique)
      if (data.utilisateurSignaleId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Signalement à votre encontre',
          body: data.message ??
            'Un signalement vous concernant a été examiné et validé. Merci de respecter les règles de la plateforme.',
          data: {
            type: 'warning', // Type spécifique pour gérer l'UI (ex: fond rouge)
            action: 'view_profile', 
          },
          sound: true,
        });

        await incrementBadge();
      }
      break;

    case EventType.SIGNALEMENT_REJECTED:
      // Auteur → notification du rejet
      if (data.auteurId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Signalement rejeté',
          body: data.message ?? 'Votre signalement a été examiné, mais jugé non fondé.',
          data: {
            type: 'signalement',
            signalementId: data.signalementId,
            action: 'view_my_signalements',
          },
        });
        
        // Feedback de modération -> Badge
        await incrementBadge();
      }

      break;

    default:
      break;
  }
};