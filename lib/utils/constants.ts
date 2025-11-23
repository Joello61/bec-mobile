export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Routes
export const ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  PUBLIC_EXPLORE: '/explore',
  CONTACT: '/contact',
  TERMS: '/legal/terms',
  PRIVACY: '/legal/privacy',
  COOKIES: '/legal/cookies',
  FAQ: '/faq',
  HOW_IT_WORKS: '/how-it-works',
  TRUST_SAFETY: '/legal/trust-safety',
  LOGIN: '/auth/login',
  REGISTER: '/auth/register',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  AUTH_CHANGE_PASSWORD: '/dashboard/profile/change-password',

  // ==================== NOUVELLES ROUTES AUTH ====================
  VERIFY_EMAIL: '/auth/verify-email',
  COMPLETE_PROFILE: '/dashboard/complete-profile',
  DASHBOARD: '/dashboard',
  EXPLORE: '/dashboard/explore',
  VOYAGE_DETAILS: (id: number) => `/dashboard/explore/voyage/${id}`,
  DEMANDE_DETAILS: (id: number) => `/dashboard/explore/demande/${id}`,
  MES_VOYAGES: '/dashboard/mes-voyages',
  MES_VOYAGE_DETAILS: (id: number) => `/dashboard/mes-voyages/${id}`,
  MES_DEMANDES: '/dashboard/mes-demandes',
  MES_DEMANDE_DETAILS: (id: number) => `/dashboard/mes-demandes/${id}`,
  MES_PROPOSITIONS: '/dashboard/mes-propositions',
  MES_PROPOSITION_DETAILS: (id: number) =>
    `/dashboard/mes-propositions/${id}`,
  MESSAGES: '/dashboard/messages',
  CONVERSATION: (id: number) => `/dashboard/messages/${id}`,
  NOTIFICATIONS: '/dashboard/notifications',
  FAVORIS: '/dashboard/favoris',
  PROFILE: '/dashboard/profile',
  USER_PROFILE: (id: number) => `/dashboard/users/${id}`,
  PROFILE_ADDRESS: '/dashboard/profile/address',
  SETTINGS: '/dashboard/settings',
  HELP: '/dashboard/help',
  SIGNALEMENTS: '/dashboard/signalements',
} as const;


// Statuts
export const VOYAGE_STATUTS = [
  { value: 'actif', label: 'Actif', color: 'success' },
  { value: 'complet', label: 'Complet', color: 'warning' },
  { value: 'termine', label: 'Terminé', color: 'neutral' },
  { value: 'annule', label: 'Annulé', color: 'error' },
] as const;

export const DEMANDE_STATUTS = [
  { value: 'en_recherche', label: 'En recherche', color: 'info' },
  { value: 'voyageur_trouve', label: 'Voyageur trouvé', color: 'success' },
  { value: 'annulee', label: 'Annulée', color: 'error' },
] as const;

export const SIGNALEMENT_MOTIFS = [
  { value: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam' },
  { value: 'arnaque', label: 'Arnaque' },
  { value: 'objet_illegal', label: 'Objet illégal' },
  { value: 'autre', label: 'Autre' },
] as const;

// Notes
export const NOTES = [1, 2, 3, 4, 5] as const;

// Pagination
export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [10, 20, 50, 100] as const;

// Limites
export const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
export const ACCEPTED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
] as const;
export const MAX_MESSAGE_LENGTH = 2000;
export const MAX_DESCRIPTION_LENGTH = 1000;
export const MAX_BIO_LENGTH = 500;

// Durées (en ms)
export const TOAST_DURATION = 3000;
export const DEBOUNCE_DELAY = 300;
export const NOTIFICATION_REFRESH_INTERVAL = 30000; // 30s
export const MESSAGE_REFRESH_INTERVAL = 30000; // 30s

// Règles métier
export const MIN_WEIGHT = 0.1;
export const MAX_WEIGHT = 100;
export const MIN_AVIS_NOTE = 1;
export const MAX_AVIS_NOTE = 5;

// Messages
export const ERROR_MESSAGES = {
  GENERIC: 'Une erreur est survenue',
  NETWORK: 'Erreur de connexion. Vérifiez votre connexion internet.',
  UNAUTHORIZED: 'Vous devez être connecté pour accéder à cette page',
  FORBIDDEN: "Vous n'avez pas les droits pour effectuer cette action",
  NOT_FOUND: "La ressource demandée n'existe pas",
  VALIDATION: 'Veuillez vérifier les informations saisies',
  // ==================== NOUVEAU ====================
  PROFILE_INCOMPLETE:
    'Vous devez compléter votre profil pour effectuer cette action',
  EMAIL_NOT_VERIFIED: 'Veuillez vérifier votre adresse email',
} as const;

export const SUCCESS_MESSAGES = {
  LOGIN: 'Connexion réussie',
  REGISTER: 'Inscription réussie',
  LOGOUT: 'Déconnexion réussie',
  CREATE: 'Création réussie',
  UPDATE: 'Modification réussie',
  DELETE: 'Suppression réussie',
  MESSAGE_SENT: 'Message envoyé',
  AVIS_CREATED: 'Avis publié',
  FAVORI_ADDED: 'Ajouté aux favoris',
  FAVORI_REMOVED: 'Retiré des favoris',
  SIGNALEMENT_SENT: 'Signalement envoyé',
  // ==================== NOUVEAU ====================
  EMAIL_VERIFIED: 'Email vérifié avec succès',
  PHONE_VERIFIED: 'Téléphone vérifié avec succès',
  PROFILE_COMPLETED: 'Profil complété avec succès',
} as const;

// Liens sociaux
export const SOCIAL_LINKS = {
  FACEBOOK: 'https://facebook.com',
  TWITTER: 'https://twitter.com',
  INSTAGRAM: 'https://instagram.com',
  LINKEDIN: 'https://linkedin.com',
} as const;

// Contact
export const CONTACT = {
  EMAIL: 'support@cobage.joeltech.dev',
  PHONE: '+330752892073',
  ADDRESS: 'Toulouse, France',
} as const;
