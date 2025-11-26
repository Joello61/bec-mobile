import React from 'react';
import { View, Text } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Flag, Clock, CheckCircle, XCircle } from 'lucide-react-native';
import type { Signalement, SignalementStatut } from '@/types';
import { formatDate } from '@/lib/utils/format';
import { Card } from '../ui/Card';
import Badge from '../ui/Badge';

interface SignalementCardProps {
  signalement: Signalement;
  index?: number;
}

export default function SignalementCard({ signalement, index = 0 }: SignalementCardProps) {
  const getStatutConfig = () => {
    const configs: Record<
      SignalementStatut,
      {
        variant: 'success' | 'warning' | 'error';
        label: string;
        icon: typeof Clock;
        bgClass: string;
        textClass: string;
      }
    > = {
      en_attente: {
        variant: 'warning',
        label: 'En attente',
        icon: Clock,
        bgClass: 'bg-amber-100 dark:bg-amber-900/20',
        textClass: 'text-amber-700 dark:text-amber-400',
      },
      traite: {
        variant: 'success',
        label: 'Traité',
        icon: CheckCircle,
        bgClass: 'bg-green-100 dark:bg-green-900/20',
        textClass: 'text-green-700 dark:text-green-400',
      },
      rejete: {
        variant: 'error',
        label: 'Rejeté',
        icon: XCircle,
        bgClass: 'bg-red-100 dark:bg-red-900/20',
        textClass: 'text-red-700 dark:text-red-400',
      },
    };
    return configs[signalement.statut];
  };

  const getMotifLabel = () => {
    const motifs = {
      contenu_inapproprie: 'Contenu inapproprié',
      spam: 'Spam ou publicité',
      arnaque: 'Arnaque ou fraude',
      objet_illegal: 'Objet illégal',
      autre: 'Autre',
    };
    return motifs[signalement.motif];
  };

  const getEntityInfo = () => {
    if (signalement.voyage) {
      return {
        type: 'Voyage',
        info: `${signalement.voyage.villeDepart} vers ${signalement.voyage.villeArrivee}`,
        colorClass: 'text-primary',
      };
    }
    if (signalement.demande) {
      return {
        type: 'Demande',
        info: `${signalement.demande.villeDepart} vers ${signalement.demande.villeArrivee}`,
        colorClass: 'text-orange-600 dark:text-orange-400',
      };
    }
    if (signalement.message) {
      return {
        type: 'Message',
        info: 'Message de conversation',
        colorClass: 'text-blue-600 dark:text-blue-400',
      };
    }
    if (signalement.utilisateurSignale) {
      return {
        type: 'Utilisateur',
        info: `${signalement.utilisateurSignale.prenom} ${signalement.utilisateurSignale.nom}`,
        colorClass: 'text-purple-600 dark:text-purple-400',
      };
    }
    return {
      type: 'Inconnu',
      info: '',
      colorClass: 'text-gray-600 dark:text-gray-400',
    };
  };

  const statutConfig = getStatutConfig();
  const StatutIcon = statutConfig.icon;
  const entity = getEntityInfo();

  return (
    <Animated.View entering={FadeInDown.delay(index * 50).springify()}>
      <Card className="overflow-hidden">
        {/* Content */}
        <View className="p-4">
          {/* Header avec type d'entité et statut */}
          <View className="flex-row items-start justify-between gap-4 mb-4">
            {/* Info de l'entité */}
            <View className="flex-1">
              {/* Type */}
              <View className="flex-row items-center gap-2 mb-2">
                <Badge variant="neutral" size="sm">
                  {entity.type}
                </Badge>
                <Text
                  className={`text-sm font-medium flex-1 ${entity.colorClass}`}
                  numberOfLines={1}
                >
                  {entity.info}
                </Text>
              </View>

              {/* Motif */}
              <View className="flex-row items-center gap-2">
                <Flag size={16} className="text-gray-400 dark:text-gray-500" />
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  {getMotifLabel()}
                </Text>
              </View>
            </View>

            {/* Badge de statut */}
            <View className={`flex-row items-center gap-1.5 px-3 py-1 rounded-full ${statutConfig.bgClass}`}>
              <StatutIcon size={14} className={statutConfig.textClass} />
              <Text className={`text-xs font-medium ${statutConfig.textClass}`}>
                {statutConfig.label}
              </Text>
            </View>
          </View>

          {/* Description */}
          <Text
            className="text-sm text-gray-600 dark:text-gray-400 mb-4 leading-5"
            numberOfLines={3}
          >
            {signalement.description}
          </Text>

          {/* Réponse admin si existe */}
          {signalement.reponseAdmin && (
            <View className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-3">
              <View className="flex-row items-start gap-2">
                <CheckCircle
                  size={16}
                  className="text-blue-600 dark:text-blue-400 mt-0.5"
                />
                <View className="flex-1">
                  <Text className="text-xs font-semibold text-blue-900 dark:text-blue-200 mb-1">
                    Réponse de l'équipe Co-Bage :
                  </Text>
                  <Text className="text-sm text-blue-800 dark:text-blue-300 leading-5">
                    {signalement.reponseAdmin}
                  </Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Footer avec dates */}
        <View className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-500 dark:text-gray-400">
              Signalé le {formatDate(signalement.createdAt)}
            </Text>
            {signalement.updatedAt !== signalement.createdAt && (
              <Text className="text-xs text-gray-400 dark:text-gray-500">
                Mis à jour le {formatDate(signalement.updatedAt)}
              </Text>
            )}
          </View>
        </View>
      </Card>
    </Animated.View>
  );
}