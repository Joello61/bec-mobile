import React from 'react';
import { View, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Globe, DollarSign, Clock, Calendar } from 'lucide-react-native';
import { preferencesSettingsSchema, type PreferencesSettingsFormData } from '@/lib/validations';
import type { UserSettings } from '@/types';
import Select from '../ui/Select';
import Button from '../ui/Button';

interface PreferencesSettingsFormProps {
  settings: UserSettings;
  onSubmit: (data: Partial<UserSettings>) => Promise<void>;
  isLoading?: boolean;
}

export default function PreferencesSettingsForm({
  settings,
  onSubmit,
  isLoading,
}: PreferencesSettingsFormProps) {
  const { control, handleSubmit, formState: { errors, isDirty } } = useForm<PreferencesSettingsFormData>({
    resolver: zodResolver(preferencesSettingsSchema),
    defaultValues: {
      langue: settings.langue,
      devise: settings.devise as PreferencesSettingsFormData['devise'],
      timezone: settings.timezone,
      dateFormat: settings.dateFormat,
    },
  });

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-6">
        {/* Langue */}
        <Controller
          name="langue"
          control={control}
          render={({ field }) => (
            <Select
              label="Langue de l'interface"
              leftIcon={<Globe size={16} className="text-primary" />}
              error={errors.langue?.message}
              options={[
                { value: 'fr', label: 'Français' },
                { value: 'en', label: 'English' },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Devise */}
        <Controller
          name="devise"
          control={control}
          render={({ field }) => (
            <Select
              label="Devise préférée"
              leftIcon={<DollarSign size={16} className="text-primary" />}
              error={errors.devise?.message}
              helperText="Cette devise sera utilisée pour afficher les prix et commissions"
              options={[
                { value: 'XAF', label: 'Franc CFA (XAF)' },
                { value: 'EUR', label: 'Euro (EUR)' },
                { value: 'USD', label: 'Dollar US (USD)' },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Fuseau horaire */}
        <Controller
          name="timezone"
          control={control}
          render={({ field }) => (
            <Select
              label="Fuseau horaire"
              leftIcon={<Clock size={16} className="text-primary" />}
              error={errors.timezone?.message}
              options={[
                { value: 'Africa/Douala', label: 'Afrique/Douala (GMT+1)' },
                { value: 'Europe/Paris', label: 'Europe/Paris (GMT+1)' },
                { value: 'Europe/London', label: 'Europe/Londres (GMT+0)' },
                { value: 'America/New_York', label: 'Amérique/New York (GMT-5)' },
                { value: 'America/Los_Angeles', label: 'Amérique/Los Angeles (GMT-8)' },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

        {/* Format de date */}
        <Controller
          name="dateFormat"
          control={control}
          render={({ field }) => (
            <Select
              label="Format de date"
              leftIcon={<Calendar size={16} className="text-primary" />}
              error={errors.dateFormat?.message}
              options={[
                { value: 'dd/MM/yyyy', label: 'JJ/MM/AAAA (31/12/2025)' },
                { value: 'MM/dd/yyyy', label: 'MM/JJ/AAAA (12/31/2025)' },
                { value: 'yyyy-MM-dd', label: 'AAAA-MM-JJ (2025-12-31)' },
              ]}
              value={field.value}
              onChange={field.onChange}
            />
          )}
        />

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