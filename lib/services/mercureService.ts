import RNEventSource from 'react-native-event-source';
import * as SecureStore from 'expo-secure-store';
import apiClient from '../api/client';
import { EventTypeValue } from '../utils/eventType';

/**
 * Service Mercure pour React Native
 */
class MercureService {
  private eventSource: RNEventSource | null = null;
  private topics: Set<string> = new Set();
  private eventListeners: Map<string, ((data: any) => void)[]> = new Map();
  private prefixListeners: Map<string, ((eventType: string, data: any) => void)[]> = new Map();
  private anyListeners: ((eventType: string, data: any) => void)[] = [];

  private readonly MERCURE_HUB_URL = 
    process.env.EXPO_PUBLIC_MERCURE_HUB_URL || 
    process.env.MERCURE_HUB_URL;
  
  private readonly isDev = __DEV__;

  private isRefreshing = false;
  private refreshAttemptCount = 0;
  private readonly MAX_REFRESH_ATTEMPTS = 3;

  /**
   * Se connecter au hub Mercure
   */
  public async connect(): Promise<void> {
    if (this.eventSource || !this.MERCURE_HUB_URL) return;

    try {
      const mercureToken = await SecureStore.getItemAsync('mercureToken');
      
      if (!mercureToken) {
        this.log('Pas de token Mercure disponible', true);
        return;
      }

      // Construire l'URL avec les topics
      const url = new URL(this.MERCURE_HUB_URL);
      this.topics.forEach((topic) => url.searchParams.append('topic', topic));
      
      url.searchParams.append('authorization', mercureToken);

      this.log('Connexion Mercure…');
      
      this.eventSource = new RNEventSource(url.toString());

      // Event: Connexion ouverte
      this.eventSource.addEventListener('open', () => {
        this.log('Connexion Mercure ouverte');
        this.refreshAttemptCount = 0;
      });

      // Event: Message reçu
      this.eventSource.addEventListener('message', (event: any) => {
        try {
          const eventData = JSON.parse(event.data);
          const { eventType, data } = eventData;
          if (!eventType) return;

          // Dispatcher aux listeners spécifiques
          this.eventListeners.get(eventType)?.forEach((cb) => cb(data));

          // Dispatcher aux listeners par préfixe
          this.prefixListeners.forEach((listeners, prefix) => {
            if (eventType.startsWith(prefix)) {
              listeners.forEach((cb) => cb(eventType, data));
            }
          });

          // Dispatcher aux listeners globaux
          this.anyListeners.forEach((cb) => cb(eventType, data));
        } catch (error) {
          this.log('Erreur de parsing Mercure', true);
        }
      });

      // Event: Erreur de connexion
      this.eventSource.addEventListener('error', (error: any) => {
        if (this.eventSource && (this.eventSource as any).readyState === 2) {
          this.log('Connexion Mercure fermée. Tentative de rafraîchissement…', true);
          this.attemptMercureTokenRefresh();
        } else {
          this.log('Erreur EventSource (reconnexion auto…)', true);
        }
      });

    } catch (error) {
      this.log(`Erreur lors de la connexion Mercure: ${error}`, true);
    }
  }

  /**
   * Tenter de rafraîchir le token Mercure
   */
  private async attemptMercureTokenRefresh(): Promise<void> {
    if (this.isRefreshing || this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
      if (this.refreshAttemptCount >= this.MAX_REFRESH_ATTEMPTS) {
        this.log('Tentatives de rafraîchissement épuisées — déconnexion.', true);
        this.disconnect();
      }
      return;
    }

    this.isRefreshing = true;
    this.refreshAttemptCount++;

    try {
      const response = await apiClient.post<{ mercure_token: string }>(
        '/token/mercure/refresh'
      );
      
      if (response.data.mercure_token) {
        await SecureStore.setItemAsync('mercureToken', response.data.mercure_token);
        this.log('Token Mercure rafraîchi avec succès.');
        this.reconnect();
      } else {
        throw new Error('Pas de token Mercure dans la réponse');
      }
    } catch (error) {
      this.log('Échec du rafraîchissement du token Mercure.', true);
      this.disconnect();
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Se déconnecter du hub Mercure
   */
  public disconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    this.topics.clear();
    this.eventListeners.clear();
    this.prefixListeners.clear();
    this.anyListeners = [];
  }

  /**
   * S'abonner à un type d'événement spécifique
   */
  public on(eventType: EventTypeValue, callback: (data: any) => void): () => void {
    if (!this.eventListeners.has(eventType)) {
      this.eventListeners.set(eventType, []);
    }
    this.eventListeners.get(eventType)!.push(callback);

    return () => {
      const list = this.eventListeners.get(eventType);
      if (list) this.eventListeners.set(eventType, list.filter((cb) => cb !== callback));
    };
  }

  /**
   * S'abonner à tous les événements commençant par un préfixe
   */
  public onPrefix(prefix: string, callback: (eventType: string, data: any) => void): () => void {
    if (!this.prefixListeners.has(prefix)) {
      this.prefixListeners.set(prefix, []);
    }
    this.prefixListeners.get(prefix)!.push(callback);

    return () => {
      const list = this.prefixListeners.get(prefix);
      if (list) this.prefixListeners.set(prefix, list.filter((cb) => cb !== callback));
    };
  }

  /**
   * S'abonner à tous les événements
   */
  public onAny(callback: (eventType: string, data: any) => void): () => void {
    this.anyListeners.push(callback);
    return () => {
      this.anyListeners = this.anyListeners.filter((cb) => cb !== callback);
    };
  }

  /**
   * Ajouter un topic à écouter
   */
  public addTopic(topic: string): void {
    if (!this.topics.has(topic)) {
      this.topics.add(topic);
      this.reconnect();
    }
  }

  /**
   * Retirer un topic
   */
  public removeTopic(topic: string): void {
    if (this.topics.has(topic)) {
      this.topics.delete(topic);
      this.reconnect();
    }
  }

  /**
   * Reconnecter le service Mercure
   */
  private reconnect(): void {
    this.eventSource?.close();
    this.eventSource = null;
    setTimeout(() => this.connect(), 500);
  }

  /**
   * Log utile en dev uniquement
   */
  private log(message: string, isError = false): void {
    if (this.isDev) {
      if (isError) console.warn(`[Mercure] ${message}`);
      else console.log(`[Mercure] ${message}`);
    }
  }
}

export const mercureService = new MercureService();