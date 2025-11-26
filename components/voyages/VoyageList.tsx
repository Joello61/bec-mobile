import React from 'react';
import { View, Text, FlatList } from 'react-native';
import { Plane } from 'lucide-react-native';
import VoyageCard from './VoyageCard';
import Pagination from '@/components/common/Pagination';
import type { Voyage, PaginationMeta } from '@/types';
import LoadingSkeleton from '../common/LoadingSkeleton';

interface VoyageListProps {
  voyages: Voyage[];
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
}

// Skeleton pour un voyage card
const VoyageCardSkeleton = () => (
  <View className="bg-surface rounded-lg overflow-hidden mb-4 mx-4">
    {/* Header */}
    <View className="bg-gray-100 px-4 py-3">
      <View className="flex flex-row items-center gap-2 mb-3">
        <LoadingSkeleton width={36} height={36} className="rounded-lg" />
        <View className="flex-1 gap-1">
          <LoadingSkeleton width={80} height={12} />
          <LoadingSkeleton width={96} height={16} />
        </View>
      </View>
      <View className="flex flex-row items-center gap-2">
        <LoadingSkeleton className="flex-1" height={16} />
        <LoadingSkeleton width={32} height={32} className="rounded-full" />
        <LoadingSkeleton className="flex-1" height={16} />
      </View>
    </View>

    {/* Body */}
    <View className="px-4 py-3.5 gap-2.5">
      <View className="flex flex-row justify-between">
        <LoadingSkeleton width={96} height={16} />
        <LoadingSkeleton width={64} height={20} />
      </View>
      <View className="flex flex-row items-center gap-2 pt-2">
        <LoadingSkeleton width={28} height={28} className="rounded-full" />
        <LoadingSkeleton className="flex-1" height={16} />
      </View>
    </View>
  </View>
);

// Composant Empty State
const EmptyState = () => (
  <View className="items-center justify-center py-16 px-4">
    <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
      <Plane size={40} className="text-primary" />
    </View>
    <Text className="text-lg font-semibold text-foreground mb-2 text-center">
      Aucun voyage trouvé
    </Text>
    <Text className="text-base text-muted text-center">
      Essayez de modifier vos critères de recherche
    </Text>
  </View>
);

// Composant Loading State
const LoadingState = () => (
  <View>
    {[...Array(6)].map((_, i) => (
      <VoyageCardSkeleton key={i} />
    ))}
  </View>
);

export default function VoyageList({ 
  voyages, 
  pagination, 
  onPageChange,
  isLoading = false 
}: VoyageListProps) {
  
  // ==================== RENDER ITEM ====================
  const renderItem = ({ item }: { item: Voyage }) => (
    <View className="px-4 mb-4">
      <VoyageCard voyage={item} />
    </View>
  );

  // ==================== KEY EXTRACTOR ====================
  const keyExtractor = (item: Voyage) => item.id.toString();

  // ==================== FOOTER (Pagination) ====================
  const renderFooter = () => {
    if (!pagination || pagination.pages <= 1 || !onPageChange) {
      return null;
    }

    return (
      <View className="py-4">
        <Pagination
          currentPage={pagination.page}
          totalPages={pagination.pages}
          onPageChange={onPageChange}
          totalItems={pagination.total}
          itemsPerPage={pagination.limit}
          itemLabel="voyage"
        />
      </View>
    );
  };

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return <LoadingState />;
  }

  // ==================== EMPTY STATE ====================
  if (voyages.length === 0) {
    return <EmptyState />;
  }

  // ==================== LISTE DES VOYAGES ====================
  return (
    <FlatList
      data={voyages}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{
        paddingTop: 16,
        paddingBottom: 16,
      }}
      ListFooterComponent={renderFooter}
      // Performance optimizations
      removeClippedSubviews={true}
      maxToRenderPerBatch={10}
      updateCellsBatchingPeriod={50}
      initialNumToRender={10}
      windowSize={10}
    />
  );
}