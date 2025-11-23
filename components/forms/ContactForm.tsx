import React, { useEffect } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Send, CheckCircle, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutUp, LinearTransition } from 'react-native-reanimated';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { useCreateContact } from '@/lib/hooks/useContacts';
import { CreateContactFormData, createContactSchema } from '@/lib/validations/contact.schema';

// Hooks & Validation

export default function ContactForm() {
  const { 
    createContact, 
    isLoading, 
    error, 
    successMessage, 
    clearError, 
    clearSuccess 
  } = useCreateContact();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<CreateContactFormData>({
    resolver: zodResolver(createContactSchema),
    defaultValues: {
      nom: '',
      email: '',
      sujet: '',
      message: '',
    },
  });

  // Nettoyer les messages au démontage ou au changement
  useEffect(() => {
    return () => {
      clearError();
      clearSuccess();
    };
  }, [clearError, clearSuccess]);

  // Reset du formulaire après un succès
  useEffect(() => {
    if (successMessage) {
      reset();
    }
  }, [successMessage, reset]);

  const onSubmit = async (data: CreateContactFormData) => {
    await createContact(data);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        
        <View className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
          
          {/* Message Succès */}
          {successMessage && (
            <Animated.View 
              entering={FadeInUp} 
              exiting={FadeOutUp}
              className="mb-6 flex-row items-start bg-success/10 border border-success/20 p-4 rounded-lg"
            >
              <CheckCircle size={20} color="#00695c" style={{ marginTop: 2, marginRight: 10 }} />
              <View className="flex-1">
                <Text className="text-success font-bold text-base mb-1">Message envoyé !</Text>
                <Text className="text-success-dark text-sm">
                  {successMessage} Nous vous répondrons dans les plus brefs délais.
                </Text>
              </View>
            </Animated.View>
          )}

          {/* Message Erreur */}
          {error && (
            <Animated.View 
              entering={FadeInUp} 
              exiting={FadeOutUp}
              className="mb-6 flex-row items-start bg-error/10 border border-error/20 p-4 rounded-lg"
            >
              <AlertCircle size={20} color="#ef4444" style={{ marginTop: 2, marginRight: 10 }} />
              <Text className="text-error flex-1 text-sm font-medium">
                {error}
              </Text>
            </Animated.View>
          )}

          {/* Nom */}
          <Controller
            control={control}
            name="nom"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nom complet"
                placeholder="Jean Dupont"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.nom?.message}
                required
                editable={!isLoading}
              />
            )}
          />

          {/* Email */}
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="jean.dupont@example.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                required
                editable={!isLoading}
              />
            )}
          />

          {/* Sujet */}
          <Controller
            control={control}
            name="sujet"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Sujet"
                placeholder="Question sur un voyage"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.sujet?.message}
                required
                editable={!isLoading}
              />
            )}
          />

          {/* Message */}
          <Controller
            control={control}
            name="message"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Message"
                placeholder="Décrivez votre demande..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.message?.message}
                required
                multiline
                numberOfLines={6}
                textAlignVertical="top" // Important pour Android
                style={{ minHeight: 120 }} // Hauteur minimum visuelle
                editable={!isLoading}
              />
            )}
          />

          {/* Submit Button */}
          <View className="mt-4">
            <Button
              onPress={handleSubmit(onSubmit)}
              variant="primary"
              size="lg"
              isLoading={isLoading}
              disabled={isLoading}
              leftIcon={!isLoading ? <Send size={18} color="white" /> : undefined}
            >
              {isLoading ? 'Envoi en cours...' : 'Envoyer le message'}
            </Button>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}