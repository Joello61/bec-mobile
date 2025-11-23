import * as Notifications from 'expo-notifications';
import * as ImagePicker from 'expo-image-picker';
import * as Location from 'expo-location';
import { Platform, Alert, Linking } from 'react-native';

/** 
 * Permissions Utilities pour React Native
 * 
 * Gestion centralisée de toutes les permissions de l'app
 */

// ==================== TYPES ====================

export type PermissionStatus = 'granted' | 'denied' | 'undetermined';

export interface PermissionResult {
  status: PermissionStatus;
  canAskAgain: boolean;
}

// ==================== NOTIFICATIONS ====================

/**
 * Vérifier si les notifications sont autorisées
 */
export const checkNotificationPermission = async (): Promise<PermissionResult> => {
  try {
    const { status, canAskAgain } = await Notifications.getPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Erreur checkNotificationPermission:', error);
    return { status: 'denied', canAskAgain: false };
  }
};

/**
 * Demander la permission pour les notifications
 */
export const requestNotificationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }
    
    const { status } = await Notifications.requestPermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    // Si refusé, proposer d'aller dans les paramètres
    if (status === 'denied') {
      Alert.alert(
        'Notifications désactivées',
        'Pour recevoir des notifications, veuillez activer les notifications dans les paramètres de votre appareil.',
        [
          { text: 'Plus tard', style: 'cancel' },
          { text: 'Paramètres', onPress: () => Linking.openSettings() },
        ]
      );
    }
    
    return false;
  } catch (error) {
    console.error('[Permissions] Erreur requestNotificationPermission:', error);
    return false;
  }
};

/**
 * Configurer les notifications
 */
export const configureNotifications = async (): Promise<void> => {
  // Configuration pour iOS
  await Notifications.setNotificationHandler({
    handleNotification: async (): Promise<Notifications.NotificationBehavior> => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });

  // Configuration pour Android
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }
};


// ==================== CAMÉRA ====================

/**
 * Vérifier la permission caméra
 */
export const checkCameraPermission = async (): Promise<PermissionResult> => {
  try {
    const { status, canAskAgain } = await ImagePicker.getCameraPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Erreur checkCameraPermission:', error);
    return { status: 'denied', canAskAgain: false };
  }
};

/**
 * Demander la permission caméra
 */
export const requestCameraPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await ImagePicker.getCameraPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }
    
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    if (status === 'denied') {
      Alert.alert(
        'Caméra non autorisée',
        'Pour prendre des photos, veuillez autoriser l\'accès à la caméra dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Paramètres', onPress: () => Linking.openSettings() },
        ]
      );
    }
    
    return false;
  } catch (error) {
    console.error('[Permissions] Erreur requestCameraPermission:', error);
    return false;
  }
};

// ==================== GALERIE PHOTOS ====================

/**
 * Vérifier la permission galerie
 */
export const checkMediaLibraryPermission = async (): Promise<PermissionResult> => {
  try {
    const { status, canAskAgain } = await ImagePicker.getMediaLibraryPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Erreur checkMediaLibraryPermission:', error);
    return { status: 'denied', canAskAgain: false };
  }
};

/**
 * Demander la permission galerie
 */
export const requestMediaLibraryPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await ImagePicker.getMediaLibraryPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }
    
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    if (status === 'denied') {
      Alert.alert(
        'Photos non autorisées',
        'Pour sélectionner des photos, veuillez autoriser l\'accès à la galerie dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Paramètres', onPress: () => Linking.openSettings() },
        ]
      );
    }
    
    return false;
  } catch (error) {
    console.error('[Permissions] Erreur requestMediaLibraryPermission:', error);
    return false;
  }
};

// ==================== LOCALISATION ====================

/**
 * Vérifier la permission localisation
 */
export const checkLocationPermission = async (): Promise<PermissionResult> => {
  try {
    const { status, canAskAgain } = await Location.getForegroundPermissionsAsync();
    return {
      status: status as PermissionStatus,
      canAskAgain,
    };
  } catch (error) {
    console.error('[Permissions] Erreur checkLocationPermission:', error);
    return { status: 'denied', canAskAgain: false };
  }
};

/**
 * Demander la permission localisation
 */
export const requestLocationPermission = async (): Promise<boolean> => {
  try {
    const { status: existingStatus } = await Location.getForegroundPermissionsAsync();
    
    if (existingStatus === 'granted') {
      return true;
    }
    
    const { status } = await Location.requestForegroundPermissionsAsync();
    
    if (status === 'granted') {
      return true;
    }
    
    if (status === 'denied') {
      Alert.alert(
        'Localisation non autorisée',
        'Pour utiliser la localisation, veuillez l\'autoriser dans les paramètres.',
        [
          { text: 'Annuler', style: 'cancel' },
          { text: 'Paramètres', onPress: () => Linking.openSettings() },
        ]
      );
    }
    
    return false;
  } catch (error) {
    console.error('[Permissions] Erreur requestLocationPermission:', error);
    return false;
  }
};

// ==================== HELPERS ====================

/**
 * Demander toutes les permissions essentielles au démarrage
 */
export const requestEssentialPermissions = async (): Promise<{
  notifications: boolean;
  camera: boolean;
  mediaLibrary: boolean;
}> => {
  const [notifications, camera, mediaLibrary] = await Promise.all([
    requestNotificationPermission(),
    requestCameraPermission(),
    requestMediaLibraryPermission(),
  ]);
  
  return { notifications, camera, mediaLibrary };
};

/**
 * Vérifier toutes les permissions
 */
export const checkAllPermissions = async (): Promise<{
  notifications: PermissionResult;
  camera: PermissionResult;
  mediaLibrary: PermissionResult;
  location: PermissionResult;
}> => {
  const [notifications, camera, mediaLibrary, location] = await Promise.all([
    checkNotificationPermission(),
    checkCameraPermission(),
    checkMediaLibraryPermission(),
    checkLocationPermission(),
  ]);
  
  return { notifications, camera, mediaLibrary, location };
};

/**
 * Ouvrir les paramètres de l'app
 */
export const openAppSettings = (): void => {
  Linking.openSettings();
};

export default {
  // Notifications
  checkNotificationPermission,
  requestNotificationPermission,
  configureNotifications,
  
  // Caméra
  checkCameraPermission,
  requestCameraPermission,
  
  // Galerie
  checkMediaLibraryPermission,
  requestMediaLibraryPermission,
  
  // Localisation
  checkLocationPermission,
  requestLocationPermission,
  
  // Helpers
  requestEssentialPermissions,
  checkAllPermissions,
  openAppSettings,
};