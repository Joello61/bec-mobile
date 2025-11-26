import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  totalItems?: number;
  itemsPerPage?: number;
  itemLabel?: string; 
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange,
  totalItems,
  itemsPerPage = 10,
  itemLabel = "élément"
}: PaginationProps) {
  
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 3; // Mobile optimisé

    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage > 2) {
        pages.push(1);
        pages.push('...');
      } else {
        pages.push(1);
      }
      
      if (currentPage !== 1 && currentPage !== totalPages) {
        pages.push(currentPage);
      }
      
      if (currentPage < totalPages - 1) {
        pages.push('...');
      }
      
      pages.push(totalPages);
    }

    return pages;
  };

  const getItemsRange = () => {
    if (!totalItems) return null;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(currentPage * itemsPerPage, totalItems);
    return { start, end };
  };

  const range = getItemsRange();
  const pluralLabel = totalItems && totalItems > 1 ? `${itemLabel}s` : itemLabel;

  if (totalPages <= 1) return null;

  return (
    <View className="flex flex-col items-center gap-4 py-4">
      {/* Informations sur les éléments affichés */}
      {range && (
        <Text className="text-sm text-muted">
          <Text className="font-medium">{range.start}-{range.end}</Text>
          {' '}sur{' '}
          <Text className="font-medium">{totalItems}</Text>
        </Text>
      )}

      {/* Navigation pagination */}
      <View className="flex flex-row items-center justify-between w-full px-4 gap-2">
        {/* Bouton précédent */}
        <Pressable
          onPress={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className={cn(
            'p-2.5 rounded-lg border border-border active:opacity-70',
            currentPage === 1 && 'opacity-50'
          )}
          accessibilityLabel="Page précédente"
          accessibilityRole="button"
        >
          <ChevronLeft size={20} className="text-foreground" />
        </Pressable>

        {/* Numéros de page */}
        <View className="flex flex-row items-center gap-1 flex-1 justify-center max-w-[200px]">
          {getPageNumbers().map((page, index) =>
            typeof page === 'number' ? (
              <Pressable
                key={index}
                onPress={() => onPageChange(page)}
                className={cn(
                  'min-w-[36px] h-9 px-2 rounded-lg items-center justify-center active:opacity-70',
                  page === currentPage
                    ? 'bg-primary'
                    : 'border border-border'
                )}
                accessibilityRole="button"
                accessibilityLabel={`Page ${page}`}
              >
                <Text
                  className={cn(
                    'text-sm font-medium',
                    page === currentPage ? 'text-white' : 'text-foreground'
                  )}
                >
                  {page}
                </Text>
              </Pressable>
            ) : (
              <Text key={index} className="px-1 text-muted text-sm">
                {page}
              </Text>
            )
          )}
        </View>

        {/* Bouton suivant */}
        <Pressable
          onPress={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className={cn(
            'p-2.5 rounded-lg border border-border active:opacity-70',
            currentPage === totalPages && 'opacity-50'
          )}
          accessibilityLabel="Page suivante"
          accessibilityRole="button"
        >
          <ChevronRight size={20} className="text-foreground" />
        </Pressable>
      </View>
    </View>
  );
}