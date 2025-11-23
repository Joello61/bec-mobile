import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useRouter, useLocalSearchParams, type Href } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';

// Composants
import LoginForm from '@/components/forms/LoginForm';
import OAuthButtons from '@/components/auth/OAuthButtons';
import Spinner from '@/components/ui/Spinner';

// Types
import type { LoginFormData } from '@/lib/validations/auth.schema';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const { login, user } = useAuth();
  const toast = useToast();
  
  const [isRedirecting, setIsRedirecting] = useState(false);

  // Gestion de la redirection après connexion
  useEffect(() => {
    if (user) {
      setIsRedirecting(true);
      
      // Déterminer la destination
      if (!user.isProfileComplete) {
        router.replace('/complete-profile');
      } else if (params.redirect) {
        const redirectPath = Array.isArray(params.redirect) ? params.redirect[0] : params.redirect;
        router.replace(redirectPath as Href);
      } else {
        router.replace('/(tabs)/explore');
      }
    }
  }, [user, params.redirect, router]);

  const handleLogin = async (data: LoginFormData) => {
    try {
      await login(data);
    } catch (error: any) {
      // Cas spécifique : Email non vérifié
      if (error.message === 'EMAIL_NOT_VERIFIED') {
        toast.show({
          type: 'warning',
          title: 'Vérification requise',
          message: 'Veuillez vérifier votre email avant de vous connecter',
        });
        router.push('/verify-email');
        return;
      }

      toast.show({
        type: 'error',
        title: 'Erreur de connexion',
        message: error.message || 'Identifiants incorrects',
      });
    }
  };

  // Affichage pendant la redirection
  if (isRedirecting) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Spinner size="lg" variant="primary" />
        <Text className="mt-4 text-gray-600 font-medium">
          Connexion réussie, redirection...
        </Text>
      </View>
    );
  }

  return (
    <LoginForm onSubmit={handleLogin}>
      <View className="mb-6">
        <OAuthButtons />
      </View>
    </LoginForm>
  );
}