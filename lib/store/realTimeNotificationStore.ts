import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';

export interface RealTimeNotificationData {
  id: string;
  title: string;
  message: string;
  icon?: string; 
  duration?: number;
  type?: 'success' | 'error' | 'info' | 'warning';
}

interface RealTimeNotificationState {
  realTimeNotifications: RealTimeNotificationData[];
  addNotification: (n: RealTimeNotificationData) => void;
  removeNotification: (id: string) => void;
  clear: () => void;
}

export const useRealTimeNotificationStore = create<RealTimeNotificationState>()(
  persist(
    (set) => ({
      realTimeNotifications: [],

      addNotification: (n) =>
        set((state) => {
          const exists = state.realTimeNotifications.some((notif) => notif.id === n.id);
          if (exists) return state;

          console.log('[Store] Notification reçue :', n.title);
          if (n.duration && n.duration > 0) {
            setTimeout(() => {
              set((s) => ({
                realTimeNotifications: s.realTimeNotifications.filter((notif) => notif.id !== n.id),
              }));
            }, n.duration);
          }

          return {
            realTimeNotifications: [...state.realTimeNotifications, n],
          };
        }),

      removeNotification: (id) =>
        set((state) => ({
          realTimeNotifications: state.realTimeNotifications.filter((notif) => notif.id !== id),
        })),

      clear: () => {
        set({ realTimeNotifications: [] });
      },
    }),
    {
      name: STORAGE_KEYS.REALTIME_NOTIFICATION_STORE,
      
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
        realTimeNotifications: state.realTimeNotifications,
      }),
    }
  )
);