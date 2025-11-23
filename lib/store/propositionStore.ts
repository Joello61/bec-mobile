import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { propositionsApi } from '@/lib/api/propositions';
import { storage, STORAGE_KEYS } from '@/lib/utils/storage';
import type { 
  Proposition, 
  CreatePropositionInput, 
  RespondPropositionInput 
} from '@/types';

interface PropositionState {
  currentProposition: Proposition | null;
  propositions: Proposition[]; // Liste filtrée par voyage
  myPropositionsSent: Proposition[]; // Mes offres envoyées
  myPropositionsReceived: Proposition[]; // Offres reçues sur mes voyages
  pendingCount: number;
  isLoading: boolean;
  error: string | null;
  
  // Actions
  getById: (propositionId: number) => Promise<Proposition>;
  createProposition: (voyageId: number, data: CreatePropositionInput) => Promise<Proposition>;
  deleteProposition: (propositionId: number) => Promise<void>;
  respondToProposition: (propositionId: number, data: RespondPropositionInput) => Promise<void>;
  fetchPropositionsByVoyage: (voyageId: number) => Promise<void>;
  fetchAcceptedByVoyage: (voyageId: number) => Promise<void>;
  fetchMyPropositionsSent: () => Promise<void>;
  fetchMyPropositionsReceived: () => Promise<void>;
  fetchPendingCount: () => Promise<void>;
  clearError: () => void;
  reset: () => void;
}

export const usePropositionStore = create<PropositionState>()(
  persist(
    (set) => ({
      currentProposition: null,
      propositions: [],
      myPropositionsSent: [],
      myPropositionsReceived: [],
      pendingCount: 0,
      isLoading: false,
      error: null,

      getById: async (propositionId: number) => {
        set({ isLoading: true, error: null });
        try {
          const proposition = await propositionsApi.getById(propositionId);
          set({ currentProposition: proposition, isLoading: false });
          return proposition;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement de la proposition', 
            isLoading: false 
          });
          throw error;
        }
      },

      createProposition: async (voyageId, data) => {
        set({ isLoading: true, error: null });
        try {
          const proposition = await propositionsApi.create(voyageId, data);
          set((state) => ({ 
            myPropositionsSent: [proposition, ...state.myPropositionsSent],
            isLoading: false 
          }));
          return proposition;
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la création de la proposition', 
            isLoading: false 
          });
          throw error;
        }
      },

      respondToProposition: async (propositionId, data) => {
        set({ isLoading: true, error: null });
        try {
          const updatedProposition = await propositionsApi.respond(propositionId, data);
          set((state) => ({
            // Mise à jour dans la liste des reçues
            myPropositionsReceived: state.myPropositionsReceived.map((p) => 
              p.id === propositionId ? updatedProposition : p
            ),
            // Mise à jour dans la liste spécifique au voyage si chargée
            propositions: state.propositions.map((p) => 
              p.id === propositionId ? updatedProposition : p
            ),
            // Mise à jour de la proposition courante si c'est celle-ci
            currentProposition: state.currentProposition?.id === propositionId 
              ? updatedProposition 
              : state.currentProposition,
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de la réponse à la proposition', 
            isLoading: false 
          });
          throw error;
        }
      },

      deleteProposition: async (propositionId: number) => {
        set({ isLoading: true, error: null });
        try {
          await propositionsApi.delete(propositionId);
          set((state) => ({
            myPropositionsSent: state.myPropositionsSent.map((p) => 
              p.id === propositionId ? { ...p, status: 'annulee' } : p
            ),
            propositions: state.propositions.map((p) => 
              p.id === propositionId ? { ...p, status: 'annulee' } : p
            ),
            isLoading: false
          }));
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors de l\'annulation de la proposition', 
            isLoading: false 
          });
          throw error;
        }
      },

      fetchPropositionsByVoyage: async (voyageId) => {
        set({ isLoading: true, error: null });
        try {
          const propositions = await propositionsApi.getByVoyage(voyageId);
          set({ propositions, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des propositions', 
            isLoading: false 
          });
        }
      },

      fetchAcceptedByVoyage: async (voyageId) => {
        set({ isLoading: true, error: null });
        try {
          const propositions = await propositionsApi.getAcceptedByVoyage(voyageId);
          set({ propositions, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des propositions acceptées', 
            isLoading: false 
          });
        }
      },

      fetchMyPropositionsSent: async () => {
        set({ isLoading: true, error: null });
        try {
          const propositions = await propositionsApi.getMySent();
          set({ myPropositionsSent: propositions, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement de vos propositions', 
            isLoading: false 
          });
        }
      },

      fetchMyPropositionsReceived: async () => {
        set({ isLoading: true, error: null });
        try {
          const propositions = await propositionsApi.getMyReceived();
          set({ myPropositionsReceived: propositions, isLoading: false });
        } catch (error: any) {
          set({ 
            error: error.message || 'Erreur lors du chargement des propositions reçues', 
            isLoading: false 
          });
        }
      },

      fetchPendingCount: async () => {
        try {
          const count = await propositionsApi.getMyPendingCount();
          set({ pendingCount: count });
        } catch (error: any) {
          // Silent fail pour le compteur
          console.error('Erreur lors du comptage des propositions:', error);
        }
      },

      clearError: () => set({ error: null }),
      
      reset: () => set({ 
        currentProposition: null,
        propositions: [], 
        myPropositionsSent: [],
        myPropositionsReceived: [],
        pendingCount: 0,
        error: null 
      }),
    }),
    {
      name: STORAGE_KEYS.PROPOSITION_STORE,
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
        myPropositionsSent: state.myPropositionsSent,
        myPropositionsReceived: state.myPropositionsReceived,
        pendingCount: state.pendingCount,
        currentProposition: state.currentProposition,
      }),
    }
  )
);