import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter, usePathname } from 'expo-router';
import { Package, Clock, Plane, MapPin, Eye, Verified } from 'lucide-react-native';
import { formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Demande } from '@/types';
import { cn } from '@/lib/utils/cn';
import { Card, CardContent } from '../ui/Card';
import PriceDisplay from '../common/PriceDisplay';
import AvatarWithButton from '../ui/AvatarWithButton';
import FavoriteButton from '../favoris/FavoriteButton';
import ShowProfileModal from '../user/ShowProfileModal';

interface DemandeCardProps {
  demande: Demande;
  variant?: 'default' | 'compact';
}

export default function DemandeCard({ demande, variant = 'default' }: DemandeCardProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { user } = useAuth();
  const { addDemandeToFavoris, removeFavori, isFavoriDemande } = useFavoriActions();
  const [showProfileModal, setShowProfileModal] = useState(false);

  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;
  const isOwner = user?.id === demande.client.id;
  const isFavorite = isFavoriDemande(demande.id);
  const isUrgent = daysRemaining !== null && daysRemaining < 3 && daysRemaining >= 0;
  const isExpired = daysRemaining !== null && daysRemaining < 0;

const handleToggleFavorite = async () => {
    if (isFavorite) {
      await removeFavori(demande.id, 'demande');
    } else {
      await addDemandeToFavoris(demande.id);
    }
  };

  const handlePress = () => {
    router.push({
      pathname: "/(protected)/demandes/[id]",
      params: { id: demande.id.toString() }
    });
  };

  return (
    <Pressable
      onPress={handlePress}
      className="active:opacity-70"
      accessibilityRole="button"
      accessibilityLabel={`Demande de transport de ${demande.villeDepart} à ${demande.villeArrivee}`}
    >
      <View className="relative">
        {/* Bouton Favoris - Overlay */}
        {user && !isOwner && (
          <View className="absolute top-3 right-3 z-10">
            <View className="w-9 h-9 rounded-full bg-white dark:bg-gray-800 shadow-lg flex items-center justify-center">
              <FavoriteButton
                isFavorite={isFavorite}
                onToggle={handleToggleFavorite}
                size="sm"
              />
            </View>
          </View>
        )}

        <Card className="overflow-hidden border border-gray-200 dark:border-gray-700">
          <CardContent className="p-0">
            {/* Header avec date limite et urgence */}
            <View
              className={cn(
                'px-4 py-3',
                isUrgent
                  ? 'bg-red-50 dark:bg-red-900/20'
                  : 'bg-accent/5 dark:bg-accent/10'
              )}
            >
              {/* Date limite */}
              {demande.dateLimite && (
                <View className="flex-row items-center gap-2 mb-3">
                  <View
                    className={cn(
                      'w-9 h-9 rounded-lg flex items-center justify-center',
                      isUrgent
                        ? 'bg-red-100 dark:bg-red-900/40'
                        : 'bg-accent/10 dark:bg-accent/20'
                    )}
                  >
                    <Clock
                      size={18}
                      className={cn(
                        isUrgent
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-accent dark:text-accent-light'
                      )}
                    />
                  </View>
                  <View className="flex-1">
                    <Text
                      className={cn(
                        'text-xs',
                        isUrgent
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      {isExpired ? 'Expiré' : 'Date limite'}
                    </Text>
                    <Text
                      className={cn(
                        'text-base font-bold',
                        isUrgent
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-gray-100'
                      )}
                      numberOfLines={1}
                    >
                      {!isExpired && daysRemaining !== null
                        ? `${daysRemaining} jour${daysRemaining > 1 ? 's' : ''} restant${daysRemaining > 1 ? 's' : ''}`
                        : 'Terminé'}
                    </Text>
                  </View>
                </View>
              )}

              {/* Itinéraire horizontal */}
              <View className="flex-row items-center gap-2">
                <View className="flex-1 min-w-0">
                  <Text
                    className="text-base font-bold text-gray-900 dark:text-gray-100"
                    numberOfLines={1}
                  >
                    {demande.villeDepart}
                  </Text>
                </View>

                <View className="w-8 h-8 rounded-full bg-white/60 dark:bg-gray-800/60 flex items-center justify-center">
                  <Plane
                    size={18}
                    className="text-primary dark:text-primary-light"
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>

                <View className="flex-1 min-w-0 items-end">
                  <Text
                    className="text-base font-bold text-gray-900 dark:text-gray-100"
                    numberOfLines={1}
                  >
                    {demande.villeArrivee}
                  </Text>
                </View>
              </View>
            </View>

            {/* Body - Infos essentielles */}
            <View className="px-4 py-3.5 gap-2.5">
              {/* Poids et Prix */}
              <View className="flex-row items-center justify-between gap-3">
                <View className="flex-row items-center gap-2 flex-1">
                  <Package size={18} className="text-gray-600 dark:text-gray-400" />
                  <Text className="text-sm text-gray-700 dark:text-gray-300">
                    <Text className="font-bold text-gray-900 dark:text-gray-100">
                      {formatWeight(demande.poidsEstime)}
                    </Text>
                    <Text className="text-gray-500 dark:text-gray-400"> estimé</Text>
                  </Text>
                </View>

                <View>
                  <PriceDisplay
                    prixParKilo={demande.prixParKilo}
                    commission={null}
                    currency={demande.currency}
                    converted={demande.converted}
                    viewerCurrency={demande.viewerCurrency}
                    compact={true}
                  />
                </View>
              </View>

              {/* Client + Statut + CTA */}
              <View className="flex-row items-center gap-2.5 pt-2.5 border-t border-gray-100 dark:border-gray-700">
                {/* Avatar */}
                <View className="w-7 h-7">
                  <AvatarWithButton
                    src={demande.client.photo}
                    alt={`${demande.client.prenom} ${demande.client.nom}`}
                    fallback={`${demande.client.prenom} ${demande.client.nom}`}
                    size="sm"
                    buttonType="info"
                    onButtonClick={() => setShowProfileModal(true)}
                  />
                </View>

                {/* Nom client avec badge vérifié */}
                <View className="flex-row items-center gap-1.5 flex-1">
                  <Text
                    className="text-sm text-gray-700 dark:text-gray-300"
                    numberOfLines={1}
                  >
                    {demande.client.prenom} {demande.client.nom[0]}.
                  </Text>
                  {demande.client.emailVerifie && (
                    <Verified
                      size={14}
                      className="text-primary dark:text-primary-light"
                    />
                  )}
                </View>

                {/* CTA */}
                <Pressable
                  onPress={handlePress}
                  className="flex-row items-center gap-1 active:opacity-70"
                >
                  <Text className="text-sm font-medium text-primary dark:text-primary-light">
                    Voir
                  </Text>
                  <Eye size={16} className="text-primary dark:text-primary-light" />
                </Pressable>
              </View>
            </View>
          </CardContent>
        </Card>
      </View>

      {/* Modal profil utilisateur */}
      <ShowProfileModal
        isOpen={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        user={demande.client}
      />
    </Pressable>
  );
}