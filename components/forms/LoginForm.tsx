import React, { useState } from 'react';
import { View, Text, TouchableOpacity, useColorScheme } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, LogIn, Mail, Lock } from 'lucide-react-native';
import { Link } from 'expo-router';
import Animated, { FadeInDown } from 'react-native-reanimated';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation & Types
import { loginSchema, type LoginFormData } from '@/lib/validations/auth.schema';
import { Colors } from '@/constants/Theme';

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  children?: React.ReactNode;
}

export default function LoginForm({ onSubmit, children }: LoginFormProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const handleFormSubmit = async (data: LoginFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
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
      separatorBg: isDark ? Colors.dark.surface : Colors.gray[50], // Doit matcher le fond de l'écran
      separatorText: isDark ? Colors.gray[400] : Colors.gray[500],
    };

  // Helper pour le toggle mot de passe
  const PasswordToggle = () => (
    <TouchableOpacity 
      onPress={() => setShowPassword(!showPassword)}
      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
    >
      {showPassword ? (
        <EyeOff size={20} color={colors.iconColor} />
      ) : (
        <Eye size={20} color={colors.iconColor} />
      )}
    </TouchableOpacity>
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
          Bon retour !
        </Animated.Text>
        <Animated.Text 
          entering={FadeInDown.delay(200).duration(500)}
          style={{ 
            fontSize: 16,
            color: colors.textSecondary,
            textAlign: 'center',
          }}
        >
          Connectez-vous pour accéder à votre compte
        </Animated.Text>
      </View>

      {/* Injecter les enfants (OAuth buttons + séparateur) */}
      {children}

      {/* Formulaire */}
      <View style={{ gap: 16 }}>
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

        {/* Mot de passe */}
        <View>
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
                rightIcon={<PasswordToggle />}
                required
                editable={!isSubmitting}
              />
            )}
          />
          
          {/* Lien Mot de passe oublié */}
          <View style={{ marginTop: 8, alignItems: 'flex-end' }}>
            <Link href="/forgot-password" asChild>
              <TouchableOpacity>
                <Text style={{ fontSize: 14, color: colors.primary, fontWeight: '500' }}>
                  Mot de passe oublié ?
                </Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>

        {/* Bouton Se connecter */}
        <View style={{ marginTop: 24 }}>
          <Button
            variant="primary"
            onPress={handleSubmit(handleFormSubmit)}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            size="lg"
            leftIcon={<LogIn size={18} color="white" />}
          >
            Se connecter
          </Button>
        </View>

        {/* Séparateur avec style dynamique pour le Dark Mode */}
        <View style={{ position: 'relative', marginTop: 28, marginBottom: 10 }}>
          {/* La ligne */}
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
          {/* Le texte sur fond opaque */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            <Text 
              style={{ 
                paddingHorizontal: 16, 
                backgroundColor: styles.separatorBg, // Utilise le fond dynamique
                fontSize: 14,
                color: styles.separatorText,
              }}
            >
              Déjà un compte ?
            </Text>
          </View>
        </View>

        {/* Bouton Créer un compte */}
        <Link href="/register" asChild>
          <Button
            variant="outline"
            disabled={isSubmitting}
            size="lg"
          >
            Créer un compte
          </Button>
        </Link>
      </View>
    </View>
  );
}