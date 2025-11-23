import React, { useState } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Save, Trash2, User as UserIcon, Phone } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Avatar from '@/components/ui/Avatar';
import InputFile, { type FileAsset } from '@/components/ui/InputFile';

// Validation & Types
import { updateUserSchema, type UpdateUserFormData } from '@/lib/validations/user.schema';
import type { User } from '@/types';
import { useAvatar } from '@/lib/hooks/useUsers';

interface ProfileFormProps {
  user: User;
  onSubmit: (data: UpdateUserFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function ProfileForm({ user, onSubmit, onCancel }: ProfileFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  // ✅ MOBILE : On utilise FileAsset au lieu de File
  const [selectedFile, setSelectedFile] = useState<FileAsset | null>(null);
  
  const { 
    uploadAvatar, 
    deleteAvatar,
    isUploading, 
    error: uploadError,
    clearError,
    currentAvatar 
  } = useAvatar();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      nom: user.nom,
      prenom: user.prenom,
      telephone: user.telephone || '',
      bio: user.bio || '',
    },
  });

  const handleFormSubmit = async (data: UpdateUserFormData) => {
    setIsSubmitting(true);
    
    try {
      // 1. Upload Avatar (si nouveau fichier)
      if (selectedFile) {
        try {
          await uploadAvatar(selectedFile);
        } catch (error) {
          console.error('Erreur upload avatar:', error);
          // On continue quand même
        }
      }

      // 2. Mise à jour Profil
      await onSubmit(data);

      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur mise à jour profil:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFileSelect = (file: FileAsset | null) => {
    setSelectedFile(file);
    clearError();
  };

  const handleDeleteAvatar = async () => {
    try {
      await deleteAvatar();
      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur suppression avatar:', error);
    }
  };

  const isProcessing = isSubmitting || isUploading;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView 
        showsVerticalScrollIndicator={false} 
        contentContainerStyle={{ paddingBottom: 40 }}
        keyboardShouldPersistTaps="handled"
      >
        
        {/* === SECTION 1 : PHOTO === */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Photo de profil
          </Text>
          <View className="flex-row items-start gap-4">
            <Avatar
              src={currentAvatar || undefined}
              fallback={`${user.nom} ${user.prenom}`}
              size="xl"
            />
            <View className="flex-1">
              <InputFile
                onFileSelect={handleFileSelect}
                error={uploadError || undefined}
                helperText="JPG, PNG (max 5MB)"
                maxSize={5}
                showPreview={false}
                disabled={isProcessing}
              />
              
              {currentAvatar && !selectedFile && (
                <Button
                  variant="outline"
                  size="sm"
                  onPress={handleDeleteAvatar}
                  disabled={isProcessing}
                  leftIcon={<Trash2 size={16} color="#ef4444" />}
                  className="mt-2 self-start border-error/20"
                >
                  <Text className="text-error text-xs">Supprimer la photo</Text>
                </Button>
              )}
            </View>
          </View>
        </View>

        {/* === SECTION 2 : INFOS PERSO === */}
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
                  required
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
                  required
                />
              )}
            />
          </View>
        </View>

        <Controller
          control={control}
          name="telephone"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Téléphone"
              placeholder="+237 6XX XX XX XX"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.telephone?.message}
              helperText="Format: +237XXXXXXXXX"
              leftIcon={<Phone size={20} color="#9ca3af" />}
              keyboardType="phone-pad"
            />
          )}
        />

        {/* === SECTION 3 : BIO === */}
        <Controller
          control={control}
          name="bio"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Bio"
              placeholder="Parlez un peu de vous..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.bio?.message}
              helperText="Maximum 500 caractères"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
            />
          )}
        />

        {/* === ACTIONS === */}
        <View className="flex-row gap-3 pt-4 border-t border-gray-200 mt-2">
          {onCancel && (
            <View className="flex-1">
              <Button
                variant="outline"
                onPress={onCancel}
                disabled={isProcessing}
              >
                Annuler
              </Button>
            </View>
          )}
          <View className="flex-1">
            <Button
              variant="primary"
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={isProcessing}
              disabled={isProcessing}
              leftIcon={<Save size={18} color="white" />}
            >
              Enregistrer
            </Button>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}