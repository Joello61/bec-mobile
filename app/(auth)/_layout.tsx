import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, ScrollView, KeyboardAvoidingView, Platform, Image, StatusBar } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Link, Slot, useRouter } from 'expo-router';
import { Home } from 'lucide-react-native';
import Animated, { FadeInDown, FadeIn } from 'react-native-reanimated';
import { Colors } from '@/constants/Theme';

export default function AuthLayout() {
  const router = useRouter();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';
  const insets = useSafeAreaInsets();

  const colors = {
    background: isDark ? Colors.dark.background : Colors.white,
    surface: isDark ? Colors.dark.surface : Colors.white,
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.gray[400] : Colors.gray[500],
    border: isDark ? Colors.gray[800] : Colors.gray[100],
    primaryIcon: isDark ? Colors.secondary.light : Colors.primary.DEFAULT,
    footerBg: isDark ? Colors.dark.surface : Colors.gray[50],
    headerBg: isDark ? Colors.dark.background : Colors.white,
    headerBorder: isDark ? Colors.gray[800] : Colors.gray[200],
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.background }}
      edges={['top']}
    >
      {/* Ajuster la StatusBar */}
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={isDark ? '#1e1e1e' : '#ffffff'}
      />
      
      <View
        style={{
          paddingTop: insets.top - 64, // Respecte le Safe Area (encoche)
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
              <Text className="text-white font-bold text-lg">CB</Text>
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
            {/* Vide pour les pages auth */}
          </Text>

          {/* Bouton Accueil à droite */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity 
              onPress={() => router.replace('/')}
              style={{ 
                flexDirection: 'row', 
                alignItems: 'center',
                gap: 6,
                paddingVertical: 8,
                paddingHorizontal: 12,
                borderRadius: 12,
                backgroundColor: isDark ? 'rgba(255,255,255,0.08)' : 'rgba(0,0,0,0.05)',
                borderWidth: 1,
                borderColor: isDark ? 'rgba(255,255,255,0.12)' : 'rgba(0,0,0,0.08)',
              }}
              activeOpacity={0.7}
            >
              <Home size={16} color={colors.primaryIcon} />
              <Text style={{ fontSize: 14, fontWeight: '600', color: colors.primaryIcon }}>
                Accueil
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* CONTENU SCROLLABLE */}
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 24,
            justifyContent: 'center',
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Conteneur centré avec largeur max */}
          <View style={{ 
            width: '100%', 
            maxWidth: 440, 
            alignSelf: 'center',
          }}>
            <Slot />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* FOOTER (Fixe en bas) */}
      <Animated.View 
        entering={FadeInDown.delay(200).duration(500)}
        style={{
          paddingHorizontal: 24,
          paddingVertical: 20,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          backgroundColor: colors.footerBg,
        }}
      >
        <View style={{ alignItems: 'center', gap: 12 }}>
          {/* Liens */}
          <View style={{ flexDirection: 'row', gap: 20 }}>
            <Link href="/(protected)/help/legal/terms" asChild>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ 
                  fontSize: 13, 
                  color: colors.textSecondary,
                  fontWeight: '500'
                }}>
                  Conditions
                </Text>
              </TouchableOpacity>
            </Link>
            
            <View style={{ width: 1, height: 14, backgroundColor: colors.border, alignSelf: 'center' }} />
            
            <Link href="/(protected)/help/legal/privacy-policy" asChild>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ 
                  fontSize: 13, 
                  color: colors.textSecondary,
                  fontWeight: '500'
                }}>
                  Confidentialité
                </Text>
              </TouchableOpacity>
            </Link>
            
            <View style={{ width: 1, height: 14, backgroundColor: colors.border, alignSelf: 'center' }} />
            
            <Link href="/(protected)/help/contact" asChild>
              <TouchableOpacity hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
                <Text style={{ 
                  fontSize: 13, 
                  color: colors.textSecondary,
                  fontWeight: '500'
                }}>
                  Aide
                </Text>
              </TouchableOpacity>
            </Link>
          </View>

          {/* Copyright */}
          <Text 
            style={{ 
              fontSize: 11, 
              color: isDark ? Colors.gray[600] : Colors.gray[400],
              textAlign: 'center',
            }}
          >
            © {new Date().getFullYear()} Co-Bage. Tous droits réservés.
          </Text>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}