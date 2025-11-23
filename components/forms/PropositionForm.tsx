import React from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MessageSquare, Info } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';

// Validation & Hooks
import {
  createPropositionSchema,
  type CreatePropositionFormData,
} from '@/lib/validations/proposition.schema';
import { useUserCurrency } from '@/lib/hooks/useCurrency';
import { formatDateShort, getCurrencySymbol } from '@/lib/utils/format';
import type { Voyage } from '@/types';
// import { useUserContinent } from '@/lib/hooks/useGeo'; // Moins utile sur mobile pour le "step" input

interface PropositionFormProps {
  voyage: Voyage;
  userDemandes: Array<{
    id: number;
    villeDepart: string;
    villeArrivee: string;
    dateLimite: string;
    prixParKilo: number;
    commission: number;
  }>;
  onSubmit: (data: CreatePropositionFormData) => Promise<void>;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

export default function PropositionForm({
  voyage,
  userDemandes,
  onSubmit,
  onCancel,
  isSubmitting = false,
}: PropositionFormProps) {
  const { userCurrency } = useUserCurrency();
  const currencySymbol = getCurrencySymbol(userCurrency);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<CreatePropositionFormData>({
    resolver: zodResolver(createPropositionSchema),
    defaultValues: {
      prixParKilo: voyage.prixParKilo
        ? voyage.converted?.prixParKilo || parseFloat(voyage.prixParKilo)
        : undefined,
      commissionProposeePourUnBagage: voyage.commissionProposeePourUnBagage
        ? voyage.converted?.commission || parseFloat(voyage.commissionProposeePourUnBagage)
        : undefined,
    },
  });

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
        {/* Sélection de la demande */}
        <Controller
          name="demandeId"
          control={control}
          render={({ field: { onChange, value } }) => (
            <Select
              label="Sélectionnez votre demande"
              required
              placeholder="Choisissez une demande"
              // On map les demandes pour le format du Select
              options={userDemandes.map((demande) => ({
                value: demande.id.toString(),
                label: `${demande.villeDepart} ➝ ${demande.villeArrivee} (${formatDateShort(demande.dateLimite)})`,
              }))}
              // Conversion string <-> number pour le formulaire
              value={value?.toString()}
              onChange={(val) => onChange(val ? Number(val) : '')}
              error={errors.demandeId?.message}
              searchable={false} // Pas besoin de recherche s'il y a peu de demandes
            />
          )}
        />

        {/* ==================== SECTION PRIX ==================== */}
        <View className="pt-4 border-t border-gray-200 mt-2 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Votre proposition</Text>
            <View className="bg-primary/10 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-primary">
                Devise : {currencySymbol}
              </Text>
            </View>
          </View>

          <View className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-row">
            <Info size={20} color="#2563eb" style={{ marginTop: 2 }} />
            <Text className="text-sm text-blue-900 ml-2 flex-1 leading-5">
              Les montants sont dans votre devise ({userCurrency}). Le voyageur les verra
              automatiquement convertis dans sa devise.
            </Text>
          </View>

          {/* Prix par kilo */}
          <Controller
            control={control}
            name="prixParKilo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={`Prix par kilo (${currencySymbol})`}
                placeholder={voyage.prixParKilo || '5000'}
                keyboardType="numeric"
                // Gestion value number/string pour TextInput
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                onBlur={onBlur}
                error={errors.prixParKilo?.message}
                helperText="Prix que vous proposez par kilogramme"
                required
              />
            )}
          />

          {/* Commission */}
          <Controller
            control={control}
            name="commissionProposeePourUnBagage"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={`Commission pour un bagage complet (${currencySymbol})`}
                placeholder={voyage.commissionProposeePourUnBagage || '50000'}
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                onBlur={onBlur}
                error={errors.commissionProposeePourUnBagage?.message}
                helperText="Commission que vous proposez pour un bagage entier"
                required
              />
            )}
          />
        </View>

        {/* Message optionnel */}
        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Message (optionnel)"
              placeholder="Ajoutez un message pour le voyageur..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.message?.message}
              helperText="Maximum 1000 caractères"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              style={{ minHeight: 100 }}
              leftIcon={<MessageSquare size={20} color="#9ca3af" />}
            />
          )}
        />

        {/* Actions */}
        <View className="flex-row gap-3 pt-4 border-t border-gray-200 mt-2">
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
              onPress={handleSubmit(onSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Envoyer la proposition
            </Button>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}