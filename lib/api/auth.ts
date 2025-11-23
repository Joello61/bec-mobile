import apiClient from './client';
import { endpoints } from './endpoints';
import { tokenManager } from '@/lib/utils/tokenManager';
import type { 
  LoginInput, 
  RegisterInput, 
  User,
  LoginResponse,
  RegisterResponse,
  ChangePasswordInput,
  ForgotPasswordInput,
  ResetPasswordInput,
  VerifyEmailInput,
  VerifyPhoneInput,
  ResendVerificationInput,
  CompleteProfileInput,
} from '@/types';
import type { 
  VerifyEmailResponse, 
  CompleteProfileResponse,
  ProfileStatusResponse
} from '@/types/api';

export const authApi = {
  /**
   * Connexion utilisateur
   */
  async login(data: LoginInput): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(endpoints.auth.login, data);
    
    // Utiliser tokenManager au lieu de SecureStore directement
    if (response.data.token) {
      await tokenManager.setAuthToken(response.data.token);
    }
    
    if (response.data.refresh_token) {
      await tokenManager.setRefreshToken(response.data.refresh_token);
    }
    
    return response.data;
  },

  /**
   * Inscription utilisateur
   */
  async register(data: RegisterInput): Promise<RegisterResponse> {
    const response = await apiClient.post<RegisterResponse>(endpoints.auth.register, data);
    return response.data;
  },

  /**
   * Déconnexion
   */
  async logout(): Promise<void> {
    try {
      // Appel API pour invalider le token côté serveur
      await apiClient.post(endpoints.auth.logout);
    } catch (error) {
      console.error('[Auth API] Erreur lors du logout:', error);
    } finally {
      await tokenManager.clearAllTokens();
    }
  },

  /**
   * Récupérer l'utilisateur connecté
   */
  async me(): Promise<User> {
    const response = await apiClient.get<User>(endpoints.auth.me);
    return response.data;
  },

  /**
   * Vérifier l'email
   */
  async verifyEmail(data: VerifyEmailInput): Promise<VerifyEmailResponse> {
    const response = await apiClient.post<VerifyEmailResponse>(
      endpoints.auth.verifyEmail, 
      data
    );

    if (response.data.token) {
      await tokenManager.setAuthToken(response.data.token);
    }
    
    if (response.data.refresh_token) {
      await tokenManager.setRefreshToken(response.data.refresh_token);
    }
    
    return response.data;
  },

  /**
   * Vérifier le téléphone (SMS)
   */
  async verifyPhone(data: VerifyPhoneInput): Promise<void> {
    await apiClient.post(endpoints.auth.verifyPhone, data);
  },

  /**
   * Renvoyer l'email de vérification
   */
  async resendVerification(data: ResendVerificationInput): Promise<void> {
    await apiClient.post(endpoints.auth.resendVerification, data);
  },

  /**
   * Mot de passe oublié
   */
  async forgotPassword(data: ForgotPasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.forgotPassword, data);
  },

  /**
   * Réinitialiser le mot de passe
   */
  async resetPassword(data: ResetPasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.resetPassword, data);
  },

  /**
   * Changer le mot de passe (utilisateur connecté)
   */
  async changePassword(data: ChangePasswordInput): Promise<void> {
    await apiClient.post(endpoints.auth.changePassword, data);
  },

  /**
   * Obtenir l'URL d'authentification Google
   */
  async getGoogleAuthUrl(): Promise<{ authUrl: string; state: string }> {
    const response = await apiClient.get(endpoints.auth.googleAuth);
    return response.data;
  },

  /**
   * Obtenir l'URL d'authentification Facebook
   */
  async getFacebookAuthUrl(): Promise<{ authUrl: string; state: string }> {
    const response = await apiClient.get(endpoints.auth.facebookAuth);
    return response.data;
  },

  /**
   * Vérifier le statut du profil (complet ou non)
   */
  async getProfileStatus(): Promise<ProfileStatusResponse> {
    const response = await apiClient.get<ProfileStatusResponse>(
      endpoints.users.profileStatus
    );
    return response.data;
  },

  /**
   * Compléter le profil après inscription
   * Envoie un SMS de vérification automatiquement
   */
  async completeProfile(data: CompleteProfileInput): Promise<CompleteProfileResponse> {
    const response = await apiClient.post<CompleteProfileResponse>(
      endpoints.users.completeProfile,
      data
    );
    return response.data;
  },

  // ==================== MÉTHODES UTILITAIRES ====================

  /**
   * Récupérer le token JWT stocké localement
   */
  async getStoredToken(): Promise<string | null> {
    return await tokenManager.getAuthToken();
  },

  /**
   * Récupérer le refresh token stocké localement
   */
  async getStoredRefreshToken(): Promise<string | null> {
    return await tokenManager.getRefreshToken();
  },

  /**
   * Vérifier si l'utilisateur est connecté
   */
  async isAuthenticated(): Promise<boolean> {
    return await tokenManager.hasAuthToken();
  },

  /**
   * Supprimer tous les tokens (utilisé en cas d'erreur ou corruption)
   */
  async clearTokens(): Promise<void> {
    await tokenManager.clearAllTokens();
  },

  /**
   * Connexion OAuth Google (callback après authentification)
   */
  async handleGoogleOAuthCallback(code: string, state: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      endpoints.auth.googleCallback || '/auth/google/callback',
      { code, state }
    );
    
    if (response.data.token) {
      await tokenManager.setTokens(
        response.data.token,
        response.data.refresh_token
      );
    }
    
    return response.data;
  },

  /**
   * Connexion OAuth Facebook (callback après authentification)
   */
  async handleFacebookOAuthCallback(code: string, state: string): Promise<LoginResponse> {
    const response = await apiClient.post<LoginResponse>(
      endpoints.auth.facebookCallback || '/auth/facebook/callback',
      { code, state }
    );
    
    if (response.data.token) {
      await tokenManager.setTokens(
        response.data.token,
        response.data.refresh_token
      );
    }
    
    return response.data;
  },
};

export default authApi;