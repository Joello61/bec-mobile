import React from 'react';
import { View, Text, TouchableOpacity, useColorScheme, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, Slot } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Colors } from '@/constants/Theme';

export default function AuthLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const colors = {
    background: isDark ? Colors.dark.background : Colors.white,
    surface: isDark ? Colors.dark.surface : Colors.gray[50],
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.gray[400] : Colors.gray[500],
    border: isDark ? Colors.gray[700] : Colors.gray[200],
    primaryIcon: isDark ? Colors.secondary.light : Colors.primary.DEFAULT,
    footerBg: isDark ? 'rgba(30, 30, 30, 0.5)' : 'rgba(255, 255, 255, 0.5)',
  };

  return (
    <SafeAreaView 
      style={{ flex: 1, backgroundColor: colors.surface }}
      edges={['top']}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={{ 
            flexGrow: 1,
            paddingHorizontal: 20,
            paddingTop: 32,
            paddingBottom: 20,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View style={{ width: '100%', maxWidth: 480, marginHorizontal: 'auto', flex: 1 }}>
            {/* Utilisez Slot au lieu de children */}
            <Slot />
          </View>

          {/* FOOTER */}
          <Animated.View 
            entering={FadeInDown.delay(300).duration(500)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.footerBg,
              marginTop: 32,
              marginHorizontal: -20,
            }}
          >
            <View style={{ alignItems: 'center', gap: 16 }}>

              <View style={{ flexDirection: 'row', gap: 24 }}>
                <Link href="/(protected)/help/legal/terms" asChild>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Conditions
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link href="/(protected)/help/legal/privacy-policy" asChild>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Confidentialité
                    </Text>
                  </TouchableOpacity>
                </Link>
                <Link href="/(protected)/help/contact" asChild>
                  <TouchableOpacity>
                    <Text style={{ fontSize: 12, color: colors.textSecondary }}>
                      Aide
                    </Text>
                  </TouchableOpacity>
                </Link>
              </View>

              <Text 
                style={{ 
                  fontSize: 10, 
                  color: isDark ? Colors.gray[600] : Colors.gray[400],
                  textAlign: 'center',
                }}
              >
                © {new Date().getFullYear()} Co-Bage. Tous droits réservés.
              </Text>
            </View>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}