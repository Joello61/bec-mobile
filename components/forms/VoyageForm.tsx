import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Plane, Info, MapPin, AlertCircle } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { type SelectOption } from '@/components/ui/Select';

// Validation & Hooks
import { createVoyageSchema, type CreateVoyageFormData } from '@/lib/validations/voyage.schema';
import { useTopCitiesGlobal, useCitySearchGlobal } from '@/lib/hooks/useGeo';
import { useUserCurrency } from '@/lib/hooks/useCurrency';
import { getCurrencySymbol } from '@/lib/utils/format';
import type { Voyage } from '@/types';

interface VoyageFormProps {
  voyage?: Voyage;
  onSubmit: (data: CreateVoyageFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function VoyageForm({ voyage, onSubmit, onCancel }: VoyageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Devise utilisateur
  const { userCurrency } = useUserCurrency();
  const currencySymbol = getCurrencySymbol(userCurrency);

  // Top 100 villes mondiales
  const { topCitiesGlobal, isLoading: isLoadingTopCities } = useTopCitiesGlobal();

  // Recherche globale pour chaque champ
  const { 
    searchResults: searchResultsDepart, 
    search: searchDepart 
  } = useCitySearchGlobal();

  const { 
    searchResults: searchResultsArrivee, 
    search: searchArrivee 
  } = useCitySearchGlobal();

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CreateVoyageFormData>({
    resolver: zodResolver(createVoyageSchema),
    defaultValues: voyage
      ? {
          villeDepart: voyage.villeDepart,
          villeArrivee: voyage.villeArrivee,
          dateDepart: voyage.dateDepart.split('T')[0],
          dateArrivee: voyage.dateArrivee.split('T')[0],
          poidsDisponible: parseFloat(voyage.poidsDisponible),
          prixParKilo: voyage.prixParKilo ? parseFloat(voyage.prixParKilo) : undefined,
          commissionProposeePourUnBagage: voyage.commissionProposeePourUnBagage 
            ? parseFloat(voyage.commissionProposeePourUnBagage) 
            : undefined,
          description: voyage.description || '',
        }
      : undefined,
  });

  // Surveiller les villes pour détecter doublons
  const watchVilleDepart = watch('villeDepart');
  const watchVilleArrivee = watch('villeArrivee');

  // Options ville départ
  const optionsDepart = useMemo<SelectOption[]>(() => {
    if (searchResultsDepart.length > 0) {
      return searchResultsDepart.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }));
    }
    
    return topCitiesGlobal.map((city) => ({
      value: city.label,
      label: `${city.label} (${city.country})`,
    }));
  }, [topCitiesGlobal, searchResultsDepart]);

  // Options ville arrivée
  const optionsArrivee = useMemo<SelectOption[]>(() => {
    if (searchResultsArrivee.length > 0) {
      return searchResultsArrivee.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }));
    }
    
    return topCitiesGlobal.map((city) => ({
      value: city.label,
      label: `${city.label} (${city.country})`,
    }));
  }, [topCitiesGlobal, searchResultsArrivee]);

  // Recherche handlers
  const handleSearchDepart = useCallback((query: string) => {
    if (query.length >= 2) {
      searchDepart(query, 50);
    }
  }, [searchDepart]);

  const handleSearchArrivee = useCallback((query: string) => {
    if (query.length >= 2) {
      searchArrivee(query, 50);
    }
  }, [searchArrivee]);

  const handleFormSubmit = async (data: CreateVoyageFormData) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Warning villes identiques
  const showCityWarning = watchVilleDepart && watchVilleArrivee && 
    watchVilleDepart.trim().toLowerCase() === watchVilleArrivee.trim().toLowerCase();

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
        
        {/* Warning villes identiques */}
        {showCityWarning && (
          <View className="bg-warning/10 border border-warning/20 rounded-lg p-4 mb-6 flex-row">
            <AlertCircle size={24} color="#f59e0b" style={{ marginTop: 2 }} />
            <View className="ml-3 flex-1">
              <Text className="font-bold text-warning-dark text-base mb-1">
                Villes identiques
              </Text>
              <Text className="text-sm text-gray-700 leading-5">
                La ville de départ et la ville d'arrivée sont les mêmes. 
                Veuillez sélectionner des villes différentes.
              </Text>
            </View>
          </View>
        )}

        {/* === SECTION 1 : ITINÉRAIRE === */}
        
        <Controller
          control={control}
          name="villeDepart"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Ville de départ"
              required
              leftIcon={<MapPin size={20} color="#9ca3af" />}
              options={optionsDepart}
              placeholder={isLoadingTopCities ? 'Chargement...' : 'Sélectionnez ou recherchez une ville'}
              disabled={isLoadingTopCities}
              value={value}
              onChange={onChange}
              error={errors.villeDepart?.message}
              searchable
              onSearch={handleSearchDepart}
              helperText={'Ville de départ du voyage'}
            />
          )}
        />

        <Controller
          control={control}
          name="villeArrivee"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Ville d'arrivée"
              required
              leftIcon={<MapPin size={20} color="#9ca3af" />}
              options={optionsArrivee}
              placeholder={isLoadingTopCities ? 'Chargement...' : 'Sélectionnez ou recherchez une ville'}
              disabled={isLoadingTopCities}
              value={value}
              onChange={onChange}
              error={errors.villeArrivee?.message}
              searchable
              onSearch={handleSearchArrivee}
              helperText={'Ville d\'arrivée du voyage'}
            />
          )}
        />

        {/* === SECTION 2 : DATES === */}
        
        <View className="flex-row gap-4">
          <View className="flex-1">
            <Controller
              control={control}
              name="dateDepart"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Date de départ"
                  placeholder="AAAA-MM-JJ"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dateDepart?.message}
                  required
                />
              )}
            />
          </View>
          <View className="flex-1">
            <Controller
              control={control}
              name="dateArrivee"
              render={({ field: { onChange, onBlur, value } }) => (
                <Input
                  label="Date d'arrivée"
                  placeholder="AAAA-MM-JJ"
                  value={value}
                  onChangeText={onChange}
                  onBlur={onBlur}
                  error={errors.dateArrivee?.message}
                  required
                />
              )}
            />
          </View>
        </View>

        {/* Poids */}
        <Controller
          control={control}
          name="poidsDisponible"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Poids disponible (kg)"
              placeholder="15"
              keyboardType="numeric"
              value={value?.toString()}
              onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
              onBlur={onBlur}
              error={errors.poidsDisponible?.message}
              helperText="Poids maximum que vous pouvez transporter"
              required
            />
          )}
        />

        {/* === SECTION 3 : TARIFICATION === */}
        
        <View className="pt-6 mt-2 border-t border-gray-200 mb-4">
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-gray-900">Tarification</Text>
            <View className="flex-row items-center bg-primary/10 px-3 py-1.5 rounded-lg">
              <Text className="text-sm font-medium text-primary">
                Devise : {currencySymbol}
              </Text>
            </View>
          </View>

          <View className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg flex-row">
            <Info size={20} color="#2563eb" style={{ marginTop: 2 }} />
            <Text className="text-sm text-blue-900 ml-2 flex-1 leading-5">
              Les montants sont dans votre devise ({userCurrency}). Ils seront automatiquement 
              convertis pour les clients utilisant d'autres devises.
            </Text>
          </View>
          
          <Controller
            control={control}
            name="prixParKilo"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={`Prix par kilo (${currencySymbol})`}
                placeholder="5000"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                onBlur={onBlur}
                error={errors.prixParKilo?.message}
                helperText="Prix suggéré par kilogramme"
                required
              />
            )}
          />

          <Controller
            control={control}
            name="commissionProposeePourUnBagage"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label={`Commission pour un bagage (${currencySymbol})`}
                placeholder="50000"
                keyboardType="numeric"
                value={value?.toString()}
                onChangeText={(text) => onChange(text ? parseFloat(text) : '')}
                onBlur={onBlur}
                error={errors.commissionProposeePourUnBagage?.message}
                helperText="Commission suggérée pour un bagage entier"
                required
              />
            )}
          />

          <Text className="mt-1 text-xs text-gray-500">
            Ces informations aident les clients à évaluer votre offre. Ils pourront faire des contre-propositions.
          </Text>
        </View>

        {/* === SECTION 4 : DESCRIPTION === */}

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              label="Description"
              placeholder="Informations supplémentaires sur votre voyage..."
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              error={errors.description?.message}
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
              leftIcon={<Plane size={18} color="white" />}
            >
              {voyage ? 'Modifier' : 'Créer le voyage'}
            </Button>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}