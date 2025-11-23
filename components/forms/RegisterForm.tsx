import React, { useState } from 'react';
import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus, Mail, User, Lock } from 'lucide-react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation & Types
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth.schema';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  children?: React.ReactNode;
}

export default function RegisterForm({
  onSubmit,
  children,
}: RegisterFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      prenom: '',
      nom: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const handleFormSubmit = async (data: RegisterFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper pour les toggles de mot de passe
  const PasswordToggle = ({ show, onToggle }: { show: boolean, onToggle: () => void }) => (
    <TouchableOpacity 
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {show ? <EyeOff size={20} color="#6b7280" /> : <Eye size={20} color="#6b7280" />}
    </TouchableOpacity>
  );

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
        contentContainerStyle={{ flexGrow: 1, padding: 20, justifyContent: 'center' }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        
        {/* Header Animé */}
        <View className="mb-8 items-center">
          <Animated.Text 
            entering={FadeInDown.delay(100).duration(500)}
            className="text-3xl font-bold text-gray-900 mb-3 text-center"
          >
            Créer un compte
          </Animated.Text>
          <Animated.Text 
            entering={FadeInDown.delay(200).duration(500)}
            className="text-gray-600 text-center text-base"
          >
            Rejoignez la communauté Co-Bage
          </Animated.Text>
        </View>

        {children}

        <View className="space-y-4">
          
          {/* Prénom & Nom (Ligne horizontale) */}
          <View className="flex-row gap-3">
            <View className="flex-1">
              <Controller
                control={control}
                name="prenom"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Prénom"
                    placeholder="Jean"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.prenom?.message}
                    leftIcon={<User size={20} color="#9ca3af" />}
                    required
                    editable={!isSubmitting}
                  />
                )}
              />
            </View>
            <View className="flex-1">
              <Controller
                control={control}
                name="nom"
                render={({ field: { onChange, onBlur, value } }) => (
                  <Input
                    label="Nom"
                    placeholder="Dupont"
                    value={value}
                    onChangeText={onChange}
                    onBlur={onBlur}
                    error={errors.nom?.message}
                    leftIcon={<User size={20} color="#9ca3af" />}
                    required
                    editable={!isSubmitting}
                  />
                )}
              />
            </View>
          </View>

          {/* Email */}
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

          {/* Mot de passe */}
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Mot de passe"
                placeholder="••••••••"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.password?.message}
                helperText="8 caractères min, 1 majuscule, 1 chiffre"
                leftIcon={<Lock size={20} color="#9ca3af" />}
                rightIcon={<PasswordToggle show={showPassword} onToggle={() => setShowPassword(!showPassword)} />}
                required
                editable={!isSubmitting}
              />
            )}
          />

          {/* Confirmer Mot de passe */}
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
                rightIcon={<PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />}
                required
                editable={!isSubmitting}
              />
            )}
          />

          {/* Bouton S'inscrire */}
          <View className="mt-4">
            <Button
              variant="primary"
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
              size="lg"
              leftIcon={<UserPlus size={18} color="white" />}
            >
              S'inscrire
            </Button>
          </View>

          {/* Séparateur */}
          <View className="relative py-6">
            <View className="absolute inset-0 flex justify-center">
              <View className="w-full border-t border-gray-200" />
            </View>
            <View className="relative flex-row justify-center">
              <Text className="px-4 bg-gray-50 text-sm text-gray-500">
                Déjà un compte ?
              </Text>
            </View>
          </View>

          {/* Bouton Connexion */}
          <Link href="/login" asChild>
            <Button
              variant="outline"
              disabled={isSubmitting}
              size="lg"
            >
              Se connecter
            </Button>
          </Link>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}