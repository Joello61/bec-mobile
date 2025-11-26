import React from 'react';
import { View, Text, ScrollView, Switch, Pressable, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, Download, Info, Trash2 } from 'lucide-react-native';
import { rgpdSettingsSchema, type RgpdSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import { formatDate } from '@/lib/utils/format';
import Button from '../ui/Button';

interface RgpdSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  onExportData: () => Promise<void>;
  onDeleteAccount?: () => Promise<void>;
  isLoading?: boolean;
  isExporting?: boolean;
  isDeleting?: boolean;
}

export default function RgpdSettingsForm({
  settings,
  onSubmit,
  onExportData,
  onDeleteAccount,
  isLoading,
  isExporting,
  isDeleting,
}: RgpdSettingsFormProps) {
  const { control, handleSubmit, formState: { isDirty } } = useForm<RgpdSettingsFormData>({
    resolver: zodResolver(rgpdSettingsSchema),
    defaultValues: {
      cookiesConsent: settings.cookiesConsent,
      analyticsConsent: settings.analyticsConsent,
      marketingConsent: settings.marketingConsent,
      dataShareConsent: settings.dataShareConsent,
    },
  });

  const handleDeleteAccount = () => {
    Alert.alert(
      'Supprimer mon compte',
      'Êtes-vous sûr de vouloir supprimer votre compte ? Cette action est définitive et irréversible.',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: onDeleteAccount,
        },
      ]
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-6">
        {/* Info RGPD */}
        <View className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl">
          <View className="flex-row gap-3">
            <Info size={20} className="text-blue-600 dark:text-blue-400 mt-0.5" />
            <View className="flex-1 space-y-2">
              <Text className="font-medium text-blue-900 dark:text-blue-200">
                Vos droits RGPD
              </Text>
              <Text className="text-sm text-blue-800 dark:text-blue-300 leading-5">
                Conformément au RGPD, vous disposez d'un droit d'accès, de rectification, de suppression et de portabilité de vos données personnelles.
              </Text>
            </View>
          </View>
        </View>

        {/* Consentements */}
        <View className="space-y-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Shield size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Gestion des consentements
            </Text>
          </View>

          {settings.consentDate && (
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Dernière mise à jour : {formatDate(settings.consentDate)}
            </Text>
          )}

          <View className="space-y-3">
            {/* Cookies essentiels */}
            <Controller
              name="cookiesConsent"
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
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Cookies essentiels
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                      Nécessaires au fonctionnement du site (connexion, panier, préférences)
                    </Text>
                  </View>
                </Pressable>
              )}
            />

            {/* Cookies analytiques */}
            <Controller
              name="analyticsConsent"
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
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Cookies analytiques
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                      Nous aident à comprendre comment vous utilisez le site pour l'améliorer
                    </Text>
                  </View>
                </Pressable>
              )}
            />

            {/* Communications marketing */}
            <Controller
              name="marketingConsent"
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
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Communications marketing
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                      Recevoir des offres et actualités personnalisées
                    </Text>
                  </View>
                </Pressable>
              )}
            />

            {/* Partage de données */}
            <Controller
              name="dataShareConsent"
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
                    <Text className="font-medium text-gray-900 dark:text-white mb-1">
                      Partage de données
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400 leading-5">
                      Autoriser le partage de données anonymisées avec nos partenaires
                    </Text>
                  </View>
                </Pressable>
              )}
            />
          </View>
        </View>

        {/* Bouton Submit */}
        <Button
          onPress={handleSubmit(onSubmit)}
          variant="primary"
          isLoading={isLoading}
          disabled={!isDirty || isLoading}
        >
          Enregistrer mes choix
        </Button>

        {/* Export des données */}
        <View className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Portabilité des données
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            Téléchargez toutes vos données personnelles au format JSON
          </Text>
          <Button
            variant="outline"
            onPress={onExportData}
            isLoading={isExporting}
            leftIcon={<Download size={16} />}
          >
            Exporter mes données
          </Button>
        </View>

        {/* Suppression du compte */}
        <View className="pt-6 border-t border-gray-200 dark:border-gray-700 space-y-4 pb-8">
          <Text className="text-lg font-semibold text-red-600 dark:text-red-400">
            Zone dangereuse
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            La suppression de votre compte est définitive et irréversible
          </Text>
          <Button
            variant="danger"
            onPress={handleDeleteAccount}
            isLoading={isDeleting}
            leftIcon={<Trash2 size={16} />}
          >
            Supprimer mon compte
          </Button>
        </View>
      </View>
    </ScrollView>
  );
}