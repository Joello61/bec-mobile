import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements liés aux paramètres utilisateur (profil, préférences, adresses, notifications)
 */
export const handleSettingsEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    case EventType.USER_PROFILE_UPDATED:
      stable.refetchUser?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Profil mis à jour',
        body: data.message ?? 'Vos informations personnelles ont été modifiées avec succès.',
        data: {
          type: 'settings',
          action: 'view_profile',
        },
      });
      break;

    case EventType.USER_SETTINGS_UPDATED:
      stable.refetchUser?.();

      // Cas spécifique : Un admin est notifié qu'un utilisateur a changé ses infos
      if (stable.isAdmin && data.userId !== stable.userId) {
        await showLocalNotification({
          title: data.titre ?? 'Mise à jour du profil utilisateur',
          body: data.message ?? `L’utilisateur N°${data.userId ?? '-'} a modifié ses paramètres.`,
          data: {
            type: 'admin',
            action: 'view_admin_users',
          },
        });
      } 
      // Cas standard : L'utilisateur a modifié ses propres paramètres
      else {
        await showLocalNotification({
          title: data.titre ?? 'Paramètres enregistrés',
          body: data.message ?? 'Vos préférences ont été enregistrées avec succès.',
          data: {
            type: 'settings',
            action: 'view_settings',
          },
        });
      }
      break;

    case EventType.SETTINGS_UPDATED:
      stable.refetchUser?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Paramètres mis à jour',
        body: data.message ?? 'Vos paramètres de compte ont été actualisés.',
        data: {
          type: 'settings',
          action: 'view_settings',
        },
      });
      break;

    case EventType.SETTINGS_NOTIFICATIONS_CHANGED:
      stable.refetchUser?.();
      
      await showLocalNotification({
        title: data.titre ?? 'Préférences de notifications',
        body: data.message ?? 'Vos préférences de notifications ont été mises à jour.',
        data: {
          type: 'settings',
          action: 'view_settings',
        },
      });
      break;

    default:
      break;
  }
};