import * as SecureStore from 'expo-secure-store';

/**
 * Gestionnaire centralisé pour les tokens d'authentification
 * Utilisé par l'API client et le store auth pour éviter les cycles de dépendances
 */

const TOKEN_KEYS = {
  AUTH: 'authToken',
  REFRESH: 'refreshToken',
} as const;

export const tokenManager = {
  /**
   * Récupérer le token d'authentification
   */
  async getAuthToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEYS.AUTH);
    } catch (error) {
      console.error('[Token Manager] Erreur récupération auth token:', error);
      return null;
    }
  },

  /**
   * Récupérer le refresh token
   */
  async getRefreshToken(): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(TOKEN_KEYS.REFRESH);
    } catch (error) {
      console.error('[Token Manager] Erreur récupération refresh token:', error);
      return null;
    }
  },

  /**
   * Sauvegarder le token d'authentification
   */
  async setAuthToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEYS.AUTH, token);
    } catch (error) {
      console.error('[Token Manager] Erreur sauvegarde auth token:', error);
      throw error;
    }
  },

  /**
   * Sauvegarder le refresh token
   */
  async setRefreshToken(token: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(TOKEN_KEYS.REFRESH, token);
    } catch (error) {
      console.error('[Token Manager] Erreur sauvegarde refresh token:', error);
      throw error;
    }
  },

  /**
   * Sauvegarder les deux tokens en une seule fois
   */
  async setTokens(authToken: string, refreshToken?: string): Promise<void> {
    await this.setAuthToken(authToken);
    if (refreshToken) {
      await this.setRefreshToken(refreshToken);
    }
  },

  /**
   * Supprimer le token d'authentification
   */
  async clearAuthToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEYS.AUTH);
    } catch (error) {
      console.error('[Token Manager] Erreur suppression auth token:', error);
    }
  },

  /**
   * Supprimer le refresh token
   */
  async clearRefreshToken(): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEYS.REFRESH);
    } catch (error) {
      console.error('[Token Manager] Erreur suppression refresh token:', error);
    }
  },

  /**
   * Supprimer tous les tokens
   */
  async clearAllTokens(): Promise<void> {
    await Promise.all([
      this.clearAuthToken(),
      this.clearRefreshToken(),
    ]);
  },

  /**
   * Vérifier si un token d'authentification existe
   */
  async hasAuthToken(): Promise<boolean> {
    const token = await this.getAuthToken();
    return !!token;
  },
};

/**
 * Callback appelé quand les tokens sont invalides et que l'utilisateur doit être déconnecté
 * Ce callback sera défini par le store d'authentification
 */
let onTokensInvalidCallback: (() => void) | null = null;

export const setOnTokensInvalidCallback = (callback: () => void) => {
  onTokensInvalidCallback = callback;
};

export const triggerTokensInvalid = () => {
  if (onTokensInvalidCallback) {
    onTokensInvalidCallback();
  }
};