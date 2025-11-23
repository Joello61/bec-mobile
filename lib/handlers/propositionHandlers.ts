import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux propositions entre voyageur et client.
 */
export const handlePropositionEvents = async (
  eventType: string,
  data: any,
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.PROPOSITION_CREATED:
      stable.refetchPropositionsVoyage?.(data.voyageId);
      stable.refetchUserDemandes?.(stable.userId);
      stable.refetchUserVoyages?.(stable.userId);

      // Cas 1 : Le voyageur reçoit une proposition sur son trajet
      if (data.voyageurId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Nouvelle proposition reçue',
          body: data.message ?? 
            `${data.clientNom || 'Un utilisateur'} a fait une proposition sur votre voyage.`,
          data: {
            type: 'proposition',
            voyageId: data.voyageId,
            action: 'view_my_voyage',
          },
          sound: true,
        });
        
        await incrementBadge();

      } else if (data.clientId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Proposition envoyée',
          body: data.message ?? 'Votre proposition a été envoyée avec succès.',
          data: {
            type: 'proposition',
            demandeId: data.demandeId,
            action: 'view_my_demande',
          },
        });
      }
      break;

    case EventType.PROPOSITION_ACCEPTED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      if (data.clientId === stable.userId) {
        stable.refetchUserDemandes?.(data.clientId);
        
        await showLocalNotification({
          title: data.titre ?? 'Proposition acceptée 🎉',
          body: data.message ?? 
            `${data.voyageurNom || 'Le voyageur'} a accepté votre proposition.`,
          data: {
            type: 'proposition',
            demandeId: data.demandeId,
            action: 'view_my_demande',
          },
          sound: true,
        });

        await incrementBadge();

      // Cas 2 : Le voyageur a accepté (confirmation pour lui)
      } else if (data.voyageurId === stable.userId) {
        stable.refetchUserVoyages?.(data.voyageurId);
        
        await showLocalNotification({
          title: data.titre ?? 'Proposition confirmée',
          body: data.message ?? `Votre voyage a été mis à jour.`,
          data: {
            type: 'proposition',
            voyageId: data.voyageId,
            action: 'view_my_voyage',
          },
        });
      }
      break;

    case EventType.PROPOSITION_REJECTED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      // Cas 1 : Le client voit sa proposition refusée
      if (data.clientId === stable.userId) {
        stable.refetchUserDemandes?.(data.clientId);
        
        await showLocalNotification({
          title: data.titre ?? 'Proposition refusée',
          body: data.message ?? 
            `${data.voyageurNom || 'Le voyageur'} a refusé votre proposition.`,
          data: {
            type: 'proposition',
            demandeId: data.demandeId,
            action: 'view_my_demande',
          },
        });
        
        // On notifie via badge aussi pour qu'il voie pourquoi
        await incrementBadge();

      // Cas 2 : Le voyageur a refusé (confirmation)
      } else if (data.voyageurId === stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Proposition refusée',
          body: data.message ?? `Vous avez refusé une proposition.`,
          data: {
            type: 'proposition',
            voyageId: data.voyageId,
            action: 'view_my_voyage',
          },
        });
      }
      break;

    case EventType.PROPOSITION_CANCELLED:
      stable.refetchPropositionsVoyage?.(data.voyageId);

      // Si l'utilisateur est concerné par l'annulation
      if (
        data.recipientId === stable.userId ||
        data.voyageurId === stable.userId
      ) {
        if (data.voyageId) stable.refetchUserVoyages?.(stable.userId);
        else if (data.demandeId) stable.refetchUserDemandes?.(stable.userId);

        // Détermination de l'action de redirection
        let action = 'view_home';
        const notifData: any = { type: 'proposition_cancelled' };
        
        if (data.voyageId) {
            action = 'view_my_voyage';
            notifData.voyageId = data.voyageId;
        } else if (data.demandeId) {
            action = 'view_my_demande';
            notifData.demandeId = data.demandeId;
        }
        notifData.action = action;

        await showLocalNotification({
          title: data.titre ?? 'Proposition annulée',
          body: data.message ?? 'Une de vos propositions a été annulée.',
          data: notifData,
        });
        await incrementBadge();
      }
      break;

    default:
      break;
  }
};