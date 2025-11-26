import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { ArrowRight } from 'lucide-react-native';
import StarRating from './StarRating';
import { formatDateRelative } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { Avis } from '@/types';
import { Card, CardContent } from '../ui/Card';
import Avatar from '../ui/Avatar';

interface AvisCardProps {
  avis: Avis;
}

export default function AvisCard({ avis }: AvisCardProps) {
  const router = useRouter();

  const handleAuthorPress = () => {
  router.push({
    pathname: "/(protected)/user/[id]",
    params: { id: avis.auteur.id.toString() },
  });
};

  const handleVoyagePress = () => {
    if (avis.voyage) {
      router.push({
        pathname: "/(protected)/voyages/[id]",
        params: { id: avis.voyage.id.toString() }
      })
    }
  };

  return (
    <Card>
      <CardContent className="p-5">
        {/* Header */}
        <View className="flex-row items-start justify-between mb-3">
          <Pressable
            onPress={handleAuthorPress}
            className="flex-row items-center gap-3 flex-1 active:opacity-70"
            accessibilityRole="button"
            accessibilityLabel={`Voir le profil de ${avis.auteur.prenom} ${avis.auteur.nom}`}
          >
            <Avatar
              src={avis.auteur.photo || undefined}
              fallback={`${avis.auteur.nom} ${avis.auteur.prenom}`}
              size="md"
              verified={avis.auteur.emailVerifie}
            />
            <View className="flex-1">
              <Text className="font-medium text-gray-900 dark:text-gray-100">
                {avis.auteur.prenom} {avis.auteur.nom}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {formatDateRelative(avis.createdAt)}
              </Text>
            </View>
          </Pressable>

          <StarRating rating={avis.note} size="sm" />
        </View>

        {/* Comment */}
        {avis.commentaire && (
          <Text className="text-gray-700 dark:text-gray-300 mt-3 leading-relaxed">
            {avis.commentaire}
          </Text>
        )}

        {/* Voyage Link */}
        {avis.voyage && (
          <Pressable
            onPress={handleVoyagePress}
            className="mt-3 flex-row items-center active:opacity-70"
            accessibilityRole="link"
            accessibilityLabel="Voir le voyage associé"
          >
            <Text className="text-sm text-primary dark:text-primary-light">
              Voir le voyage
            </Text>
            <ArrowRight 
              size={16} 
              className="ml-1 text-primary dark:text-primary-light" 
            />
          </Pressable>
        )}
      </CardContent>
    </Card>
  );
}