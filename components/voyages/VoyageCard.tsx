import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { Link, usePathname } from 'expo-router';
import { Calendar, Package, Eye, Plane, Verified } from 'lucide-react-native';
import Animated, { FadeInDown, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { formatDateShort, formatWeight } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Voyage } from '@/types';
import { Card } from '../ui/Card';
import PriceDisplay from '../common/PriceDisplay';
import AvatarWithButton from '../ui/AvatarWithButton';
import FavoriteButton from '../favoris/FavoriteButton';
import ShowProfileModal from '../user/ShowProfileModal';

interface VoyageCardProps {
  voyage: Voyage;
  index?: number;
}

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

export default function VoyageCard({ voyage, index = 0 }: VoyageCardProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [isPressed, setIsPressed] = useState(false);

  const isOwner = user?.id === voyage.voyageur.id;
  const isFavorite = isFavoriVoyage(voyage.id);

  // Détermine le lien selon le contexte
  const link = pathname?.includes('mes-voyages')
    ? ROUTES.MES_VOYAGE_DETAILS(voyage.id)
    : ROUTES.VOYAGE_DETAILS(voyage.id);

  const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFavori(voyage.id, 'voyage');
    } else {
      await addVoyageToFavoris(voyage.id);
    }
  };

  // Animation au pressage
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      {
        scale: withTiming(isPressed ? 0.98 : 1, { duration: 150 }),
      },
    ],
  }));

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 100).springify()}
      style={animatedStyle}
    >
      <Link href={link} asChild>
        <AnimatedPressable
          onPressIn={() => setIsPressed(true)}
          onPressOut={() => setIsPressed(false)}
          className="relative"
        >
          {/* Bouton Favoris en overlay */}
          {user && !isOwner && (
            <View className="absolute top-3 right-3 z-10">
              <View className="w-9 h-9 rounded-full bg-white/95 dark:bg-gray-800/95 shadow-md items-center justify-center">
                <FavoriteButton
                  isFavorite={isFavorite}
                  onToggle={handleToggleFavorite}
                  size="sm"
                />
              </View>
            </View>
          )}

          <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
            {/* Header avec gradient */}
            <View className="bg-primary/5 dark:bg-primary/10 px-4 py-3 rounded-t-2xl">
              {/* Date de départ */}
              <View className="flex-row items-center gap-2 mb-3">
                <View className="w-9 h-9 rounded-lg bg-primary/10 dark:bg-primary/20 items-center justify-center">
                  <Calendar size={18} className="text-primary" />
                </View>
                <View>
                  <Text className="text-xs text-gray-600 dark:text-gray-400">
                    Départ le
                  </Text>
                  <Text className="text-base font-bold text-gray-900 dark:text-white">
                    {formatDateShort(voyage.dateDepart)}
                  </Text>
                </View>
              </View>

              {/* Itinéraire horizontal */}
              <View className="flex-row items-center gap-2">
                {/* Ville de départ */}
                <View className="flex-1">
                  <Text
                    className="text-base font-bold text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {voyage.villeDepart}
                  </Text>
                </View>

                {/* Icône avion */}
                <View className="w-8 h-8 rounded-full bg-white/60 dark:bg-gray-800/60 items-center justify-center">
                  <Plane
                    size={18}
                    className="text-primary"
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>

                {/* Ville d'arrivée */}
                <View className="flex-1 items-end">
                  <Text
                    className="text-base font-bold text-gray-900 dark:text-white text-right"
                    numberOfLines={1}
                  >
                    {voyage.villeArrivee}
                  </Text>
                </View>
              </View>
            </View>

            {/* Body - Infos essentielles */}
            <View className="px-4 py-3.5 space-y-2.5">
              {/* Poids et Prix */}
              <View className="flex-row items-center justify-between gap-3">
                {/* Poids disponible */}
                <View className="flex-row items-center gap-2">
                  <Package size={18} className="text-gray-600 dark:text-gray-400" />
                  <View className="flex-row items-baseline gap-1">
                    <Text className="text-sm font-bold text-gray-900 dark:text-white">
                      {formatWeight(voyage.poidsDisponible)}
                    </Text>
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      dispo
                    </Text>
                  </View>
                </View>

                {/* Prix */}
                <PriceDisplay
                  prixParKilo={voyage.prixParKilo}
                  commission={null}
                  currency={voyage.currency}
                  converted={voyage.converted}
                  viewerCurrency={voyage.viewerCurrency}
                  compact={true}
                />
              </View>

              {/* Footer - Voyageur + CTA */}
              <View className="flex-row items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-800">
                {/* Avatar */}
                <View className="w-7 h-7">
                  <AvatarWithButton
                    src={voyage.voyageur.photo}
                    alt={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                    fallback={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
                    size="sm"
                    buttonType="info"
                    onButtonClick={() => {
                        setShowProfileModal(true);
                    }}
                    />

                </View>

                {/* Nom voyageur */}
                <View className="flex-row items-center gap-1.5 flex-1">
                  <Text
                    className="text-sm text-gray-700 dark:text-gray-300"
                    numberOfLines={1}
                  >
                    {voyage.voyageur.prenom} {voyage.voyageur.nom[0]}.
                  </Text>
                  {voyage.voyageur.emailVerifie && (
                    <Verified size={14} className="text-primary" />
                  )}
                </View>

                {/* Bouton Voir */}
                <Pressable className="ml-auto flex-row items-center gap-1">
                  <Text className="text-sm font-medium text-primary">
                    Voir
                  </Text>
                  <Eye size={16} className="text-primary" />
                </Pressable>
              </View>
            </View>
          </Card>
        </AnimatedPressable>
      </Link>

      {/* Modal de profil */}
      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={voyage.voyageur}
      />
    </Animated.View>
  );
}