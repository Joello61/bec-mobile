import React from 'react';
import { View, Text, TouchableOpacity, Image, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, usePathname } from 'expo-router';
import { useColorScheme } from '@/lib/hooks/useColorScheme';

interface AppHeaderProps {
  title?: string;
}

export default function AppHeader({ title }: AppHeaderProps) {
  const router = useRouter();
  const pathname = usePathname();
  const insets = useSafeAreaInsets();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  // Déterminer le titre en fonction de la route
  const getTitle = () => {
    if (title) return title;
    
    // Mapping des routes vers leurs titres
    const routeTitles: Record<string, string> = {
      '/': 'Accueil',
      '/explore': 'Explorer',
      '/messages': 'Messages',
      '/profile': 'Profil',
      '/settings': 'Paramètres',
    };
    
    return routeTitles[pathname] || 'Bagage Express';
  };

  // Simuler des données utilisateur (à remplacer par votre store/context)
  const user = {
    name: 'John Doe',
    avatar: null, // URL de l'avatar ou null
    hasUnreadNotifications: true,
    hasUnreadMessages: true,
  };

  return (
    <>
      {/* Ajuster la StatusBar */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1e1e1e' : '#ffffff'}
      />
      
      <View
        style={{
          paddingTop: insets.top, // Respecte le Safe Area (encoche)
        }}
        className="bg-background border-b border-border shadow-sm"
      >
        <View className="flex-row items-center justify-between px-4 h-16">
          {/* Logo à gauche */}
          <TouchableOpacity
            onPress={() => router.push('/')}
            activeOpacity={0.7}
            className="flex-row items-center"
          >
            {/* Logo - Remplacez par votre vraie image */}
            <View className="w-9 h-9 bg-primary rounded-lg items-center justify-center">
              <Text className="text-white font-bold text-lg">B</Text>
            </View>
            {/* Optionnel: Nom de l'app à côté du logo sur les grands écrans */}
            <Text className="ml-2 font-heading font-bold text-primary text-base">
              CoBage
            </Text>
          </TouchableOpacity>

          {/* Titre centré */}
          <Text 
            className="font-heading text-base font-semibold text-foreground absolute left-0 right-0 text-center"
            numberOfLines={1}
          >
            {getTitle()}
          </Text>

          {/* Actions à droite */}
          <View className="flex-row items-center gap-1">
            {/* Bouton Notifications avec badge */}
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center relative"
              activeOpacity={0.7}
              onPress={() => router.push('/(protected)/notifications')}
            >
              <Ionicons
                name="notifications-outline"
                size={24}
                color={isDark ? '#9e9e9e' : '#616161'}
              />
              {/* Badge rouge si notifications non lues */}
              {user.hasUnreadNotifications && (
                <View className="absolute top-1.5 right-1.5 bg-error w-2.5 h-2.5 rounded-full border-2 border-background" />
              )}
            </TouchableOpacity>

            {/* Bouton Messages avec badge */}
            <TouchableOpacity
              className="w-10 h-10 items-center justify-center relative"
              activeOpacity={0.7}
              onPress={() => router.push('/messages')}
            >
              <Ionicons
                name="chatbubble-outline"
                size={23}
                color={isDark ? '#9e9e9e' : '#616161'}
              />
              {/* Badge rouge si messages non lus */}
              {user.hasUnreadMessages && (
                <View className="absolute top-1.5 right-1.5 bg-error w-2.5 h-2.5 rounded-full border-2 border-background" />
              )}
            </TouchableOpacity>

            {/* Photo de profil */}
            <TouchableOpacity
              className="ml-1"
              activeOpacity={0.7}
              onPress={() => router.push('/profile')}
            >
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  className="w-8 h-8 rounded-full border-2 border-primary/20"
                />
              ) : (
                // Avatar par défaut avec initiales
                <View className="w-8 h-8 rounded-full bg-primary/10 items-center justify-center border-2 border-primary/20">
                  <Text className="text-primary font-semibold text-xs">
                    {user.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </>
  );
}
