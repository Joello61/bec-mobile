import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { requestNotificationPermission } from './permissions';

/**
 * Notifications Utilities pour React Native
 * 
 * Gestion complète des notifications push locales et distantes
 */

// ==================== TYPES ====================

export interface NotificationData {
  type?: string;
  id?: string;
  [key: string]: any;
}

export interface LocalNotificationOptions {
  title: string;
  body: string;
  data?: NotificationData;
  sound?: boolean;
  badge?: number;
  delay?: number; // en secondes
}

export interface ScheduledNotificationOptions extends LocalNotificationOptions {
  trigger: {
    seconds?: number;
    date?: Date;
    repeats?: boolean;
  };
}

// ==================== CONFIGURATION ====================

/**
 * Initialiser les notifications
 * À appeler au démarrage de l'app
 */
export const initializeNotifications = async (): Promise<void> => {
  // Configuration du handler de notifications
  Notifications.setNotificationHandler({
  handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

  // Configuration du canal Android (obligatoire pour Android)
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Notifications par défaut',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#00695c',
      sound: 'default',
    });

    // Canal pour les messages
    await Notifications.setNotificationChannelAsync('messages', {
      name: 'Messages',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#0d47a1',
      sound: 'default',
    });

    // Canal pour les propositions
    await Notifications.setNotificationChannelAsync('propositions', {
      name: 'Propositions',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#ffb300',
      sound: 'default',
    });
  }

  // Demander la permission
  await requestNotificationPermission();
};

// ==================== PUSH TOKEN ====================

/**
 * Récupérer le token Expo Push
 * Nécessaire pour envoyer des notifications depuis le serveur
 */
export const getExpoPushToken = async (): Promise<string | null> => {
  try {
    // Vérifier que l'app tourne sur un device physique (pas simulateur)
    if (Platform.OS === 'android' || Platform.OS === 'ios') {
      const { data: token } = await Notifications.getExpoPushTokenAsync({
        projectId: process.env.EXPO_PUBLIC_PROJECT_ID, // À configurer dans .env
      });
      
      console.log('[Notifications] Expo Push Token:', token);
      return token;
    }
    
    console.warn('[Notifications] Push notifications non supportées sur ce device');
    return null;
  } catch (error) {
    console.error('[Notifications] Erreur getExpoPushToken:', error);
    return null;
  }
};

/**
 * Enregistrer le token sur le serveur
 */
export const registerPushToken = async (userId: string): Promise<void> => {
  try {
    const token = await getExpoPushToken();
    
    if (token) {
      // Envoyer le token au backend
      // await apiClient.post('/users/push-token', { token, userId });
      console.log('[Notifications] Token enregistré pour user:', userId);
    }
  } catch (error) {
    console.error('[Notifications] Erreur registerPushToken:', error);
  }
};

// ==================== NOTIFICATIONS LOCALES ====================

/**
 * Afficher une notification locale immédiatement
 */
export const showLocalNotification = async (
  options: LocalNotificationOptions
): Promise<string> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge,
      },
      // CORRECTION ICI : On ajoute le "type" explicitement
      trigger: (options.delay && options.delay > 0)
        ? {
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL, // <--- C'est la ligne manquante
            seconds: options.delay,
            repeats: false,
          }
        : null, // null signifie "immédiat"
    });
    
    return notificationId;
  } catch (error) {
    console.error('[Notifications] Erreur showLocalNotification:', error);
    throw error;
  }
};

/**
 * Programmer une notification pour plus tard
 */
export const scheduleNotification = async (
  options: ScheduledNotificationOptions
): Promise<string> => {
  try {
    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title: options.title,
        body: options.body,
        data: options.data || {},
        sound: options.sound !== false,
        badge: options.badge,
      },
      trigger: options.trigger.date
        ? {
            // CORRECTION 1 : On enveloppe la Date dans un objet typé
            type: Notifications.SchedulableTriggerInputTypes.DATE,
            date: options.trigger.date, // Votre objet Date JavaScript
          }
        : {
            // CORRECTION 2 : On garde le type explicite pour l'intervalle
            type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
            seconds: options.trigger.seconds || 1,
            repeats: options.trigger.repeats || false,
          },
    });
    
    return notificationId;
  } catch (error) {
    console.error('[Notifications] Erreur scheduleNotification:', error);
    throw error;
  }
};

/**
 * Annuler une notification programmée
 */
export const cancelScheduledNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    console.error('[Notifications] Erreur cancelScheduledNotification:', error);
  }
};

/**
 * Annuler toutes les notifications programmées
 */
