import React, { useState, useMemo, useCallback } from 'react';
import { View, Text, Pressable } from 'react-native';
import { RefreshCw, X, MapPin } from 'lucide-react-native';
import { VOYAGE_STATUTS } from '@/lib/utils/constants';
import { useTopCitiesGlobal, useCitySearchGlobal } from '@/lib/hooks/useGeo';
import type { VoyageFilters as VoyageFiltersType } from '@/types';
import type { SelectOption } from '@/components/ui/Select';
import Button from '../ui/Button';
import Select from '@/components/ui/Select';
import Input from '../ui/Input';

interface VoyageFiltersProps {
  onFilterChange: (filters: VoyageFiltersType) => void;
  initialFilters?: VoyageFiltersType;
  refetchVoyages?: () => void;
  isPublic?: boolean;
  isInsideModal?: boolean; // Indique si les filtres sont dans un BottomSheet/Modal
}

export default function VoyageFilters({ 
  onFilterChange, 
  initialFilters = {}, 
  refetchVoyages,
  isPublic = false,
  isInsideModal = false
}: VoyageFiltersProps) {
  const [filters, setFilters] = useState<VoyageFiltersType>(initialFilters);

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

  const handleFilterChange = (key: keyof VoyageFiltersType, value: string) => {
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
    <View className="flex-1">
      {/* Header avec bouton actualiser (si pas dans modal) */}
      {!isInsideModal && refetchVoyages && (
        <View className="px-4 pb-4 border-b border-border">
          <Button
            variant="outline"
            onPress={refetchVoyages}
            leftIcon={<RefreshCw size={20} className="text-foreground" />}
          >
            Actualiser
          </Button>
        </View>
      )}

      {/* Contenu des filtres */}
      <View className="px-4 py-4 gap-4">
        {/* Ville de départ avec recherche */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">
            Ville de départ
          </Text>
          <Select
            leftIcon={<MapPin size={20} className="text-muted" />}
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
          <Text className="text-sm font-semibold text-foreground mb-2">
            Ville d&apos;arrivée
          </Text>
          <Select
            leftIcon={<MapPin size={20} className="text-muted" />}
            options={optionsArrivee}
            value={filters.villeArrivee || ''}
            onChange={(value) => handleFilterChange('villeArrivee', value)}
            placeholder={isLoadingTopCities ? 'Chargement...' : 'Toutes les villes'}
            disabled={isLoadingTopCities}
            searchable
            onSearch={handleSearchArrivee}
          />
        </View>

        {/* Date de départ */}
        <View>
          <Text className="text-sm font-semibold text-foreground mb-2">
            Date de départ
          </Text>
          <Input
            value={filters.dateDepart || ''}
            onChangeText={(value) => handleFilterChange('dateDepart', value)}
            placeholder="Sélectionner une date"
          />
        </View>

        {/* Statut (uniquement si pas public) */}
        {!isPublic && (
          <View>
            <Text className="text-sm font-semibold text-foreground mb-2">
              Statut
            </Text>
            <Select
              options={[
                { value: '', label: 'Tous les statuts' },
                ...VOYAGE_STATUTS.map((status) => ({
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
          <View className="pt-4 border-t border-border">
            <View className="flex flex-row items-center justify-between">
              <Text className="text-sm font-medium text-foreground">
                {activeFiltersCount} filtre{activeFiltersCount > 1 ? 's' : ''} actif{activeFiltersCount > 1 ? 's' : ''}
              </Text>
              <Pressable
                onPress={clearFilters}
                className="active:opacity-70"
                accessibilityRole="button"
                accessibilityLabel="Effacer tous les filtres"
              >
                <Text className="text-sm text-red-600 font-medium">
                  Tout effacer
                </Text>
              </Pressable>
            </View>
          </View>
        )}
      </View>
    </View>
  );
}