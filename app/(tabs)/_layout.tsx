import { Tabs } from 'expo-router';
import React from 'react';
import { Platform, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { BlurView } from 'expo-blur';
import { useColorScheme } from '@/lib/hooks/useColorScheme';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Tabs
      screenOptions={{
        // Couleur des icônes actives (votre primary)
        tabBarActiveTintColor: isDark ? '#26a69a' : '#00695c',
        
        // Couleur des icônes inactives
        tabBarInactiveTintColor: isDark ? '#9e9e9e' : '#757575',
        
        // Masquer le header par défaut
        headerShown: false,
        
        // Style de la Tab Bar
        tabBarStyle: {
          position: 'absolute',
          bottom: Platform.select({ ios: 0, android: 0 }),
          left: 20,
          right: 20,
          elevation: 8,
          backgroundColor: isDark ? 'rgba(30, 30, 30, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          borderRadius: 20,
          height: Platform.select({ ios: 90, android: 65 }),
          paddingBottom: Platform.select({ ios: 10, android: 10 }),
          paddingTop: 0,
          borderTopWidth: 0,
          // Ombre pour iOS
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.15,
          shadowRadius: 20,
        },
        
        // Style des labels
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 6,
        },
        
        // Afficher les labels
        tabBarShowLabel: true,
        
        // Animation de transition
        tabBarHideOnKeyboard: true,
        
        // Style de fond pour l'onglet actif
        tabBarItemStyle: {
          paddingVertical: 5,
        },
        
        // Background avec blur effect sur iOS
        ...(Platform.OS === 'ios' && {
          tabBarBackground: () => (
            <BlurView
              intensity={100}
              style={StyleSheet.absoluteFill}
              tint={isDark ? 'dark' : 'light'}
            />
          ),
        }),
      }}>

      {/* Onglet 1 : Accueil */}
      <Tabs.Screen
        name="index"
        options={{
          title: 'Accueil',
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={[
                styles.iconContainer,
              ]}>
              <Ionicons
                size={focused ? 26 : 24}
                name={focused ? 'home' : 'home-outline'}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Onglet 3 : Explorer */}
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explorer',
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={[
                styles.iconContainer,
              ]}>
              <Ionicons
                size={focused ? 26 : 24}
                name={focused ? 'compass' : 'compass-outline'}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Onglet 4 : Profil */}
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profil',
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={[
                styles.iconContainer,
              ]}>
              <Ionicons
                size={focused ? 26 : 24}
                name={focused ? 'person' : 'person-outline'}
                color={color}
              />
            </View>
          ),
        }}
      />

      {/* Onglet 5 : Settings (caché de la tab bar mais accessible) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Paramètres',
          tabBarIcon: ({ color, focused, size }) => (
            <View
              style={[
                styles.iconContainer,
              ]}>
              <Ionicons
                size={focused ? 26 : 24}
                name={focused ? 'settings' : 'settings-outline'}
                color={color}
              />
            </View>
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#f44336',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
  },
});