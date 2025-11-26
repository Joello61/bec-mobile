import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable, ScrollView } from 'react-native';
import { Filter, RefreshCcw, X, MapPin, Calendar } from 'lucide-react-native';
import { DEMANDE_STATUTS } from '@/lib/utils/constants';
import { useTopCitiesGlobal, useCitySearchGlobal } from '@/lib/hooks/useGeo';
import type { DemandeFilters as DemandeFiltersType } from '@/types';
import type { SelectOption } from '@/components/ui/Select';
import Select from '@/components/ui/Select';
import Input from '../ui/Input';

interface DemandeFiltersProps {
  onFilterChange: (filters: DemandeFiltersType) => void;
  initialFilters?: DemandeFiltersType;
  refetchDemandes?: () => void;
  isPublic?: boolean;
}

export default function DemandeFilters({ 
  onFilterChange, 
  initialFilters = {}, 
  refetchDemandes,
  isPublic = false
}: DemandeFiltersProps) {
  const [filters, setFilters] = useState<DemandeFiltersType>(initialFilters);

  // ✅ Top 100 villes mondiales (chargé une seule fois)
  const { topCitiesGlobal, isLoading: isLoadingTopCities } = useTopCitiesGlobal();

  // ✅ Recherche globale pour départ et arrivée
  const { 
    searchResults: searchResultsDepart, 
    search: searchDepart 
  } = useCitySearchGlobal();

  const { 
    searchResults: searchResultsArrivee, 
    search: searchArrivee 
  } = useCitySearchGlobal();

  // ✅ Options ville départ : Top 100 + Résultats recherche
  const optionsDepart = useMemo<SelectOption[]>(() => {
    const baseOptions: SelectOption[] = [
      { value: '', label: 'Toutes les villes' }
    ];

    if (searchResultsDepart.length > 0) {
      return [
        ...baseOptions,
        ...searchResultsDepart.map((city) => ({
          value: city.label,
          label: `${city.label} (${city.country})`,
        }))
      ];
    }
    
    return [
      ...baseOptions,
      ...topCitiesGlobal.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }))
    ];
  }, [topCitiesGlobal, searchResultsDepart]);

  // ✅ Options ville arrivée : Top 100 + Résultats recherche
  const optionsArrivee = useMemo<SelectOption[]>(() => {
    const baseOptions: SelectOption[] = [
      { value: '', label: 'Toutes les villes' }
    ];

    if (searchResultsArrivee.length > 0) {
      return [
        ...baseOptions,
        ...searchResultsArrivee.map((city) => ({
          value: city.label,
          label: `${city.label} (${city.country})`,
        }))
      ];
    }
    
    return [
      ...baseOptions,
      ...topCitiesGlobal.map((city) => ({
        value: city.label,
        label: `${city.label} (${city.country})`,
      }))
    ];
  }, [topCitiesGlobal, searchResultsArrivee]);

  // ✅ Recherche départ
  const handleSearchDepart = useCallback((query: string) => {
    if (query.length >= 2) {
      searchDepart(query, 50);
    }
  }, [searchDepart]);

  // ✅ Recherche arrivée
  const handleSearchArrivee = useCallback((query: string) => {
    if (query.length >= 2) {
      searchArrivee(query, 50);
    }
  }, [searchArrivee]);

  const handleFilterChange = (key: keyof DemandeFiltersType, value: string) => {
    const newFilters = { ...filters, [key]: value || undefined };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    setFilters({});
    onFilterChange({});
  };

  const hasActiveFilters = Object.values(filters).some(v => v);
  const activeFiltersCount = Object.values(filters).filter(v => v).length;

  return (
    <View className="gap-4">
      {/* Header avec actions */}
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2 flex-1">
          <View className="flex-row items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-800 rounded-lg">
            <Filter size={16} className="text-gray-600 dark:text-gray-400" />
            <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
              Filtres
            </Text>
            {hasActiveFilters && (
              <View className="px-1.5 py-0.5 bg-primary dark:bg-primary-light rounded-full">
                <Text className="text-xs font-bold text-white dark:text-gray-900">
                  {activeFiltersCount}
                </Text>
              </View>
            )}
          </View>

          {refetchDemandes && (
            <Pressable
              onPress={refetchDemandes}
              className="w-9 h-9 bg-gray-100 dark:bg-gray-800 rounded-lg flex items-center justify-center active:opacity-70"
            >
              <RefreshCcw size={18} className="text-gray-600 dark:text-gray-400" />
            </Pressable>
          )}
        </View>

        {hasActiveFilters && (
          <Pressable
            onPress={clearFilters}
            className="flex-row items-center gap-1 active:opacity-70"
          >
            <X size={16} className="text-error dark:text-red-400" />
            <Text className="text-sm font-medium text-error dark:text-red-400">
              Effacer
            </Text>
          </Pressable>
        )}
      </View>

      {/* Filters Content */}
      <ScrollView 
        className="gap-4"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled
      >
        {/* Ville de départ avec recherche */}
        <View>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Ville de départ
          </Text>
          <Select
            leftIcon={<MapPin size={20} />}
            options={optionsDepart}
            value={filters.villeDepart || ''}
            onChange={(value) => handleFilterChange('villeDepart', value)}
            placeholder={isLoadingTopCities ? 'Chargement...' : 'Toutes les villes'}
            disabled={isLoadingTopCities}
            searchable
            onSearch={handleSearchDepart}
          />
        </View>

        {/* Ville d'arrivée avec recherche */}
        <View>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Ville d&apos;arrivée
          </Text>
          <Select
            leftIcon={<MapPin size={20} />}
            options={optionsArrivee}
            value={filters.villeArrivee || ''}
            onChange={(value) => handleFilterChange('villeArrivee', value)}
            placeholder={isLoadingTopCities ? 'Chargement...' : 'Toutes les villes'}
            disabled={isLoadingTopCities}
            searchable
            onSearch={handleSearchArrivee}
          />
        </View>

        {/* Date limite */}
        <View>
          <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
            Date limite
          </Text>
          <Input
            value={filters.dateLimite || ''}
            onChangeText={(value) => handleFilterChange('dateLimite', value)}
            leftIcon={<Calendar size={20} />}
          />
        </View>

        {/* Statut */}
        {!isPublic && (
          <View>
            <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-2">
              Statut
            </Text>
            <Select
              options={[
                { value: '', label: 'Tous les statuts' },
                ...DEMANDE_STATUTS.map((status) => ({
                  value: status.value,
                  label: status.label
                }))
              ]}
              value={filters.statut || ''}
              onChange={(value) => handleFilterChange('statut', value)}
              searchable={false}
            />
          </View>
        )}

        {/* Indicateur de filtres actifs */}
        {hasActiveFilters && (
          <View className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center justify-between">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </Text>
              <Pressable
                onPress={clearFilters}
                className="active:opacity-70"
              >
                <Text className="text-sm text-error dark:text-red-400 font-medium">
                  Tout effacer
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </ScrollView>
    </View>
  );
}