export const cancelAllScheduledNotifications = async (): Promise<void> => {
  try {
    await Notifications.cancelAllScheduledNotificationsAsync();
  } catch (error) {
    console.error('[Notifications] Erreur cancelAllScheduledNotifications:', error);
  }
};

// ==================== BADGE ====================

/**
 * Définir le nombre de badges
 */
export const setBadgeCount = async (count: number): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(count);
  } catch (error) {
    console.error('[Notifications] Erreur setBadgeCount:', error);
  }
};

/**
 * Incrémenter le badge
 */
export const incrementBadge = async (): Promise<void> => {
  try {
    const currentBadge = await Notifications.getBadgeCountAsync();
    await Notifications.setBadgeCountAsync(currentBadge + 1);
  } catch (error) {
    console.error('[Notifications] Erreur incrementBadge:', error);
  }
};

/**
 * Réinitialiser le badge
 */
export const clearBadge = async (): Promise<void> => {
  try {
    await Notifications.setBadgeCountAsync(0);
  } catch (error) {
    console.error('[Notifications] Erreur clearBadge:', error);
  }
};

// ==================== GESTION DES NOTIFICATIONS ====================

/**
 * Supprimer toutes les notifications affichées
 */
export const dismissAllNotifications = async (): Promise<void> => {
  try {
    await Notifications.dismissAllNotificationsAsync();
  } catch (error) {
    console.error('[Notifications] Erreur dismissAllNotifications:', error);
  }
};

/**
 * Supprimer une notification spécifique
 */
export const dismissNotification = async (
  notificationId: string
): Promise<void> => {
  try {
    await Notifications.dismissNotificationAsync(notificationId);
  } catch (error) {
    console.error('[Notifications] Erreur dismissNotification:', error);
  }
};

// ==================== LISTENERS ====================

/**
 * Écouter les notifications reçues (app au premier plan)
 */
export const addNotificationReceivedListener = (
  callback: (notification: Notifications.Notification) => void
): Notifications.Subscription => {
  return Notifications.addNotificationReceivedListener(callback);
};

/**
 * Écouter les interactions avec les notifications (tap)
 */
export const addNotificationResponseListener = (
  callback: (response: Notifications.NotificationResponse) => void
): Notifications.Subscription => {
  return Notifications.addNotificationResponseReceivedListener(callback);
};

// ==================== NOTIFICATIONS TYPES ====================

/**
 * Notification de nouveau message
 */
export const notifyNewMessage = async (
  senderName: string,
  message: string,
  conversationId: string
): Promise<void> => {
  await showLocalNotification({
    title: `Message de ${senderName}`,
    body: message,
    data: {
      type: 'message',
      conversationId,
    },
  });
  
  await incrementBadge();
};

/**
 * Notification de nouvelle proposition
 */
export const notifyNewProposition = async (
  userName: string,
  voyageTitle: string,
  propositionId: string
): Promise<void> => {
  await showLocalNotification({
    title: 'Nouvelle proposition',
    body: `${userName} a fait une proposition sur votre voyage "${voyageTitle}"`,
    data: {
      type: 'proposition',
      propositionId,
    },
  });
  
  await incrementBadge();
};

/**
 * Notification de proposition acceptée
 */
export const notifyPropositionAccepted = async (
  voyageTitle: string,
  propositionId: string
): Promise<void> => {
  await showLocalNotification({
    title: 'Proposition acceptée ! 🎉',
    body: `Votre proposition pour "${voyageTitle}" a été acceptée`,
    data: {
      type: 'proposition_accepted',
      propositionId,
    },
  });
  
  await incrementBadge();
};

/**
 * Notification de nouvel avis
 */
export const notifyNewAvis = async (
  userName: string,
  rating: number
): Promise<void> => {
  const stars = '⭐'.repeat(rating);
  
  await showLocalNotification({
    title: 'Nouvel avis reçu',
    body: `${userName} vous a laissé ${stars}`,
    data: {
      type: 'avis',
    },
  });
};

// ==================== EXPORT ====================

export default {
  // Configuration
  initializeNotifications,
  getExpoPushToken,
  registerPushToken,
  
  // Notifications locales
  showLocalNotification,
  scheduleNotification,
  cancelScheduledNotification,
  cancelAllScheduledNotifications,
  
  // Badge
  setBadgeCount,
  incrementBadge,
  clearBadge,
  
  // Gestion
  dismissAllNotifications,
  dismissNotification,
  
  // Listeners
  addNotificationReceivedListener,
  addNotificationResponseListener,
  
  // Types spécifiques
  notifyNewMessage,
  notifyNewProposition,
  notifyPropositionAccepted,
  notifyNewAvis,
};