/* eslint-disable @typescript-eslint/no-explicit-any */
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { usersApi } from '@/lib/api/users';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { User, UpdateUserInput, PaginationMeta } from '@/types';

interface UserState {
  users: User[];
  currentUser: User | null;
  pagination: PaginationMeta | null;
  searchResults: User[];
  isLoading: boolean;
  error: string | null;
  isUploadingAvatar: boolean;
  
  // Actions
  fetchUsers: (page?: number, limit?: number) => Promise<void>;
  fetchUser: (id: number) => Promise<void>;
  updateMe: (data: UpdateUserInput) => Promise<void>;
  searchUsers: (query: string) => Promise<void>;
  // Note: En React Native, 'file' est un objet { uri, type, name }, pas un DOM File
  uploadAvatar: (file: any) => Promise<string | null>;
  deleteAvatar: () => Promise<void>;
  
  clearError: () => void;
  reset: () => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set, get) => ({
      users: [],
      currentUser: null,
      pagination: null,
      searchResults: [],
      isLoading: false,
      error: null,
      isUploadingAvatar: false,

      fetchUsers: async (page = 1, limit = 10) => {
        set({ isLoading: true, error: null });
        try {
          const response = await usersApi.list(page, limit);
          set({ 
            users: response.data, 
            pagination: response.pagination,
            isLoading: false 
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des utilisateurs', 
            isLoading: false 
          });
        }
      },

      fetchUser: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const user = await usersApi.show(id);
          set({ currentUser: user, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement de l\'utilisateur', 
            isLoading: false 
          });
        }
      },

      updateMe: async (data) => {
        set({ isLoading: true, error: null });
        try {
          const user = await usersApi.updateMe(data);
          set({ currentUser: user, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la mise à jour du profil', 
            isLoading: false 
          });
          throw error;
        }
      },

      searchUsers: async (query) => {
        set({ isLoading: true, error: null });
        try {
          const searchResults = await usersApi.search(query);
          set({ searchResults, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la recherche', 
            isLoading: false 
          });
        }
      },

      uploadAvatar: async (file: any) => {
        set({ isUploadingAvatar: true, error: null });
        try {
          const response = await usersApi.uploadAvatar(file);
          
          // Mettre à jour le currentUser avec la nouvelle photo
          const currentUser = get().currentUser;
          if (currentUser) {
            set({ 
              currentUser: { ...currentUser, photo: response.photoUrl },
              isUploadingAvatar: false 
            });
          } else {
            set({ isUploadingAvatar: false });
          }
          
          return response.photoUrl;
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de l\'upload de l\'avatar';
          set({ 
            error: errorMessage,
            isUploadingAvatar: false 
          });
          throw new Error(errorMessage);
        }
      },

      deleteAvatar: async () => {
        set({ isUploadingAvatar: true, error: null });
        try {
          await usersApi.deleteAvatar();
          
          // Mettre à jour le currentUser en supprimant la photo
          const currentUser = get().currentUser;
          if (currentUser) {
            set({ 
              currentUser: { ...currentUser, photo: null },
              isUploadingAvatar: false 
            });
          } else {
            set({ isUploadingAvatar: false });
          }
        } catch (error: any) {
          const errorMessage = error.response?.data?.message || error.message || 'Erreur lors de la suppression de l\'avatar';
          set({ 
            error: errorMessage,
            isUploadingAvatar: false 
          });
          throw new Error(errorMessage);
        }
      },

      clearError: () => set({ error: null }),
      
      reset: () => set({ 
        users: [], 
        currentUser: null, 
        pagination: null,
        searchResults: [],
        error: null,
        isUploadingAvatar: false,
      }),
    }),
    {
      name: STORAGE_KEYS.USER_STORE,
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
        currentUser: state.currentUser,
        users: state.users,
      }),
    }
  )
);