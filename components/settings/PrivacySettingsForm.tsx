import React from 'react';
import { View, Text, ScrollView, Switch, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Eye, Phone, Mail, BarChart, AlertTriangle } from 'lucide-react-native';
import { privacySettingsSchema, type PrivacySettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import Button from '../ui/Button';

interface PrivacySettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function PrivacySettingsForm({
  settings,
  onSubmit,
  isLoading,
}: PrivacySettingsFormProps) {
  const { control, handleSubmit, formState: { isDirty }, watch } = useForm<PrivacySettingsFormData>({
    resolver: zodResolver(privacySettingsSchema),
    defaultValues: {
      profileVisibility: settings.profileVisibility,
      showPhone: settings.showPhone,
      showEmail: settings.showEmail,
      showStats: settings.showStats,
      messagePermission: settings.messagePermission,
      showInSearchResults: settings.showInSearchResults,
      showLastSeen: settings.showLastSeen,
    },
  });

  const profileVisibility = watch('profileVisibility');

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-6">
        {/* Visibilité du profil */}
        <View className="space-y-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Shield size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Visibilité du profil
            </Text>
          </View>

          <View className="space-y-3">
            {/* Public */}
            <Controller
              name="profileVisibility"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('public')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'public'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'public' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Public
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Visible par tous les utilisateurs
                    </Text>
                  </View>
                </Pressable>
              )}
            />

            {/* Vérifiés uniquement */}
            <Controller
              name="profileVisibility"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('verified_only')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'verified_only'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'verified_only' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Utilisateurs vérifiés uniquement
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Visible seulement par les utilisateurs vérifiés
                    </Text>
                  </View>
                </Pressable>
              )}
            />

            {/* Privé */}
            <Controller
              name="profileVisibility"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('private')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'private'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'private' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Privé
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Profil non visible dans les recherches
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Informations visibles */}
        <View className="space-y-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Eye size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Informations visibles
            </Text>
          </View>

          <View className="space-y-2">
            {/* Téléphone */}
            <Controller
              name="showPhone"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <View className="flex-row items-center gap-2">
                    <Phone size={16} className="text-gray-400 dark:text-gray-500" />
                    <Text className="text-gray-900 dark:text-white">
                      Afficher mon téléphone
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  />
                </Pressable>
              )}
            />

            {/* Email */}
            <Controller
              name="showEmail"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <View className="flex-row items-center gap-2">
                    <Mail size={16} className="text-gray-400 dark:text-gray-500" />
                    <Text className="text-gray-900 dark:text-white">
                      Afficher mon email
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  />
                </Pressable>
              )}
            />

            {/* Statistiques */}
            <Controller
              name="showStats"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <View className="flex-row items-center gap-2">
                    <BarChart size={16} className="text-gray-400 dark:text-gray-500" />
                    <Text className="text-gray-900 dark:text-white">
                      Afficher mes statistiques
                    </Text>
                  </View>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  />
                </Pressable>
              )}
            />

            {/* Dernière connexion */}
            <Controller
              name="showLastSeen"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Afficher ma dernière connexion
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  />
                </Pressable>
              )}
            />

            {/* Recherches */}
            <Controller
              name="showInSearchResults"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Apparaître dans les recherches
                  </Text>
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  />
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Permissions de messagerie */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Qui peut m'envoyer des messages ?
          </Text>

          <View className="space-y-2">
            {/* Tout le monde */}
            <Controller
              name="messagePermission"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('everyone')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'everyone'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'everyone' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text className="font-medium text-gray-900 dark:text-white flex-1">
                    Tout le monde
                  </Text>
                </Pressable>
              )}
            />

            {/* Vérifiés uniquement */}
            <Controller
              name="messagePermission"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('verified_only')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'verified_only'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'verified_only' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text className="font-medium text-gray-900 dark:text-white flex-1">
                    Utilisateurs vérifiés uniquement
                  </Text>
                </Pressable>
              )}
            />

            {/* Personne */}
            <Controller
              name="messagePermission"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange('no_one')}
                  className={`flex-row items-start gap-3 p-4 border-2 rounded-xl ${
                    value === 'no_one'
                      ? 'border-primary bg-primary/5 dark:bg-primary/10'
                      : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800'
                  }`}
                >
                  <View className="w-5 h-5 rounded-full border-2 border-primary items-center justify-center mt-0.5">
                    {value === 'no_one' && (
                      <View className="w-3 h-3 rounded-full bg-primary" />
                    )}
                  </View>
                  <Text className="font-medium text-gray-900 dark:text-white flex-1">
                    Personne
                  </Text>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Alerte profil privé */}
        {profileVisibility === 'private' && (
          <View className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl flex-row items-start gap-3">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5" />
            <View className="flex-1">
              <Text className="text-sm text-amber-900 dark:text-amber-200">
                <Text className="font-semibold">Attention :</Text> En mode privé, votre profil ne sera pas visible dans les recherches et vous ne recevrez pas de notifications de matching.
              </Text>
            </View>
          </View>
        )}

        {/* Bouton Submit */}
        <View className="pt-4 pb-8">
          <Button
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            isLoading={isLoading}
            disabled={!isDirty || isLoading}
          >
            Enregistrer les modifications
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}