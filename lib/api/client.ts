import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import type { ApiError } from '@/types';
import { tokenManager, triggerTokensInvalid } from '@/lib/utils/tokenManager';

const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || process.env.API_BASE_URL || 'http://localhost:8000/api',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Client-Platform': 'mobile',
  },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: { resolve: (value?: any) => void; reject: (reason?: any) => void }[] = [];

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur de requête
apiClient.interceptors.request.use(
  async (config) => {
    try {
      // Récupérer le token depuis tokenManager (pas de dépendance circulaire)
      const token = await tokenManager.getAuthToken();
      
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('[API Client] Erreur lors de la récupération du token:', error);
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur de réponse
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Gestion du 401 (token expiré)
    if (
      error.response?.status === 401 && 
      originalRequest && 
      originalRequest.url !== '/token/refresh' && 
      !originalRequest._retry
    ) {
      // Si un refresh est déjà en cours, mettre la requête en attente
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => apiClient(originalRequest));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log('[API Interceptor] Token JWT expiré. Tentative de rafraîchissement...');
        
        const refreshToken = await tokenManager.getRefreshToken();
        
        if (!refreshToken) {
          throw new Error('Pas de refresh token disponible');
        }

        // Appel au endpoint de refresh avec le refresh token
        const response = await apiClient.post('/token/refresh', {
          refresh_token: refreshToken,
        });

        const { token: newToken, refresh_token: newRefreshToken } = response.data;
        
        // Sauvegarder les nouveaux tokens via tokenManager
        if (newToken) {
          await tokenManager.setAuthToken(newToken);
        }
        
        if (newRefreshToken) {
          await tokenManager.setRefreshToken(newRefreshToken);
        }

        console.log('[API Interceptor] Token rafraîchi avec succès. Reprise des requêtes...');
        
        processQueue(null);
        
        // Réessayer la requête originale avec le nouveau token
        return apiClient(originalRequest);

      } catch (refreshError: any) {
        console.error('[API Interceptor] Échec du rafraîchissement du token:', refreshError);
        processQueue(refreshError);

        // Supprimer les tokens via tokenManager
        await tokenManager.clearAllTokens();
        
        // Déclencher le callback de déconnexion (défini par authStore)
        triggerTokensInvalid();

        return Promise.reject(refreshError);

      } finally {
        isRefreshing = false;
      }
    }

    // Gestion des erreurs
    if (error.response) {
      const apiError: ApiError = {
        success: false,
        message: error.response.data?.message || 'Une erreur est survenue',
        statusCode: error.response.status,
        errors: error.response.data?.errors,
        debug: error.response.data?.debug,
      };
      return Promise.reject(apiError);
    } else if (error.request) {
      return Promise.reject({
        success: false,
        message: 'Impossible de contacter le serveur',
        statusCode: 0,
      });
    } else {
      return Promise.reject({
        success: false,
        message: error.message || 'Erreur inconnue',
        statusCode: 0,
      });
    }
  }
);

export default apiClient;