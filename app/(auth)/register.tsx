import React from 'react';
import { View, Text } from 'react-native';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/hooks/useAuth';
import { useToast } from '@/components/ui/Toast';
import { ROUTES } from '@/lib/utils/constants'; // Gardé pour référence, mais on utilise des strings

// Composants
import RegisterForm from '@/components/forms/RegisterForm';
import OAuthButtons from '@/components/auth/OAuthButtons';

// Types
import type { RegisterFormData } from '@/lib/validations/auth.schema';

export default function RegisterScreen() {
  const router = useRouter();
  const { register } = useAuth();
  const toast = useToast();

  const handleRegister = async (data: RegisterFormData) => {
    try {
      const response = await register(data);

      // Lecture du flag renvoyé par le backend
      const emailVerificationEnabled = response?.emailVerificationEnabled;

      if (emailVerificationEnabled) {
        // Mode PRODUCTION : email de vérification envoyé
        toast.show({
          type: 'success',
          title: 'Inscription réussie',
          message: 'Vérifiez votre email pour activer votre compte.',
          duration: 4000
        });
        
        // Délai pour laisser l'utilisateur lire le toast
        setTimeout(() => {
          router.push('/verify-email'); // Assurez-vous d'avoir créé cette route
        }, 1000);
      } else {
        // Mode DEV : auto-vérification
        toast.show({
          type: 'success',
          title: 'Bienvenue !',
          message: 'Votre compte a été créé et vérifié.',
        });
        
        setTimeout(() => {
          router.replace('/login'); // Ou directement vers /(tabs)/explore si le token est set
        }, 1000);
      }

    } catch (error: any) {
      toast.show({
        type: 'error',
        title: 'Erreur',
        message: error.message || "Erreur lors de l'inscription",
      });
    }
  };

  return (
    <RegisterForm onSubmit={handleRegister}>
      <View className="mb-6">
        <OAuthButtons />
      </View>
    </RegisterForm>
  );
}