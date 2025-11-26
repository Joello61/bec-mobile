import React from 'react';
import { View, Text, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Calendar,
  Weight,
  DollarSign,
  Eye,
  Plane,
  ArrowRight,
} from 'lucide-react-native';
import { formatDateRelative, formatFullName } from '@/lib/utils/format';
import type { Proposition } from '@/types';
import AvatarWithButton from '../ui/AvatarWithButton';
import CurrencyDisplay from '../common/CurrencyDisplay';
import { PropositionStatusBadge } from './PropositionStatusBadge';

interface PropositionCardProps {
  proposition: Proposition;
  viewMode: 'sent' | 'received';
  onAccept?: (id: number) => void;
  onRefuse?: (id: number) => void;
  onViewVoyageDetails?: (idVoyage: number) => void;
  onViewPropositionDetails?: (idProposition: number) => void;
  index?: number;
}

export default function PropositionCard({
  proposition,
  viewMode,
  onAccept,
  onRefuse,
  onViewVoyageDetails,
  onViewPropositionDetails,
  index = 0,
}: PropositionCardProps) {
  const isReceived = viewMode === 'received';
  const isPending = proposition.statut === 'en_attente';
  const otherUser = isReceived ? proposition.client : proposition.voyageur;

  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify()}
      className="bg-white dark:bg-gray-900 rounded-xl border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      {/* Header Compact */}
      <View className="px-4 py-3 border-b border-gray-100 dark:border-gray-800">
        <View className="flex-row items-center justify-between gap-3 mb-3">
          <View className="flex-row items-center gap-2.5 flex-1">
            <AvatarWithButton
              src={otherUser.photo}
              alt={`${otherUser.prenom} ${otherUser.nom}`}
              fallback={`${otherUser.prenom} ${otherUser.nom}`}
              size="md"
              buttonType="info"
            />
            <View className="flex-1">
              <Text
                className="font-semibold text-sm text-gray-900 dark:text-white"
                numberOfLines={1}
              >
                {formatFullName(otherUser.nom, otherUser.prenom)}
              </Text>
              <Text className="text-xs text-gray-500 dark:text-gray-400">
                {isReceived ? 'Reçue' : 'Envoyée'}
              </Text>
            </View>
          </View>
          <PropositionStatusBadge statut={proposition.statut} />
        </View>

        {/* Itinéraire */}
        <View className="flex-row items-center gap-2">
          <View className="flex-1">
            <Text
              className="text-sm font-bold text-gray-900 dark:text-white"
              numberOfLines={1}
            >
              {proposition.voyage.villeDepart}
            </Text>
          </View>

          <View className="w-7 h-7 rounded-full bg-primary/10 dark:bg-primary/20 items-center justify-center">
            <Plane
              size={14}
              className="text-primary"
              style={{ transform: [{ rotate: '45deg' }] }}
            />
          </View>

          <View className="flex-1 items-end">
            <Text
              className="text-sm font-bold text-gray-900 dark:text-white text-right"
              numberOfLines={1}
            >
              {proposition.voyage.villeArrivee}
            </Text>
          </View>
        </View>
      </View>

      {/* Body */}
      <View className="px-4 py-3 space-y-2.5">
        {/* Date */}
        <View className="flex-row items-center gap-2">
          <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
          <Text className="text-xs text-gray-600 dark:text-gray-400">
            {new Date(proposition.voyage.dateDepart).toLocaleDateString('fr-FR', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })}
          </Text>
        </View>

        {/* Prix & Poids */}
        <View className="flex-row gap-2">
          {/* Poids */}
          <View className="flex-1 p-2.5 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
            <View className="flex-row items-center gap-1.5 mb-1">
              <Weight size={14} className="text-primary" />
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                Poids
              </Text>
            </View>
            <Text className="text-sm font-semibold text-primary">
              {proposition.demande.poidsEstime} kg
            </Text>
          </View>

          {/* Prix/kg */}
          <View className="flex-1 p-2.5 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
            <View className="flex-row items-center gap-1.5 mb-1">
              <DollarSign size={14} className="text-primary" />
              <Text className="text-xs text-gray-600 dark:text-gray-400">
                Prix/kg
              </Text>
            </View>
            <CurrencyDisplay
              amount={proposition.prixParKilo}
              currency={proposition.currency}
              converted={proposition.converted}
              viewerCurrency={proposition.viewerCurrency}
              field="prixParKilo"
              className="text-sm font-semibold text-primary"
            />
          </View>
        </View>

        {/* Commission */}
        <View className="p-2.5 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
          <View className="flex-row items-center justify-between">
            <Text className="text-xs text-gray-600 dark:text-gray-400">
              Commission
            </Text>
            <CurrencyDisplay
              amount={proposition.commissionProposeePourUnBagage}
              currency={proposition.currency}
              converted={proposition.converted}
              viewerCurrency={proposition.viewerCurrency}
              field="commission"
              className="text-sm font-semibold text-primary"
            />
          </View>
        </View>
      </View>

      {/* Footer */}
      <View className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
        <View className="flex-row items-center justify-between gap-2 mb-2">
          <Text className="text-xs text-gray-500 dark:text-gray-400">
            {formatDateRelative(proposition.createdAt)}
          </Text>
        </View>

        {/* Actions */}
        <View className="space-y-2">
          {/* Bouton Détails */}
          <Pressable
            onPress={() => onViewPropositionDetails?.(proposition.id)}
            className="flex-row items-center justify-center gap-2 px-3 py-2 border border-primary/30 rounded-lg active:bg-primary/10"
          >
            <Text className="text-sm font-medium text-primary">Détails</Text>
            <Eye size={16} className="text-primary" />
          </Pressable>

          {/* Actions conditionnelles */}
          {isPending && isReceived ? (
            <View className="flex-row gap-2">
              <Pressable
                onPress={() => onRefuse?.(proposition.id)}
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
              >
                <Text className="text-sm font-medium text-gray-700 dark:text-gray-300 text-center">
                  Refuser
                </Text>
              </Pressable>

              <Pressable
                onPress={() => onAccept?.(proposition.id)}
                className="flex-1 px-3 py-2 bg-primary rounded-lg active:bg-primary-dark"
              >
                <Text className="text-sm font-medium text-white text-center">
                  Accepter
                </Text>
              </Pressable>
            </View>
          ) : (
            <Pressable
              onPress={() => onViewVoyageDetails?.(proposition.voyage.id)}
              className="flex-row items-center justify-center gap-2 px-3 py-2 border border-primary/30 rounded-lg active:bg-primary/10"
            >
              <Text className="text-sm font-medium text-primary">
                Voir le voyage
              </Text>
              <ArrowRight size={16} className="text-primary" />
            </Pressable>
          )}
        </View>
      </View>
    </Animated.View>
  );
}