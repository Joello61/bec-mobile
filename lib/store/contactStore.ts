import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { contactsApi } from '@/lib/api/contacts';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { Contact, CreateContactInput } from '@/types';

interface ContactState {
  contacts: Contact[];
  currentContact: Contact | null;
  isLoading: boolean;
  error: string | null;
  successMessage: string | null;
  
  // Actions
  createContact: (data: CreateContactInput) => Promise<void>;
  fetchContacts: () => Promise<void>;
  fetchContact: (id: number) => Promise<void>;
  deleteContact: (id: number) => Promise<void>;
  clearError: () => void;
  clearSuccess: () => void;
  reset: () => void;
}

export const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contacts: [],
      currentContact: null,
      isLoading: false,
      error: null,
      successMessage: null,

      createContact: async (data) => {
        set({ isLoading: true, error: null, successMessage: null });
        try {
          const response = await contactsApi.create(data);
          set({ 
            successMessage: response.message,
            isLoading: false 
          });
          // Optionnel : Recharger la liste après création si nécessaire
          // await get().fetchContacts(); 
        } catch (error: any) {
          const errorMessage = error.response?.data?.message 
            || error.message 
            || 'Erreur lors de l\'envoi du message';
          
          set({ 
            error: errorMessage,
            isLoading: false 
          });
          throw error;
        }
      },

      fetchContacts: async () => {
        set({ isLoading: true, error: null });
        try {
          const contacts = await contactsApi.list();
          set({ contacts, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des contacts',
            isLoading: false 
          });
        }
      },

      fetchContact: async (id) => {
        set({ isLoading: true, error: null });
        try {
          const contact = await contactsApi.show(id);
          set({ currentContact: contact, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement du contact',
            isLoading: false 
          });
        }
      },

      deleteContact: async (id) => {
        set({ isLoading: true, error: null });
        try {
          await contactsApi.delete(id);
          set((state) => ({
            contacts: state.contacts.filter((c) => c.id !== id),
            currentContact: state.currentContact?.id === id ? null : state.currentContact,
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la suppression du contact',
            isLoading: false 
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      clearSuccess: () => set({ successMessage: null }),
      
      reset: () => set({ 
        contacts: [],
        currentContact: null,
        error: null,
        successMessage: null
      }),
    }),
    {
      name: STORAGE_KEYS.CONTACT_STORE,
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
        contacts: state.contacts,
      }),
    }
  )
);