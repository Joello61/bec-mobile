import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, Text, ScrollView, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Phone, MapPin, Home, Building2, Mail as MailIcon, Trash2 } from 'lucide-react-native';
import Animated, { FadeInUp, FadeOutUp } from 'react-native-reanimated';

// Composants UI
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import Select, { type SelectOption } from '@/components/ui/Select';
import Avatar from '@/components/ui/Avatar';
import InputFile, { type FileAsset } from '@/components/ui/InputFile';

import { useAuth } from '@/lib/hooks/useAuth'; // Attention au chemin d'import selon votre structure
import { useCountries, useCities, useCitySearch } from '@/lib/hooks/useGeo';
import { CompleteProfileFormData, completeProfileSchema } from '@/lib/validations';
import { useAvatar } from '@/lib/hooks/useUsers';

export default function CompleteProfileForm({
  onSubmit,
}: {
  onSubmit: (data: CompleteProfileFormData) => Promise<void>;
}) {
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [addressType, setAddressType] = useState<'african' | 'postal'>('african');
  const [selectedCountry, setSelectedCountry] = useState<string>('');
  
  // ✅ MOBILE : On stocke l'asset (uri, type, name) au lieu d'un File DOM
  const [selectedFile, setSelectedFile] = useState<FileAsset | null>(null);
  
  const lastContinentRef = useRef<string>('');

  // Hook pour l'avatar
  const { 
    uploadAvatar, 
    deleteAvatar,
    isUploading, 
    error: uploadError,
    clearError,
    currentAvatar 
  } = useAvatar();

  // Données géographiques
  const { countries, isLoading: isLoadingCountries } = useCountries();
  const { cities, isLoading: isLoadingCities } = useCities(selectedCountry);
  const { searchResults, isSearching, search } = useCitySearch(selectedCountry);

  // Initialisation des valeurs par défaut
  const defaultValues = useMemo<CompleteProfileFormData>(() => {
    const address = user?.address;
    
    return {
      telephone: user?.telephone || '',
      pays: address?.pays || '',
      ville: address?.ville || '',
      quartier: address?.quartier || '',
      adresseLigne1: address?.adresseLigne1 || '',
      adresseLigne2: address?.adresseLigne2 || '',
      codePostal: address?.codePostal || '',
      bio: user?.bio || '',
      photo: user?.photo || '',
    };
  }, [user]);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CompleteProfileFormData>({
    resolver: zodResolver(completeProfileSchema),
    defaultValues,
  });

  const watchPays = watch('pays');
  const watchVille = watch('ville');

  const selectedCountryData = countries.find((c) => c.label === watchPays);
  const continent = selectedCountryData?.continent || '';

  // Initialiser le pays sélectionné
  useEffect(() => {
    if (defaultValues.pays && !selectedCountry) {
      setSelectedCountry(defaultValues.pays);
    }
  }, [defaultValues.pays, selectedCountry]);

  // Détecter le type d'adresse initial
  useEffect(() => {
    if (user?.address) {
      const hasQuartier = !!user.address.quartier;
      const hasPostal = !!user.address.adresseLigne1 || !!user.address.codePostal;
      
      if (hasQuartier) {
        setAddressType('african');
      } else if (hasPostal) {
        setAddressType('postal');
      }
    }
  }, [user?.address]);

  // Mise à jour du type d'adresse selon continent
  useEffect(() => {
    if (!continent || continent === lastContinentRef.current) return;

    lastContinentRef.current = continent;
    const newType = continent === 'AF' ? 'african' : 'postal';

    if (newType !== addressType) {
      setAddressType(newType);
      if (newType === 'african') {
        setValue('adresseLigne1', '');
        setValue('adresseLigne2', '');
        setValue('codePostal', '');
      } else {
        setValue('quartier', '');
      }
    }
  }, [continent, addressType, setValue]);

  useEffect(() => {
    if (watchPays) {
      setSelectedCountry(watchPays);
    }
  }, [watchPays]);

  // Options
  const countryOptions = useMemo<SelectOption[]>(() => {
    return countries.map((c) => ({ value: c.label, label: c.label }));
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

  // Nettoyage des données avant envoi
  const cleanFormData = useCallback(
    (data: CompleteProfileFormData): CompleteProfileFormData => ({
      ...data,
      photo: undefined,
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

  const handleFormSubmit = async (data: CompleteProfileFormData) => {
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
      const cleanedData = cleanFormData(data);
      await onSubmit(cleanedData);

      setSelectedFile(null);
    } catch (error) {
      console.error('Erreur soumission formulaire:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isProcessing = isSubmitting || isUploading;

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
        
        {/* === SECTION 1 : PHOTO === */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3">
            Photo de profil (optionnel)
          </Text>
          <View className="flex-row items-start gap-4">
            <Avatar
              src={currentAvatar || undefined}
              fallback={user ? `${user.nom} ${user.prenom}` : 'User'}
              size="xl"
            />
            <View className="flex-1">
              <InputFile
                onFileSelect={handleFileSelect}
                error={uploadError || undefined}
                helperText="JPG, PNG (max 5MB)"
                maxSize={5}
                showPreview={false} // On utilise l'avatar à côté pour la preview
                disabled={isProcessing}
              />
              
              {/* Bouton suppression si avatar existant et pas de nouveau fichier */}
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

        {/* === SECTION 2 : TÉLÉPHONE === */}
        <Controller
          control={control}
          name="telephone"
          render={({ field: { onChange, onBlur, value } }) => (
            <View className="mb-2">
              <Input
                label="Numéro de téléphone"
                placeholder="+237 6XX XX XX XX"
                keyboardType="phone-pad"
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.telephone?.message}
                helperText="Format international: +237XXXXXXXXX"
                leftIcon={<Phone size={20} color="#9ca3af" />}
                required
                editable={!(user?.telephone && user?.telephoneVerifie) && !isProcessing}
              />
              {user?.telephone && user?.telephoneVerifie && (
                <Text className="text-xs text-success mt-1 ml-1">
                  ✓ Téléphone déjà vérifié
                </Text>
              )}
            </View>
          )}
        />

        {/* === SECTION 3 : ADRESSE === */}
        {/* Pays */}
        <Controller
          control={control}
          name="pays"
          render={({ field: { onChange, value } }) => (
            <Select
              label="Pays"
              value={value}
              onChange={(val) => {
                onChange(val);
                setSelectedCountry(val);
                setValue('ville', '');
              }}
              options={countryOptions}
              placeholder={isLoadingCountries ? 'Chargement...' : 'Sélectionnez un pays'}
              error={errors.pays?.message}
              leftIcon={<MapPin size={20} color="#9ca3af" />}
              searchable
              required
              disabled={isLoadingCountries || isProcessing}
            />
          )}
        />

        {/* Ville */}
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
                placeholder={isLoadingCities ? 'Chargement...' : 'Rechercher votre ville'}
                error={errors.ville?.message}
                leftIcon={<Building2 size={20} color="#9ca3af" />}
                searchable
                onSearch={handleCitySearch}
                required
                disabled={isLoadingCities || !watchPays || isProcessing}
                helperText={searchResults.length > 0 ? `${searchResults.length} résultat(s)` : undefined}
              />
            )}
          />
        )}

        {/* Champs Dynamiques */}
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
                      editable={!isProcessing}
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
                      editable={!isProcessing}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="adresseLigne2"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <Input
                      label="Adresse (ligne 2)"
                      placeholder="Ex: Appartement 3B"
                      value={value}
                      onChangeText={onChange}
                      onBlur={onBlur}
                      error={errors.adresseLigne2?.message}
                      leftIcon={<Building2 size={20} color="#9ca3af" />}
                      editable={!isProcessing}
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
                      editable={!isProcessing}
                      keyboardType="numeric"
                    />
                  )}
                />
              </Animated.View>
            )}
          </View>
        )}

        {/* Info Type Adresse */}
        {watchPays && (
          <View className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
            <Text className="text-sm text-blue-800 leading-5">
              {addressType === 'african' ? (
                <Text>Format Afrique : Indiquez votre quartier/localité.</Text>
              ) : (
                <Text>Format international : Adresse postale complète requise.</Text>
              )}
            </Text>
          </View>
        )}

        {/* === SECTION 4 : OPTIONNEL === */}
        <View className="pt-4 border-t border-gray-200 mt-2 mb-4">
          <Text className="text-sm font-semibold text-gray-700 mb-4">
            Informations complémentaires (optionnel)
          </Text>

          <Controller
            control={control}
            name="bio"
            render={({ field: { onChange, onBlur, value } }) => (
              <Input
                label="Bio"
                placeholder="Parlez-nous de vous..."
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                error={errors.bio?.message}
                helperText="500 caractères maximum"
                editable={!isProcessing}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                style={{ minHeight: 80 }}
              />
            )}
          />
        </View>

        {/* === BOUTON SUBMIT === */}
        <View className="pt-2">
          <Button
            variant="primary"
            onPress={handleSubmit(handleFormSubmit)}
            isLoading={isProcessing}
            disabled={isProcessing}
            size="lg"
          >
            {isProcessing ? 'Envoi en cours...' : 'Compléter mon profil'}
          </Button>

          <Text className="text-xs text-gray-500 text-center mt-4">
            {user?.telephoneVerifie
              ? 'Vos informations seront mises à jour'
              : 'Un code de vérification sera envoyé par SMS à votre numéro'}
          </Text>
        </View>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}