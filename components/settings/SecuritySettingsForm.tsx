import React from 'react';
import { View, Text, ScrollView, Switch, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, Bell, Shield, AlertTriangle } from 'lucide-react-native';
import { securitySettingsSchema, type SecuritySettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import Button from '../ui/Button';

interface SecuritySettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function SecuritySettingsForm({
  settings,
  onSubmit,
  isLoading,
}: SecuritySettingsFormProps) {
  const { control, handleSubmit, formState: { isDirty }, watch } = useForm<SecuritySettingsFormData>({
    resolver: zodResolver(securitySettingsSchema),
    defaultValues: {
      twoFactorEnabled: settings.twoFactorEnabled,
      loginNotifications: settings.loginNotifications,
    },
  });

  const twoFactorEnabled = watch('twoFactorEnabled');

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-6">
        {/* Header */}
        <View className="flex-row items-center gap-2 mb-2">
          <Shield size={20} className="text-primary" />
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Sécurité du compte
          </Text>
        </View>

        {/* Authentification à deux facteurs */}
        <View className="space-y-3">
          <Controller
            name="twoFactorEnabled"
            control={control}
            render={({ field: { value, onChange } }) => (
              <View>
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Switch
                    value={value}
                    onValueChange={onChange}
                    trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                    thumbColor={value ? '#ffffff' : '#f3f4f6'}
                    className="mt-1"
                  />
                  <View className="flex-1">
                    <View className="flex-row items-center gap-2 mb-1">
                      <Lock size={16} className="text-primary" />
                      <Text className="font-medium text-gray-900 dark:text-white">
                        Authentification à deux facteurs (2FA)
                      </Text>
                    </View>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                      Ajoutez une couche de sécurité supplémentaire en activant la vérification en deux étapes
                    </Text>
                  </View>
                </Pressable>

                {/* Note conditionnelle */}
                {value && (
                  <View className="mt-3 ml-3 p-3 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-xl">
                    <Text className="text-sm text-primary-dark dark:text-primary-light leading-5">
                      <Text className="font-semibold">Note :</Text> La 2FA sera configurée lors de votre prochaine connexion. Vous recevrez un code par SMS ou email.
                    </Text>
                  </View>
                )}
              </View>
            )}
          />

          {/* Notifications de connexion */}
          <Controller
            name="loginNotifications"
            control={control}
            render={({ field: { value, onChange } }) => (
              <Pressable
                onPress={() => onChange(!value)}
                className="flex-row items-start gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
              >
                <Switch
                  value={value}
                  onValueChange={onChange}
                  trackColor={{ false: '#d1d5db', true: '#26a69a' }}
                  thumbColor={value ? '#ffffff' : '#f3f4f6'}
                  className="mt-1"
                />
                <View className="flex-1">
                  <View className="flex-row items-center gap-2 mb-1">
                    <Bell size={16} className="text-primary" />
                    <Text className="font-medium text-gray-900 dark:text-white">
                      Notifications de connexion
                    </Text>
                  </View>
                  <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                    Recevez une notification lors de chaque nouvelle connexion à votre compte
                  </Text>
                </View>
              </Pressable>
            )}
          />
        </View>

        {/* Conseils de sécurité */}
        <View className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl">
          <View className="flex-row gap-3">
            <AlertTriangle size={20} className="text-amber-600 dark:text-amber-400 mt-0.5" />
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-amber-900 dark:text-amber-200">
                Conseils de sécurité
              </Text>
              <View className="space-y-1.5">
                <View className="flex-row items-start gap-2">
                  <Text className="text-amber-800 dark:text-amber-300">•</Text>
                  <Text className="text-sm text-amber-800 dark:text-amber-300 flex-1">
                    Utilisez un mot de passe fort et unique
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Text className="text-amber-800 dark:text-amber-300">•</Text>
                  <Text className="text-sm text-amber-800 dark:text-amber-300 flex-1">
                    Ne partagez jamais vos identifiants
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Text className="text-amber-800 dark:text-amber-300">•</Text>
                  <Text className="text-sm text-amber-800 dark:text-amber-300 flex-1">
                    Vérifiez régulièrement l'activité de votre compte
                  </Text>
                </View>
                <View className="flex-row items-start gap-2">
                  <Text className="text-amber-800 dark:text-amber-300">•</Text>
                  <Text className="text-sm text-amber-800 dark:text-amber-300 flex-1">
                    Déconnectez-vous sur les appareils partagés
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

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