import { EventType } from '@/lib/utils/eventType';
import { showLocalNotification, incrementBadge } from '@/lib/utils/notifications';
import type { StableContext } from '@/types/realtime';

/**
 * Gère les événements temps réel liés aux utilisateurs (création, mise à jour, vérification, etc.)
 */
export const handleUserEvents = async (
  eventType: string, 
  data: any, 
  stable: StableContext
) => {
  switch (eventType) {
    case EventType.USER_PASSWORD_RESET:
      await showLocalNotification({
        title: data.title ?? 'Mot de passe réinitialisé',
        body: data.message ?? 'Votre mot de passe a été changé avec succès.',
        data: {
          type: 'security',
          action: 'view_profile',
        },
      });
      break;

    case EventType.USER_PASSWORD_FORGOT:
      await showLocalNotification({
        title: data.title ?? 'Demande de réinitialisation',
        body: data.message ?? 'Une demande de réinitialisation de mot de passe a été effectuée.',
        data: {
          type: 'security',
          action: 'view_profile',
        },
      });
      break;

    case EventType.USER_PROFILE_UPDATED:
      stable.refetchNotif?.();

      let notifTitle = data.title ?? 'Profil mis à jour';
      let notifBody = data.message ?? 'Vos informations ont été modifiées.';
      const actionData = { type: 'profile', action: 'view_profile' };

      // Personnalisation du message selon le contexte
      if (data?.isEmailVerified) {
        notifTitle = data.title ?? 'Email vérifié';
        notifBody = data.message ?? 'Votre adresse email a bien été vérifiée.';
      } else if (data?.addressDeleted) {
        notifTitle = data.title ?? 'Adresse supprimée';
        notifBody = data.message ?? 'Votre adresse enregistrée a été supprimée.';
      }

      await showLocalNotification({
        title: notifTitle,
        body: notifBody,
        data: actionData,
      });
      break;

    case EventType.USER_VERIFIED_PHONE:
      await showLocalNotification({
        title: data.title ?? 'Téléphone vérifié',
        body: data.message ?? 'Votre numéro de téléphone a été vérifié avec succès.',
        data: {
          type: 'profile',
          action: 'view_profile',
        },
      });
      break;

    case EventType.USER_SETTINGS_UPDATED:
      stable.refetchNotif?.();
      
      await showLocalNotification({
        title: data.title ?? 'Paramètres mis à jour',
        body: data.message ?? 'Vos préférences de compte ont été enregistrées.',
        data: {
          type: 'settings',
          action: 'view_settings',
        },
      });
      break;

    case EventType.USER_BANNED:
      await showLocalNotification({
        title: data.title ?? 'Compte suspendu ⛔',
        body: data.message ?? 'Votre compte a été temporairement suspendu.',
        data: {
          type: 'alert',
          action: 'view_support', // Redirection vers le support pour contester
        },
        sound: true,
      });
      break;

    case EventType.USER_UNBANNED:
      await showLocalNotification({
        title: data.title ?? 'Compte réactivé ✅',
        body: data.message ?? 'Votre compte a été rétabli.',
        data: {
          type: 'alert',
          action: 'view_profile',
        },
        sound: true,
      });
      
      await incrementBadge();
      break;

    case EventType.USER_DELETED:
      await showLocalNotification({
        title: data.title ?? 'Compte supprimé',
        body: data.message ?? 'Votre compte a été définitivement supprimé.',
        data: {
          type: 'alert',
          action: 'logout',
        },
      });
      break;

    default:
      break;
  }
};