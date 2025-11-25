import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, UserPlus, Mail, User, Lock, ArrowRight, ArrowLeft } from 'lucide-react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown, FadeInRight, FadeOutLeft } from 'react-native-reanimated';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation & Types
import { registerSchema, type RegisterFormData } from '@/lib/validations/auth.schema';
import { Colors } from '@/constants/Theme';

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void>;
  children?: React.ReactNode;
}

export default function RegisterForm({ onSubmit, children }: RegisterFormProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    control,
    handleSubmit,
    formState: { errors },
    trigger,
    getValues,
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onChange',
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

  // Validation avant de passer à l'étape suivante
  const handleNext = async () => {
    const isValid = await trigger(['prenom', 'nom', 'email']);
    if (isValid) {
      setCurrentStep(2);
    }
  };

  // Couleurs adaptées au thème
  const colors = {
    text: isDark ? Colors.dark.text : Colors.light.text,
    textSecondary: isDark ? Colors.gray[400] : Colors.gray[600],
    iconColor: isDark ? Colors.gray[400] : Colors.gray[500],
    border: isDark ? Colors.gray[700] : Colors.gray[200],
    surface: isDark ? Colors.dark.surface : Colors.gray[50],
    primary: isDark ? Colors.secondary.light : Colors.primary.DEFAULT,
  };

  const styles = {
    separatorLine: isDark ? Colors.gray[700] : Colors.gray[200],
    separatorBg: isDark ? Colors.dark.surface : Colors.gray[50],
    separatorText: isDark ? Colors.gray[400] : Colors.gray[500],
  };

  // Helper pour le toggle mot de passe
  const PasswordToggle = ({ show, onToggle }: { show: boolean; onToggle: () => void }) => (
    <TouchableOpacity 
      onPress={onToggle}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {show ? (
        <EyeOff size={20} color={colors.iconColor} />
      ) : (
        <Eye size={20} color={colors.iconColor} />
      )}
    </TouchableOpacity>
  );

  // Barre de progression
  const ProgressBar = () => (
    <View style={{ flexDirection: 'row', gap: 8, marginBottom: 32 }}>
      {[1, 2].map((step) => (
        <View
          key={step}
          style={{
            flex: 1,
            height: 4,
            borderRadius: 2,
            backgroundColor: currentStep >= step ? colors.primary : colors.border,
            opacity: currentStep >= step ? 1 : 0.3,
          }}
        />
      ))}
    </View>
  );

  return (
    <View style={{ flex: 1 }}>
      {/* Header Animé */}
      <View style={{ marginBottom: 32, alignItems: 'center' }}>
        <Animated.Text 
          entering={FadeInDown.delay(100).duration(500)}
          style={{ 
            fontSize: 30, 
            fontWeight: 'bold', 
            color: colors.text,
            marginBottom: 12,
            textAlign: 'center',
          }}
        >
          Créer un compte
        </Animated.Text>
        <Animated.Text 
          entering={FadeInDown.delay(200).duration(500)}
          style={{ 
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          {currentStep === 1 ? 'Commençons par vos informations' : 'Sécurisez votre compte'}
        </Animated.Text>
      </View>

      {/* Barre de progression */}
      <ProgressBar />

      {/* Injecter les enfants (OAuth buttons + séparateur) - Uniquement étape 1 */}
      {currentStep === 1 && children}

      {/* Formulaire */}
      <View style={{ gap: 16 }}>
        {/* ÉTAPE 1 : Informations personnelles */}
        {currentStep === 1 && (
          <Animated.View 
            entering={FadeInRight.duration(300)}
            exiting={FadeOutLeft.duration(300)}
            style={{ gap: 16 }}
          >
            {/* Prénom & Nom */}
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
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
                      leftIcon={<User size={20} color={colors.iconColor} />}
                      required
                      editable={!isSubmitting}
                    />
                  )}
                />
              </View>
              <View style={{ flex: 1 }}>
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
                      leftIcon={<User size={20} color={colors.iconColor} />}
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
                  leftIcon={<Mail size={20} color={colors.iconColor} />}
                  required
                  editable={!isSubmitting}
                />
              )}
            />

            {/* Bouton Suivant */}
            <View style={{ marginTop: 8 }}>
              <Button
                variant="primary"
                onPress={handleNext}
                size="lg"
                rightIcon={<ArrowRight size={18} color="white" />}
              >
                Suivant
              </Button>
            </View>
          </Animated.View>
        )}

        {/* ÉTAPE 2 : Mot de passe */}
        {currentStep === 2 && (
          <Animated.View 
            entering={FadeInRight.duration(300)}
            style={{ gap: 16 }}
          >
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
                  leftIcon={<Lock size={20} color={colors.iconColor} />}
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
                  leftIcon={<Lock size={20} color={colors.iconColor} />}
                  rightIcon={<PasswordToggle show={showConfirmPassword} onToggle={() => setShowConfirmPassword(!showConfirmPassword)} />}
                  required
                  editable={!isSubmitting}
                />
              )}
            />

            {/* Helper text */}
            <Text style={{ fontSize: 12, color: colors.textSecondary, marginTop: -8 }}>
              8 caractères min, 1 majuscule, 1 chiffre
            </Text>

            {/* Boutons Retour & S'inscrire */}
            <View style={{ gap: 12, marginTop: 8 }}>
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

              <Button
                variant="ghost"
                onPress={() => setCurrentStep(1)}
                disabled={isSubmitting}
                size="lg"
                leftIcon={<ArrowLeft size={18} color={colors.primary} />}
              >
                Retour
              </Button>
            </View>
          </Animated.View>
        )}

        {/* Séparateur - Toujours visible */}
        <View style={{ position: 'relative', marginTop: 28, marginBottom: 10 }}>
          <View 
            style={{ 
              position: 'absolute', 
              top: '50%', 
              left: 0, 
              right: 0, 
              height: 1, 
              backgroundColor: styles.separatorLine,
            }} 
          />
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text 
              style={{ 
                paddingHorizontal: 16, 
                backgroundColor: styles.separatorBg,
                fontSize: 14,
                color: styles.separatorText,
              }}
            >
              Déjà un compte ?
            </Text>
          </View>
        </View>

        {/* Bouton Se connecter - Toujours visible */}
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
    </View>
  );
}