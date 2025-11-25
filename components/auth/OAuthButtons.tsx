import React, { useState } from 'react';
import { View, Text, useColorScheme } from 'react-native';
import * as Linking from 'expo-linking';

import GoogleSignInButton from './GoogleSignInButton';
import FacebookSignInButton from './FacebookSignInButton';

import { authApi } from '@/lib/api/auth';
import { useToast } from '@/components/ui/Toast';
import { Colors } from '@/constants/Theme';

export default function OAuthButtons() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isFacebookLoading, setIsFacebookLoading] = useState(false);
  const toast = useToast();
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const handleGoogleAuth = async () => {
    setIsGoogleLoading(true);
    try {
      const { authUrl } = await authApi.getGoogleAuthUrl();
      await Linking.openURL(authUrl);
    } catch (error: any) {
      toast.show({
        title: 'Erreur',
        message: error.message || 'Erreur lors de la connexion avec Google',
        type: 'error'
      });
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleFacebookAuth = async () => {
    setIsFacebookLoading(true);
    try {
      const { authUrl } = await authApi.getFacebookAuthUrl();
      await Linking.openURL(authUrl);
    } catch (error: any) {
      toast.show({
        title: 'Erreur',
        message: error.message || 'Erreur lors de la connexion avec Facebook',
        type: 'error'
      });
    } finally {
      setIsFacebookLoading(false);
    }
  };

  const colors = {
    border: isDark ? Colors.gray[700] : Colors.gray[200],
    surface: isDark ? Colors.dark.surface : Colors.gray[50],
    textSecondary: isDark ? Colors.gray[400] : Colors.gray[500],
  };

  return (
    <View>
      {/* Boutons OAuth */}
      <View style={{ flexDirection: 'row', gap: 12 }}>
        <View style={{ flex: 1 }}>
          <GoogleSignInButton 
            onPress={handleGoogleAuth}
            isLoading={isGoogleLoading}
            disabled={isFacebookLoading}
          />
        </View>
        
        {/* Facebook */}
        <View style={{ flex: 1 }}>
          <FacebookSignInButton 
            onPress={handleFacebookAuth}
            isLoading={isFacebookLoading}
            disabled={isGoogleLoading}
          />
        </View>
      </View>

      {/* Séparateur "Ou continuez avec" */}
      <View style={{ position: 'relative', marginTop: 28 }}>
        <View 
          style={{ 
            position: 'absolute', 
            top: '50%', 
            left: 0, 
            right: 0, 
            height: 1, 
            backgroundColor: colors.border,
          }} 
        />
        <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
          <Text 
            style={{ 
              paddingHorizontal: 16, 
              backgroundColor: colors.surface,
              fontSize: 14,
              color: colors.textSecondary,
            }}
          >
            Ou continuez avec
          </Text>
        </View>
      </View>
    </View>
  );
}