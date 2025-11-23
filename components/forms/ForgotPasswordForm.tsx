import React, { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft } from 'lucide-react-native';
import { Link, useRouter } from 'expo-router';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation & Constants
import { forgotPasswordSchema, type ForgotPasswordFormData } from '@/lib/validations/auth.schema';

interface ForgotPasswordFormProps {
  onSubmit: (data: ForgotPasswordFormData) => Promise<void>;
}

export default function ForgotPasswordForm({ onSubmit }: ForgotPasswordFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const handleFormSubmit = async (data: ForgotPasswordFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

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
            Mot de passe oublié ?
          </Text>
          <Text className="text-sm text-gray-600 text-center px-4 leading-5">
            Entrez votre email et nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </Text>
        </View>

        {/* Champ Email */}
        <View className="mb-6">
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Email"
                placeholder="exemple@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.email?.message}
                leftIcon={<Mail size={20} color="#9ca3af" />}
                required
                editable={!isSubmitting}
              />
            )}
          />
        </View>

        {/* Bouton Envoyer */}
        <Button
          variant="primary"
          onPress={handleSubmit(handleFormSubmit)}
          isLoading={isSubmitting}
          disabled={isSubmitting}
          size="lg"
          className="mb-4"
        >
          Envoyer le lien
        </Button>

        {/* Lien Retour */}
        <Link href="/login" asChild>
          <Button
            variant="outline"
            leftIcon={<ArrowLeft size={18} color="#374151" />} // gray-700
            disabled={isSubmitting}
          >
            Retour à la connexion
          </Button>
        </Link>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}