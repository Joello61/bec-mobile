import React, { useState } from 'react';
import { View, Text, FlatList, Pressable, ScrollView } from 'react-native';
import { Package } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';
import type { Proposition } from '@/types';
import LoadingSkeleton from '../common/LoadingSkeleton';
import ErrorState from '../common/ErrorState';
import EmptyState from '../common/EmptyState';
import PropositionCard from './PropositionCard';

interface PropositionListProps {
  propositions: Proposition[];
  viewMode: 'sent' | 'received';
  isLoading?: boolean;
  error?: string | null;
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewVoyageDetails?: (idVoyage: number) => void;
  onViewPropositionDetails?: (idProposition: number) => void;
  onRetry?: () => void;
}

type FilterType = 'all' | 'en_attente' | 'acceptee' | 'refusee' | 'annulee';

export default function PropositionList({
  propositions,
  viewMode,
  isLoading,
  error,
  onAccept,
  onRefuse,
  onViewVoyageDetails,
  onViewPropositionDetails,
  onRetry,
}: PropositionListProps) {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredPropositions =
    filter === 'all'
      ? propositions
      : propositions.filter((p) => p.statut === filter);

  // Calculer les compteurs
  const counts = {
    all: propositions.length,
    en_attente: propositions.filter((p) => p.statut === 'en_attente').length,
    acceptee: propositions.filter((p) => p.statut === 'acceptee').length,
    refusee: propositions.filter((p) => p.statut === 'refusee').length,
    annulee: propositions.filter((p) => p.statut === 'annulee').length,
  };

  const filters: { id: FilterType; label: string; color: string }[] = [
    { id: 'all', label: 'Toutes', color: 'primary' },
    { id: 'en_attente', label: 'En attente', color: 'warning' },
    { id: 'acceptee', label: 'Acceptées', color: 'success' },
    { id: 'refusee', label: 'Refusées', color: 'error' },
    { id: 'annulee', label: 'Annulées', color: 'gray' },
  ];

  // États de chargement et erreur
  if (isLoading) {
    return (
      <View className="flex-1 p-4 space-y-4">
        <LoadingSkeleton count={3} height={200} />
      </View>
    );
  }

  if (error) {
    return <ErrorState message={error} onRetry={onRetry} />;
  }

  if (propositions.length === 0) {
    return (
      <EmptyState
        icon={<Package size={48} className="text-gray-400 dark:text-gray-600" />}
        title={
          viewMode === 'sent'
            ? 'Aucune proposition envoyée'
            : 'Aucune proposition reçue'
        }
        description={
          viewMode === 'sent'
            ? "Vous n'avez pas encore fait de proposition sur un voyage"
            : "Vous n'avez pas encore reçu de proposition"
        }
      />
    );
  }

  // Header avec filtres
  const ListHeader = () => (
    <View className="mb-4">
      {/* Filtres Pills Horizontaux */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {filters.map((f) => {
          const isActive = filter === f.id;
          return (
            <Pressable
              key={f.id}
              onPress={() => setFilter(f.id)}
              className={cn(
                'px-4 py-2 rounded-lg',
                isActive
                  ? cn(
                      'shadow-sm',
                      f.color === 'primary' && 'bg-primary',
                      f.color === 'warning' && 'bg-amber-500',
                      f.color === 'success' && 'bg-green-600',
                      f.color === 'error' && 'bg-red-600',
                      f.color === 'gray' && 'bg-gray-500'
                    )
                  : 'bg-gray-100 dark:bg-gray-800'
              )}
            >
              <Text
                className={cn(
                  'text-sm font-medium',
                  isActive
                    ? 'text-white'
                    : 'text-gray-700 dark:text-gray-300'
                )}
              >
                {f.label} ({counts[f.id]})
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );

  // État vide pour filtre
  if (filteredPropositions.length === 0) {
    return (
      <View className="flex-1">
        <ListHeader />
        <EmptyState
          title="Aucune proposition dans cette catégorie"
          description="Changez de filtre pour voir d'autres propositions"
          action={{
            label: 'Voir toutes',
            onPress: () => setFilter('all'),
          }}
        />
      </View>
    );
  }

  return (
    <FlatList
      data={filteredPropositions}
      keyExtractor={(item) => item.id.toString()}
      renderItem={({ item, index }) => (
        <View className="px-4 mb-4">
          <PropositionCard
            proposition={item}
            viewMode={viewMode}
            onAccept={onAccept}
            onRefuse={onRefuse}
            onViewVoyageDetails={onViewVoyageDetails}
            onViewPropositionDetails={onViewPropositionDetails}
            index={index}
          />
        </View>
      )}
      ListHeaderComponent={ListHeader}
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 16,
      }}
      className="flex-1 bg-white dark:bg-gray-900"
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={5}
      updateCellsBatchingPeriod={50}
      initialNumToRender={5}
      windowSize={5}
    />
  );
}