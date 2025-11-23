import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation & Types
import { resetPasswordSchema, type ResetPasswordFormData } from '@/lib/validations/auth.schema';

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (data: ResetPasswordFormData) => Promise<void>;
}

export default function ResetPasswordForm({ token, onSubmit }: ResetPasswordFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token, // Le token est stocké ici, invisiblement
      newPassword: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: ResetPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper pour le toggle de visibilité
  const PasswordToggle = ({ 
    isVisible, 
    onToggle 
  }: { 
    isVisible: boolean; 
    onToggle: () => void 
  }) => (
    <TouchableOpacity 
      onPress={onToggle} 
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {isVisible ? (
        <EyeOff size={20} color="#6b7280" />
      ) : (
        <Eye size={20} color="#6b7280" />
      )}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 20 }}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* En-tête */}
        <View className="items-center mb-8">
          <Text className="text-2xl font-bold text-gray-900 mb-2 text-center">
            Nouveau mot de passe
          </Text>
          <Text className="text-sm text-gray-600 text-center px-4 leading-5">
            Choisissez un nouveau mot de passe sécurisé pour votre compte.
          </Text>
        </View>

        <View className="space-y-4">
          
          {/* Nouveau mot de passe */}
          <Controller
            control={control}
            name="newPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Nouveau mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.newPassword?.message}
                helperText="8 caractères min, 1 majuscule, 1 minuscule, 1 chiffre"
                leftIcon={<Lock size={20} color="#9ca3af" />}
                required
                rightIcon={
                  <PasswordToggle
                    isVisible={showPassword}
                    onToggle={() => setShowPassword(!showPassword)}
                  />
                }
                editable={!isSubmitting}
              />
            )}
          />

          {/* Confirmation */}
          <Controller
            control={control}
            name="confirmPassword"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Confirmer le mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showConfirmPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.confirmPassword?.message}
                leftIcon={<Lock size={20} color="#9ca3af" />}
                required
                rightIcon={
                  <PasswordToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                  />
                }
                editable={!isSubmitting}
              />
            )}
          />

          {/* Bouton Valider */}
          <View className="mt-4">
            <Button
              variant="primary"
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
            >
              Réinitialiser le mot de passe
            </Button>
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}