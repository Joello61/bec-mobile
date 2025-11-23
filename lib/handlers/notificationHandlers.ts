import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux notifications système
 */
export const handleNotificationEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    
    case EventType.NOTIFICATION_NEW:
      // Mise à jour des compteurs et de la liste
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      await showLocalNotification({
        title: data.titre ?? data.notification?.titre ?? 'Nouvelle notification',
        body: data.message ?? data.notification?.message ?? 'Vous avez reçu une nouvelle notification.',
        data: {
          type: 'system_notification',
          // On passe l'ID si disponible pour marquer comme lu au clic
          notificationId: data.id ?? data.notification?.id, 
          action: 'view_notifications',
        },
        sound: true, // Notification système importante
      });

      await incrementBadge();
      break;

    case EventType.NOTIFICATION_READ:
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      console.log('[Realtime] Notification(s) marquée(s) comme lue(s).');
      break;

    case EventType.NOTIFICATION_DELETED:
      stable.refetchNotif?.();
      stable.refetchNotifCount?.();

      await showLocalNotification({
        title: data.titre ?? 'Notification supprimée',
        body: data.message ?? 'Une notification a été retirée de votre liste.',
        data: {
          type: 'system_notification',
          action: 'view_notifications',
        },
      });
      break;

    default:
      break;
  }
};