import React, { useState } from 'react';
import { View, Text, Pressable, FlatList } from 'react-native';
import Animated, { 
  Layout, 
  FadeIn 
} from 'react-native-reanimated';
import { Heart } from 'lucide-react-native';
import VoyageCard from '@/components/voyages/VoyageCard';
import DemandeCard from '@/components/demandes/DemandeCard';
import { cn } from '@/lib/utils/cn';
import type { Favori } from '@/types';
import LoadingSkeleton from '../common/LoadingSkeleton';
import EmptyState from '../common/EmptyState';

interface FavoritesListProps {
  favorisVoyages: Favori[];
  favorisDemandes: Favori[];
  onRemove: (id: number, type: 'voyage' | 'demande') => Promise<void>;
  isLoading?: boolean;
  onRefresh?: () => void;
  isRefreshing?: boolean;
}

type TabType = 'voyages' | 'demandes';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function FavoritesList({ 
  favorisVoyages, 
  favorisDemandes, 
  isLoading = false,
  onRefresh,
  isRefreshing = false,
}: FavoritesListProps) {
  const [activeTab, setActiveTab] = useState<TabType>('voyages');

  const tabs = [
    { id: 'voyages' as TabType, label: 'Voyages', count: favorisVoyages.length },
    { id: 'demandes' as TabType, label: 'Demandes', count: favorisDemandes.length },
  ];

  const currentItems = activeTab === 'voyages' ? favorisVoyages : favorisDemandes;

  // ==================== LOADING STATE ====================
  if (isLoading) {
    return (
      <View className="gap-4">
        <View className="flex-row gap-2 border-b border-gray-200 dark:border-gray-700 pb-2">
          {tabs.map((tab) => (
            <View key={tab.id} className="px-4 py-3">
              <LoadingSkeleton width={100} height={16} />
            </View>
          ))}
        </View>
        
        <View className="gap-4">
          {[...Array(4)].map((_, i) => (
            <View key={i} className="bg-white dark:bg-gray-800 rounded-2xl p-5">
              <LoadingSkeleton width="100%" height={180} />
            </View>
          ))}
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1">
      {/* Tabs Header */}
      <View className="flex-row gap-2 border-b border-gray-200 dark:border-gray-700 mb-4">
        {tabs.map((tab) => (
          <Pressable
            key={tab.id}
            onPress={() => setActiveTab(tab.id)}
            className={cn(
              'px-4 py-3 relative',
              'active:opacity-70'
            )}
            accessibilityRole="tab"
            accessibilityState={{ selected: activeTab === tab.id }}
          >
            <Text
              className={cn(
                'text-sm font-medium',
                activeTab === tab.id
                  ? 'text-primary dark:text-primary-light'
                  : 'text-gray-600 dark:text-gray-400'
              )}
            >
              {tab.label} ({tab.count})
            </Text>
            {activeTab === tab.id && (
              <Animated.View
                layout={Layout.springify()}
                entering={FadeIn}
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-primary-light"
              />
            )}
          </Pressable>
        ))}
      </View>

      {/* Content */}
      {currentItems.length === 0 ? (
        <EmptyState
          icon={<Heart size={48} className="text-gray-400 dark:text-gray-500" />}
          title="Aucun favori"
          description={`Commencez à ajouter des ${activeTab === 'voyages' ? 'voyages' : 'demandes'} à vos favoris`}
        />
      ) : (
        <FlatList
          data={currentItems}
          keyExtractor={(item) => `${activeTab}-${item.id}`}
          renderItem={({ item }) => {
            // ✅ On s'assure que les relations existent avant de rendre
            if (activeTab === 'voyages') {
              if (!item.voyage) return null;
              return (
                <Animated.View
                  entering={FadeIn.delay(100)}
                  layout={Layout.springify()}
                >
                  <VoyageCard voyage={item.voyage} />
                </Animated.View>
              );
            }
            if (activeTab === 'demandes') {
              if (!item.demande) return null;
              return (
                <Animated.View
                  entering={FadeIn.delay(100)}
                  layout={Layout.springify()}
                >
                  <DemandeCard demande={item.demande} />
                </Animated.View>
              );
            }
            return null;
          }}
          contentContainerStyle={{ paddingBottom: 24, gap: 16 }}
          showsVerticalScrollIndicator={false}
          onRefresh={onRefresh}
          refreshing={isRefreshing}
        />
      )}
    </View>
  );
}