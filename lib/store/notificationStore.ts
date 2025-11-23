import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { notificationsApi } from '@/lib/api/notifications';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { AppNotification } from '@/types';

interface NotificationState {
  notifications: AppNotification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchNotifications: () => Promise<void>;
  fetchUnread: () => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  markAsRead: (id: number) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useNotificationStore = create<NotificationState>()(
  persist(
    (set) => ({
      notifications: [],
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchNotifications: async () => {
        set({ isLoading: true, error: null });
        try {
          const notifications = await notificationsApi.list();
          set({ notifications, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des notifications', 
            isLoading: false 
          });
        }
      },

      fetchUnread: async () => {
        set({ isLoading: true, error: null });
        try {
          const notifications = await notificationsApi.getUnread();
          set({ notifications, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des notifications', 
            isLoading: false 
          });
        }
      },

      fetchUnreadCount: async () => {
        try {
          const unreadCount = await notificationsApi.getUnreadCount();
          set({ unreadCount });
        } catch (error: any) {
          console.log('Erreur lors du chargement du compteur de notifications non lues', error);
        }
      },

      markAsRead: async (id) => {
        try {
          await notificationsApi.markAsRead(id);
          set((state) => ({
            notifications: state.notifications.map((notif) =>
              notif.id === id ? { ...notif, lue: true } : notif
            ),
            unreadCount: Math.max(0, state.unreadCount - 1)
          }));
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      markAllAsRead: async () => {
        set({ isLoading: true, error: null });
        try {
          await notificationsApi.markAllAsRead();
          set((state) => ({
            notifications: state.notifications.map((notif) => ({ ...notif, lue: true })),
            unreadCount: 0,
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du marquage des notifications', 
            isLoading: false 
          });
        }
      },

      deleteNotification: async (id) => {
        try {
          await notificationsApi.delete(id);
          set((state) => {
            const notification = state.notifications.find((n) => n.id === id);
            const wasUnread = notification && !notification.lue;
            
            return {
              notifications: state.notifications.filter((n) => n.id !== id),
              unreadCount: wasUnread ? Math.max(0, state.unreadCount - 1) : state.unreadCount
            };
          });
        } catch (error: any) {
          set({ error: error.message });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      reset: () => set({ 
        notifications: [], 
        unreadCount: 0,
        error: null 
      }),
    }),
    {
      name: STORAGE_KEYS.NOTIFICATION_STORE,
      storage: createJSONStorage(() => ({
        getItem: async (name: string) => {
          const value = await storage.getItem(name);
          return value;
        },
        setItem: async (name: string, value: string) => {
          await storage.setItem(name, value);
        },
        removeItem: async (name: string) => {
          await storage.removeItem(name);
        },
      })),
      partialize: (state) => ({
        notifications: state.notifications,
        unreadCount: state.unreadCount,
      }),
    }
  )
);