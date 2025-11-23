import '../global.css';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from '@/lib/hooks/useColorScheme';

// Import des variantes de la police Inter
import {
  Inter_300Light,
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
} from '@expo-google-fonts/inter';

// Import du header personnalisé
import AppHeader from '@/components/layout/AppHeader';

// ✅ AJOUT : Import du ToastProvider
import { ToastProvider } from '@/components/ui/Toast';

// Empêche l'écran de démarrage de disparaître avant le chargement des polices
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();

  // Chargement des polices
  const [loaded] = useFonts({
    Inter: Inter_400Regular,
    'Inter-Light': Inter_300Light,
    'Inter-Medium': Inter_500Medium,
    'Inter-SemiBold': Inter_600SemiBold,
    'Inter-Bold': Inter_700Bold,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    // ✅ AJOUT : Envelopper avec ToastProvider
    <ToastProvider>
      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
        <Stack
          screenOptions={{
            // Header personnalisé global
            header: (props) => <AppHeader />,
            // Animation de navigation
            animation: 'slide_from_right',
          }}
        >
          {/* Les tabs n'ont pas de header (géré par le header global) */}
          <Stack.Screen 
            name="(tabs)" 
            options={{ 
              headerShown: true, // Afficher le header global
            }} 
          />
          
          {/* ✅ AJOUT : Route pour le groupe (auth) */}
          <Stack.Screen 
            name="(auth)" 
            options={{ 
              headerShown: false, // Pas de header pour les pages d'authentification
            }} 
          />
          
          {/* ✅ AJOUT : Route pour le groupe (protected) */}
          <Stack.Screen 
            name="(protected)" 
            options={{ 
              headerShown: true, // Header pour les pages protégées
            }} 
          />
          
          {/* Page 404 */}
          <Stack.Screen 
            name="+not-found"
            options={{
              headerShown: true,
              header: () => <AppHeader title="Page introuvable"/>,
            }}
          />
        </Stack>
      </ThemeProvider>
    </ToastProvider>
  );
}