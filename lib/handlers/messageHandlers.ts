import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements temps réel liés à la messagerie (messages & conversations)
 */
export const handleMessageEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.MESSAGE_SENT:
      // Mettre à jour les compteurs et la liste
      stable.refetchMessageCount?.();
      stable.refetchConvs?.();

      // On ne notifie pas l’expéditeur
      if (data.expediteurId !== stable.userId) {
        const senderName = data.expediteur?.prenom || 'Un utilisateur';
        const contentPreview = data.contenu 
          ? (data.contenu.length > 80 ? data.contenu.substring(0, 80) + '...' : data.contenu)
          : 'Nouveau message reçu';

        await showLocalNotification({
          title: data.titre ?? 'Nouveau message',
          body: data.message ?? `${senderName}: ${contentPreview}`,
          data: {
            type: 'message',
            conversationId: data.conversationId,
            action: 'view_conversation',
          },
          sound: true 
        });

        await incrementBadge();
      }
      break;

    case EventType.MESSAGE_READ:
      stable.refetchMessageCount?.();
      stable.refetchConvs?.();
      break;

    case EventType.MESSAGE_DELETED:
      stable.refetchConvs?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Message supprimé',
        body: data.message ?? 'Un message a été supprimé dans une de vos conversations.',
        data: {
          type: 'message',
          action: 'view_conversations',
        },
      });
      break;

    case EventType.CONVERSATION_CREATED:
      stable.refetchConvs?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Nouvelle conversation',
        body: data.message ?? 'Une nouvelle conversation a été ouverte.',
        data: {
          type: 'conversation',
          conversationId: data.conversationId,
          action: 'view_conversation',
        },
      });
      
      await incrementBadge();
      break;

    case EventType.CONVERSATION_DELETED:
      stable.refetchConvs?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Conversation supprimée',
        body: data.message ?? 'Une de vos conversations a été supprimée.',
        data: {
          type: 'conversation',
          action: 'view_conversations',
        },
      });
      break;

    default:
      break;
  }
};