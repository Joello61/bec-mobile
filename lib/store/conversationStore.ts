import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { conversationsApi } from '@/lib/api/conversations';
import { messagesApi } from '@/lib/api/messages';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { Conversation, ConversationDetail, SendMessageInput } from '@/types';

interface ConversationState {
  conversations: Conversation[];
  currentConversation: ConversationDetail | null;
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  fetchConversations: () => Promise<void>;
  fetchConversation: (conversationId: number) => Promise<void>;
  getOrCreateConversationWithUser: (userId: number) => Promise<ConversationDetail>;
  sendMessage: (data: SendMessageInput) => Promise<void>;
  markAsRead: (conversationId: number) => Promise<void>;
  fetchUnreadCount: () => Promise<void>;
  deleteConversation: (conversationId: number) => Promise<void>;
  deleteMessage: (messageId: number) => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const useConversationStore = create<ConversationState>()(
  persist(
    (set, get) => ({
      conversations: [],
      currentConversation: null,
      unreadCount: 0,
      isLoading: false,
      error: null,

      fetchConversations: async () => {
        set({ isLoading: true, error: null });
        try {
          const conversations = await conversationsApi.list();
          set({ conversations, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des conversations', 
            isLoading: false 
          });
        }
      },

      fetchConversation: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          const conversation = await conversationsApi.show(conversationId);
          set({ currentConversation: conversation, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement de la conversation', 
            isLoading: false 
          });
        }
      },

      getOrCreateConversationWithUser: async (userId) => {
        set({ isLoading: true, error: null });
        try {
          const conversation = await conversationsApi.withUser(userId);
          set({ currentConversation: conversation, isLoading: false });
          return conversation;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la récupération de la conversation', 
            isLoading: false 
          });
          throw error;
        }
      },

      sendMessage: async (data) => {
        // Note: On ne met pas isLoading à true ici pour ne pas bloquer l'UI pendant l'envoi (UX plus fluide)
        set({ error: null });
        try {
          const message = await messagesApi.send(data);
          
          // Ajouter le message à la conversation actuelle immédiatement (Optimistic UI partiel)
          set((state) => {
            if (!state.currentConversation) return state;
            
            return {
              currentConversation: {
                ...state.currentConversation,
                messages: [...state.currentConversation.messages, message]
              }
            };
          });

          // Rafraîchir la liste des conversations pour mettre à jour le dernier message affiché
          get().fetchConversations();
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de l\'envoi du message'
          });
          throw error;
        }
      },

      markAsRead: async (conversationId) => {
        try {
          await conversationsApi.markAsRead(conversationId);
          
          // Mettre à jour les messages dans la conversation actuelle localement
          set((state) => {
            if (!state.currentConversation || state.currentConversation.id !== conversationId) {
              return state;
            }
            
            return {
              currentConversation: {
                ...state.currentConversation,
                messages: state.currentConversation.messages.map((msg) => ({
                  ...msg,
                  lu: true
                }))
              }
            };
          });

          // Rafraîchir le compteur global
          await get().fetchUnreadCount();
          
          // Rafraîchir la liste pour enlever le gras si nécessaire
          await get().fetchConversations();
        } catch (error: any) {
          set({ error: error.message });
        }
      },

      fetchUnreadCount: async () => {
        try {
          const unreadCount = await conversationsApi.getUnreadCount();
          set({ unreadCount });
        } catch (error: any) {
          console.log('Erreur compteur messages non lus:', error);
        }
      },

      deleteConversation: async (conversationId) => {
        set({ isLoading: true, error: null });
        try {
          await conversationsApi.delete(conversationId);
          
          set((state) => ({
            conversations: state.conversations.filter((conv) => conv.id !== conversationId),
            currentConversation: state.currentConversation?.id === conversationId 
              ? null 
              : state.currentConversation,
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la suppression de la conversation', 
            isLoading: false 
          });
          throw error;
        }
      },

      deleteMessage: async (messageId) => {
        // On ne met pas isLoading global pour la suppression d'un message
        set({ error: null });
        try {
          await messagesApi.delete(messageId);
          
          set((state) => {
            if (!state.currentConversation) return {};
            
            return {
              currentConversation: {
                ...state.currentConversation,
                messages: state.currentConversation.messages.filter((msg) => msg.id !== messageId)
              }
            };
          });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la suppression du message'
          });
          throw error;
        }
      },

      clearError: () => set({ error: null }),
      
      reset: () => set({ 
        conversations: [], 
        currentConversation: null, 
        unreadCount: 0,
        error: null 
      }),
    }),
    {
      name: STORAGE_KEYS.CONVERSATION_STORE,
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
        conversations: state.conversations,
        currentConversation: state.currentConversation,
        unreadCount: state.unreadCount,
      }),
    }
  )
);