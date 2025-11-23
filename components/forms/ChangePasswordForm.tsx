import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';

// Validation
import { changePasswordSchema, type ChangePasswordFormData } from '@/lib/validations/auth.schema';

interface ChangePasswordFormProps {
  onSubmit: (data: ChangePasswordFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ChangePasswordForm({ onSubmit, onCancel }: ChangePasswordFormProps) {
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleFormSubmit = async (data: ChangePasswordFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Helper pour générer l'icône oeil cliquable
  const PasswordToggle = ({ 
    isVisible, 
    onToggle 
  }: { 
    isVisible: boolean; 
    onToggle: () => void 
  }) => (
    <TouchableOpacity onPress={onToggle} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
      {isVisible ? (
        <EyeOff size={20} color="#6b7280" />
      ) : (
        <Eye size={20} color="#6b7280" />
      )}
    </TouchableOpacity>
  );

  return (
    <View className="w-full">
      {/* 1. Mot de passe actuel */}
      <Controller
        control={control}
        name="currentPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Mot de passe actuel"
            placeholder="••••••••"
            secureTextEntry={!showCurrentPassword}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.currentPassword?.message}
            required
            rightIcon={
              <PasswordToggle
                isVisible={showCurrentPassword}
                onToggle={() => setShowCurrentPassword(!showCurrentPassword)}
              />
            }
          />
        )}
      />

      {/* 2. Nouveau mot de passe */}
      <Controller
        control={control}
        name="newPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Nouveau mot de passe"
            placeholder="••••••••"
            secureTextEntry={!showNewPassword}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.newPassword?.message}
            helperText="8 caractères min, 1 majuscule, 1 chiffre"
            required
            rightIcon={
              <PasswordToggle
                isVisible={showNewPassword}
                onToggle={() => setShowNewPassword(!showNewPassword)}
              />
            }
          />
        )}
      />

      {/* 3. Confirmation */}
      <Controller
        control={control}
        name="confirmNewPassword"
        render={({ field: { onChange, onBlur, value } }) => (
          <Input
            label="Confirmer le nouveau mot de passe"
            placeholder="••••••••"
            secureTextEntry={!showConfirmPassword}
            value={value}
            onChangeText={onChange}
            onBlur={onBlur}
            error={errors.confirmNewPassword?.message}
            required
            rightIcon={
              <PasswordToggle
                isVisible={showConfirmPassword}
                onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
              />
            }
          />
        )}
      />

      {/* Actions */}
      <View className="flex-row gap-3 mt-2">
        {onCancel && (
          <View className="flex-1">
            <Button
              variant="outline"
              onPress={onCancel}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </View>
        )}
        
        <View className="flex-1">
          <Button
            variant="primary"
            onPress={handleSubmit(handleFormSubmit)}
            isLoading={isSubmitting}
            disabled={isSubmitting}
            leftIcon={<Lock size={18} color="white" />}
          >
            Changer le mot de passe
          </Button>
        </View>
      </View>
    </View>
  );
}