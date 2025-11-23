import { useCallback, useEffect } from 'react';
import { useNotificationStore } from '@/lib/store/notificationStore';
import { 
  incrementBadge, 
  clearBadge, 
  setBadgeCount 
} from '@/lib/utils/notifications';
import { addNotificationReceivedListener, addNotificationResponseListener } from '@/lib/utils/notifications';
import { useRouter } from 'expo-router';

/**
 * Hook pour gérer les notifications
 */
export function useNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const isLoading = useNotificationStore((state) => state.isLoading);
  const error = useNotificationStore((state) => state.error);
  const fetchNotifications = useNotificationStore((state) => state.fetchNotifications);
  const markAsRead = useNotificationStore((state) => state.markAsRead);
  const markAllAsRead = useNotificationStore((state) => state.markAllAsRead);
  const deleteNotification = useNotificationStore((state) => state.deleteNotification);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const refetch = useCallback(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const markAsReadWithBadge = useCallback(async (id: number) => {
    await markAsRead(id);
    
    // Recalculer le badge
    const unreadCount = notifications.filter(n => !n.lue).length - 1;
    await setBadgeCount(Math.max(0, unreadCount));
  }, [markAsRead, notifications]);

  const markAllAsReadWithBadge = useCallback(async () => {
    await markAllAsRead();
    await clearBadge();
  }, [markAllAsRead]);

  return {
    notifications,
    isLoading,
    error,
    markAsRead: markAsReadWithBadge,
    markAllAsRead: markAllAsReadWithBadge,
    deleteNotification,
    refetch,
  };
}

/**
 * Hook pour les notifications non lues
 */
export function useUnreadNotifications() {
  const notifications = useNotificationStore((state) => state.notifications);
  const fetchUnread = useNotificationStore((state) => state.fetchUnread);

  useEffect(() => {
    fetchUnread();
  }, []);

  const unreadNotifications = notifications.filter((n) => !n.lue);

  useEffect(() => {
    setBadgeCount(unreadNotifications.length);
  }, [unreadNotifications.length]);

  return {
    unreadNotifications,
    refetch: fetchUnread,
  };
}

/**
 * Hook pour le compteur de notifications non lues
 * ⚠️ ADAPTATION : Synchronise automatiquement avec le badge natif
 */
export function useUnreadNotificationCount(isAuthenticated?: boolean) {
  const unreadCount = useNotificationStore((state) => state.unreadCount);
  const fetchUnreadCount = useNotificationStore((state) => state.fetchUnreadCount);

  useEffect(() => {
    if (!isAuthenticated) {
      clearBadge();
      return;
    }

    fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  useEffect(() => {
    if (isAuthenticated) {
      setBadgeCount(unreadCount);
    }
  }, [unreadCount, isAuthenticated]);

  const refetch = useCallback(() => {
    if (!isAuthenticated) return;

    fetchUnreadCount();
  }, [isAuthenticated, fetchUnreadCount]);

  return {
    unreadCount: isAuthenticated ? unreadCount : 0,
    refetch,
  };
}

/**
 * Hook pour écouter les notifications push (locales + distantes)
 * À utiliser dans _layout.tsx ou NotificationProvider
 */
export function useNotificationListeners() {
  const router = useRouter();
  const { refetch: refetchNotifications } = useNotifications();

  useEffect(() => {
    // Écouter les notifications reçues (app au premier plan)
    const receivedSubscription = addNotificationReceivedListener((notification) => {
      console.log('[Notifications] Notification reçue:', notification);
      
      // Rafraîchir la liste des notifications
      refetchNotifications();
      
      // Incrémenter le badge
      incrementBadge();
    });

    // Écouter les interactions (tap sur notification)
    const responseSubscription = addNotificationResponseListener((response) => {
      const data = response.notification.request.content.data;
      console.log('[Notifications] Notification tapée:', data);
      
      // Router selon le type de notification
      if (data.type === 'message' && data.conversationId) {
        router.push(`/(protected)/messages/${data.conversationId}`);
      } else if (data.type === 'proposition' && data.propositionId) {
        router.push(`/(protected)/propositions/${data.propositionId}`);
      } else if (data.type === 'proposition_accepted' && data.propositionId) {
        router.push(`/(protected)/propositions/${data.propositionId}`);
      } else if (data.type === 'demande' && data.demandeId) {
        router.push(`/(protected)/demandes/${data.demandeId}`);
      } else if (data.type === 'voyage' && data.voyageId) {
        router.push(`/(protected)/voyages/${data.voyageId}`);
      }
    });

    // Cleanup
    return () => {
      receivedSubscription.remove();
      responseSubscription.remove();
    };
  }, [router, refetchNotifications]);
}