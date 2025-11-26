import React from 'react';
import { View, FlatList } from 'react-native';
import { Package } from 'lucide-react-native';
import DemandeCard from './DemandeCard';
import type { Demande, PaginationMeta } from '@/types';
import { DemandeCardSkeleton } from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';
import Pagination from '../common/Pagination';

interface DemandeListProps {
  demandes: Demande[];
  pagination?: PaginationMeta | null;
  onPageChange?: (page: number) => void;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

export default function DemandeList({ 
  demandes, 
  pagination, 
  onPageChange,
  isLoading = false,
  onRefresh,
  isRefreshing = false
}: DemandeListProps) {
  // ==================== LOADING STATE (First Load) ====================
  if (isLoading) {
    return (
      <View className="gap-4">
        {[...Array(6)].map((_, i) => (
          <DemandeCardSkeleton key={i} />
        ))}
      </View>
    );
  }

  // ==================== EMPTY STATE ====================
  if (demandes.length === 0) {
    return (
      <EmptyState
        icon={<Package size={48} className="text-accent dark:text-accent-light" />}
        title="Aucune demande trouvée"
        description="Essayez de modifier vos critères de recherche"
      />
    );
  }

  // ==================== LISTE DES DEMANDES ====================
  return (
    <View className="flex-1">
      <FlatList
        data={demandes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => <DemandeCard demande={item} />}
        contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
        showsVerticalScrollIndicator={false}
        onRefresh={onRefresh}
        refreshing={isRefreshing}
        ListFooterComponent={
          <>
            {/* Pagination */}
            {pagination && pagination.pages > 1 && onPageChange && (
              <View className="mt-8">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={onPageChange}
                  totalItems={pagination.total}
                  itemsPerPage={pagination.limit}
                  itemLabel="demande"
                />
              </View>
            )}
          </>
        }
      />
    </View>
  );
}