import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin, Home, Building2, Mail as MailIcon, AlertCircle } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

// Composants UI adaptés
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { type SelectOption } from '@/components/ui/Select';

// Logique métier & Types
import { updateAddressSchema, type UpdateAddressFormData } from '@/lib/validations/address.schema';
import { useCountries, useCities, useCitySearch } from '@/lib/hooks/useGeo';
import type { Address } from '@/types/address';

interface AddressFormProps {
  address: Address;
  canModify: boolean;
  daysRemaining?: number;
  nextModificationDate?: string;
  onSubmit: (data: UpdateAddressFormData) => Promise<void>;
  onCancel?: () => void;
}

export default function AddressForm({ 
  address, 
  canModify,
  daysRemaining,
  nextModificationDate,
  onSubmit, 
  onCancel 
}: AddressFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');
  const [selectedCountry, setSelectedCountry] = useState<string>(address.pays);

  // Données géographiques (Hooks)
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);
  const { searchResults, search } = useCitySearch(selectedCountry);

  const isChangingCountryRef = useRef(false);
  const lastCountryRef = useRef<string>(address.pays);
  const lastContinentRef = useRef<string>('');
  const isInitializedRef = useRef(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<UpdateAddressFormData>({
    resolver: zodResolver(updateAddressSchema),
    defaultValues: {
      pays: address.pays,
      ville: address.ville,
      quartier: address.quartier || '',
      adresseLigne1: address.adresseLigne1 || '',
      adresseLigne2: address.adresseLigne2 || '',
      codePostal: address.codePostal || '',
    },
  });

  const watchPays = watch('pays');
  const watchVille = watch('ville');

  const selectedCountryData = countries.find(c => c.label === watchPays);
  const continent = selectedCountryData?.continent || '';

  // Initialisation unique
  useEffect(() => {
    if (isInitializedRef.current) return;
    isInitializedRef.current = true;

    if (address.quartier) {
      setAddressType('african');
    } else if (address.adresseLigne1) {
      setAddressType('postal');
    }

    lastCountryRef.current = address.pays;
    if (continent) lastContinentRef.current = continent;
  }, [address, continent]);

  // Gestion changement pays
  const handleCountryChange = useCallback((newCountry: string) => {
    if (isChangingCountryRef.current) return;
    if (newCountry === lastCountryRef.current) return;
    
    isChangingCountryRef.current = true;
    lastCountryRef.current = newCountry;
    setSelectedCountry(newCountry);
    
    if (newCountry !== address.pays) {
      // Reset ville si pays change
      setTimeout(() => {
        setValue('ville', '', { shouldValidate: false, shouldDirty: false, shouldTouch: false });
        isChangingCountryRef.current = false;
      }, 0);
    } else {
      isChangingCountryRef.current = false;
    }
  }, [address.pays, setValue]);

  // Gestion type adresse (Afrique vs Monde)
  useEffect(() => {
    if (!continent) return;
    if (continent === lastContinentRef.current) return;
    
    lastContinentRef.current = continent;
    const newType = continent === 'AF' ? 'african' : 'postal';
    if (newType !== addressType) setAddressType(newType);
  }, [continent, addressType]);

  const cleanFormData = useCallback(
    (data: UpdateAddressFormData): UpdateAddressFormData => ({
      ...data,
      ...(addressType === 'african' && {
        adresseLigne1: undefined,
        adresseLigne2: undefined,
        codePostal: undefined,
      }),
      ...(addressType === 'postal' && {
        quartier: undefined,
      }),
    }),
    [addressType]
  );

  const handleFormSubmit = async (data: UpdateAddressFormData) => {
    setIsSubmitting(true);
    try {
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Options pour les selects
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map(c => ({ value: c.label, label: c.label }));
  }, [countries]);

  const cityOptions = useMemo<SelectOption[]>(() => {
    if (searchResults.length > 0) {
      return searchResults.map((city) => ({ value: city.label, label: city.label }));
    }
    return cities.map((city) => ({ value: city.label, label: city.label }));
  }, [cities, searchResults]);

  const handleCitySearch = useCallback((query: string) => {
    if (query.length >= 2) search(query);
  }, [search]);

  // === RENDER : MODE LECTURE SEULE ===
  if (!canModify) {
    return (
      <View className="space-y-4">
        <View className="bg-warning/10 border border-warning/20 rounded-lg p-4 flex-row">
          <AlertCircle size={24} color="#f59e0b" style={{ marginTop: 2 }} />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-warning-dark text-base mb-1">
              Modification non autorisée
            </Text>
            <Text className="text-sm text-gray-700 leading-5">
              Vous pourrez modifier votre adresse dans <Text className="font-bold">{daysRemaining} jours</Text>
              {nextModificationDate && ` (le ${new Date(nextModificationDate).toLocaleDateString('fr-FR')})`}.
            </Text>
            <Text className="text-sm text-gray-600 mt-2 leading-5">
              Cette restriction existe pour des raisons de sécurité et de conformité.
            </Text>
          </View>
        </View>

        {onCancel && (
          <Button variant="outline" onPress={onCancel} className="w-full mt-4">
            Retour
          </Button>
        )}
      </View>
    );
  }

  // === RENDER : FORMULAIRE ===
  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* Info Box */}
        <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex-row">
          <AlertCircle size={24} color="#2563eb" style={{ marginTop: 2 }} />
          <View className="ml-3 flex-1">
            <Text className="font-bold text-blue-800 text-base mb-1">Attention</Text>
            <Text className="text-sm text-blue-800 leading-5">
              Vous ne pourrez modifier votre adresse qu'une seule fois tous les 6 mois.
              Assurez-vous que les informations sont correctes avant de valider.
            </Text>
          </View>
        </View>

        {/* Champ PAYS */}
        <Controller
          control={control}
          name="pays"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Pays"
              value={value}
              onChange={(val) => {
                onChange(val);
                handleCountryChange(val);
              }}
              options={countryOptions}
              placeholder={isLoadingCountries ? 'Chargement des pays...' : 'Sélectionnez un pays'}
              error={errors.pays?.message}
              leftIcon={<MapPin size={20} color="#9ca3af" />}
              searchable
              required
            />
          )}
        />

        {/* Champ VILLE (s'affiche si un pays est sélectionné) */}
        {watchPays && (
          <Controller
            control={control}
            name="ville"
            render={({ field: { onChange, value } }) => (
              <Select
                label="Ville"
                value={value}
                onChange={onChange}
                options={cityOptions}
                placeholder={isLoadingCities ? 'Chargement...' : 'Tapez pour rechercher votre ville'}
                error={errors.ville?.message}
                leftIcon={<Building2 size={20} color="#9ca3af" />}
                searchable
                onSearch={handleCitySearch}
                required
                disabled={isLoadingCities || !watchPays}
                helperText={searchResults.length > 0 ? `${searchResults.length} résultat(s)` : undefined}
              />
            )}
          />
        )}

        {/* Champs Dynamiques (Adresse) */}
        {watchVille && (
          <View>
            {addressType === 'african' ? (
              <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutUp.duration(200)}>
                <Controller
                  control={control}
                  name="quartier"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Quartier"
                      placeholder="Ex: Bastos, Bonanjo"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.quartier?.message}
                      leftIcon={<Home size={20} color="#9ca3af" />}
                      required
                    />
                  )}
                />
              </Animated.View>
            ) : (
              <Animated.View entering={FadeInUp.duration(300)} exiting={FadeOutUp.duration(200)}>
                <Controller
                  control={control}
                  name="adresseLigne1"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Adresse (ligne 1)"
                      placeholder="Ex: 21 rue du Cher"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.adresseLigne1?.message}
                      leftIcon={<Home size={20} color="#9ca3af" />}
                      required
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="adresseLigne2"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Adresse (ligne 2)"
                      placeholder="Ex: Appartement 3B (optionnel)"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.adresseLigne2?.message}
                      leftIcon={<Building2 size={20} color="#9ca3af" />}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="codePostal"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Code postal"
                      placeholder="Ex: 31100"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.codePostal?.message}
                      leftIcon={<MailIcon size={20} color="#9ca3af" />}
                      required
                      keyboardType="numeric"
                    />
                  )}
                />
              </Animated.View>
            )}
          </View>
        )}

        {/* Info Type */}
        {watchPays && (
          <View className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
            <Text className="text-sm text-gray-700 leading-5">
              {addressType === 'african' ? (
                <Text>Format Afrique : Indiquez votre quartier/localité.</Text>
              ) : (
                <Text>Format international : Adresse postale complète requise.</Text>
              )}
            </Text>
          </View>
        )}

        {/* Boutons */}
        <View className="flex-row gap-3 pt-2 border-t border-gray-200 mt-2">
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
            >
              {isSubmitting ? '...' : "Enregistrer"}
            </Button>
          </View>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}