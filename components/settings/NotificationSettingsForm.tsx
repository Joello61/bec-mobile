import React from 'react';
import { View, Text, ScrollView, Switch, Pressable } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react-native';
import { notificationSettingsSchema, type NotificationSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import Button from '../ui/Button';

interface NotificationSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function NotificationSettingsForm({
  settings,
  onSubmit,
  isLoading,
}: NotificationSettingsFormProps) {
  const { control, handleSubmit, formState: { isDirty } } = useForm<NotificationSettingsFormData>({
    resolver: zodResolver(notificationSettingsSchema),
    defaultValues: {
      emailNotificationsEnabled: settings.emailNotificationsEnabled,
      smsNotificationsEnabled: settings.smsNotificationsEnabled,
      pushNotificationsEnabled: settings.pushNotificationsEnabled,
      notifyOnNewMessage: settings.notifyOnNewMessage,
      notifyOnMatchingVoyage: settings.notifyOnMatchingVoyage,
      notifyOnMatchingDemande: settings.notifyOnMatchingDemande,
      notifyOnNewAvis: settings.notifyOnNewAvis,
      notifyOnFavoriUpdate: settings.notifyOnFavoriUpdate,
    },
  });

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-6">
        {/* Canaux de notification */}
        <View className="space-y-4">
          <View className="flex-row items-center gap-2 mb-2">
            <Bell size={20} className="text-primary" />
            <Text className="text-lg font-semibold text-gray-900 dark:text-white">
              Canaux de notification
            </Text>
          </View>

          <View className="space-y-3">
            {/* Email */}
            <Controller
              name="emailNotificationsEnabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Mail size={20} className="text-gray-400 dark:text-gray-500" />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white">
                      Email
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Recevoir des notifications par email
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

            {/* SMS */}
            <Controller
              name="smsNotificationsEnabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <MessageSquare size={20} className="text-gray-400 dark:text-gray-500" />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white">
                      SMS
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Recevoir des notifications par SMS
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

            {/* Push */}
            <Controller
              name="pushNotificationsEnabled"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Smartphone size={20} className="text-gray-400 dark:text-gray-500" />
                  <View className="flex-1">
                    <Text className="font-medium text-gray-900 dark:text-white">
                      Push
                    </Text>
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Recevoir des notifications push
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
          </View>
        </View>

        {/* Types de notifications */}
        <View className="space-y-4">
          <Text className="text-lg font-semibold text-gray-900 dark:text-white">
            Types de notifications
          </Text>

          <View className="space-y-2">
            {/* Nouveaux messages */}
            <Controller
              name="notifyOnNewMessage"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Nouveaux messages
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

            {/* Voyages correspondants */}
            <Controller
              name="notifyOnMatchingVoyage"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Voyages correspondants
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

            {/* Demandes correspondantes */}
            <Controller
              name="notifyOnMatchingDemande"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Demandes correspondantes
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

            {/* Nouveaux avis */}
            <Controller
              name="notifyOnNewAvis"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Nouveaux avis
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

            {/* Mise à jour des favoris */}
            <Controller
              name="notifyOnFavoriUpdate"
              control={control}
              render={({ field: { value, onChange } }) => (
                <Pressable
                  onPress={() => onChange(!value)}
                  className="flex-row items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-xl bg-white dark:bg-gray-800 active:bg-gray-50 dark:active:bg-gray-700"
                >
                  <Text className="text-gray-900 dark:text-white">
                    Mise à jour des favoris
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

        {/* Bouton Submit */}
        <View className="pt-4">
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