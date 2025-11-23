import AsyncStorage from '@react-native-async-storage/async-storage';
import * as SecureStore from 'expo-secure-store';

/**
 * Storage Utilities pour React Native
 * 
 * Deux types de stockage :
 * 1. AsyncStorage : Données normales (non sensibles)
 * 2. SecureStore : Données sensibles (tokens, mots de passe)
 */

// ==================== ASYNC STORAGE (données normales) ====================

export const storage = {
  /**
   * Récupérer une valeur
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`[Storage] Erreur getItem(${key}):`, error);
      return null;
    }
  },

  /**
   * Stocker une valeur
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await AsyncStorage.setItem(key, value);
    } catch (error) {
      console.error(`[Storage] Erreur setItem(${key}):`, error);
    }
  },

  /**
   * Supprimer une valeur
   */
  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`[Storage] Erreur removeItem(${key}):`, error);
    }
  },

  /**
   * Supprimer plusieurs valeurs
   */
  async removeItems(keys: string[]): Promise<void> {
    try {
      await AsyncStorage.multiRemove(keys);
    } catch (error) {
      console.error('[Storage] Erreur removeItems:', error);
    }
  },

  /**
   * Tout supprimer
   */
  async clear(): Promise<void> {
    try {
      await AsyncStorage.clear();
    } catch (error) {
      console.error('[Storage] Erreur clear:', error);
    }
  },

  /**
   * Récupérer toutes les clés
   */
  async getAllKeys(): Promise<string[]> {
    try {
        const keys = await AsyncStorage.getAllKeys();
        return keys.slice();
    } catch (error) {
        console.error('[Storage] Erreur getAllKeys:', error);
        return [];
    }
},

  /**
   * Récupérer un objet JSON
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await AsyncStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[Storage] Erreur getObject(${key}):`, error);
      return null;
    }
  },

  /**
   * Stocker un objet JSON
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[Storage] Erreur setObject(${key}):`, error);
    }
  },
};

// ==================== SECURE STORE (données sensibles) ====================

export const secureStorage = {
  /**
   * Récupérer une valeur sécurisée
   */
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Erreur getItem(${key}):`, error);
      return null;
    }
  },

  /**
   * Stocker une valeur sécurisée
   */
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[SecureStorage] Erreur setItem(${key}):`, error);
    }
  },

  /**
   * Supprimer une valeur sécurisée
   */
  async removeItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[SecureStorage] Erreur removeItem(${key}):`, error);
    }
  },

  /**
   * Supprimer plusieurs valeurs sécurisées
   */
  async removeItems(keys: string[]): Promise<void> {
    try {
      await Promise.all(keys.map(key => SecureStore.deleteItemAsync(key)));
    } catch (error) {
      console.error('[SecureStorage] Erreur removeItems:', error);
    }
  },

  /**
   * Récupérer un objet JSON sécurisé
   */
  async getObject<T>(key: string): Promise<T | null> {
    try {
      const value = await SecureStore.getItemAsync(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.error(`[SecureStorage] Erreur getObject(${key}):`, error);
      return null;
    }
  },

  /**
   * Stocker un objet JSON sécurisé
   */
  async setObject<T>(key: string, value: T): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, JSON.stringify(value));
    } catch (error) {
      console.error(`[SecureStorage] Erreur setObject(${key}):`, error);
    }
  },
};

// ==================== CLÉS DE STOCKAGE ====================

/**
 * Clés standardisées pour le stockage
 * Utiliser ces constantes pour éviter les erreurs de typo
 */
export const STORAGE_KEYS = {
  // Tokens (SecureStore)
  AUTH_TOKEN: 'authToken',
  REFRESH_TOKEN: 'refreshToken',
  MERCURE_TOKEN: 'mercureToken',
  
  // Données utilisateur (AsyncStorage)
  USER_DATA: 'userData',
  
  // Préférences (AsyncStorage)
  THEME: 'theme',
  LANGUAGE: 'language',
  
  // Stores Zustand (AsyncStorage)
  AUTH_STORE: 'auth-storage',
  DEMANDE_STORE: 'demande-storage',
  VOYAGE_STORE: 'voyage-storage',
  PROPOSITION_STORE: 'proposition-storage',
  CONVERSATION_STORE: 'conversation-storage',
  NOTIFICATION_STORE: 'notification-storage',
  FAVORI_STORE: 'favori-storage',
  AVIS_STORE: 'avis-storage',
  SIGNALEMENT_STORE: 'signalement-storage',
  ADDRESS_STORE: 'address-storage',
  SETTINGS_STORE: 'settings-storage',
  CURRENCY_STORE: 'currency-storage',
  GEO_STORE: 'geo-storage',
  CONTACT_STORE: 'contact-storage',
  REALTIME_NOTIFICATION_STORE: 'realtime-notification-storage',
  USER_STORE: 'user-storage',
};

// ==================== HELPERS ====================

/**
 * Créer un storage personnalisé pour Zustand
 * Utilise AsyncStorage pour la persistance
 */
export const createZustandStorage = () => ({
  getItem: async (name: string): Promise<string | null> => {
    return await storage.getItem(name);
  },
  setItem: async (name: string, value: string): Promise<void> => {
    await storage.setItem(name, value);
  },
  removeItem: async (name: string): Promise<void> => {
    await storage.removeItem(name);
  },
});

/**
 * Nettoyer tous les tokens
 */
export const clearAuthTokens = async (): Promise<void> => {
  await secureStorage.removeItems([
    STORAGE_KEYS.AUTH_TOKEN,
    STORAGE_KEYS.REFRESH_TOKEN,
    STORAGE_KEYS.MERCURE_TOKEN,
  ]);
};

/**
 * Nettoyer toutes les données de l'app (logout complet)
 */
export const clearAllData = async (): Promise<void> => {
  await clearAuthTokens();
  await storage.clear();
};

export default {
  storage,
  secureStorage,
  STORAGE_KEYS,
  createZustandStorage,
  clearAuthTokens,
  clearAllData,
};