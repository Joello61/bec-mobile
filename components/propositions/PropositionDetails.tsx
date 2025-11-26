import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import {
  Calendar,
  Package,
  MapPin,
  Weight,
  DollarSign,
  MessageSquare,
  Plane,
  MessageCircle,
  CheckCircle2,
  XCircle,
  Trash2,
} from 'lucide-react-native';
import { formatDate, formatWeight, formatFullName } from '@/lib/utils/format';
import type { Proposition } from '@/types';
import { Card } from '../ui/Card';
import Avatar from '../ui/Avatar';
import CurrencyDisplay from '../common/CurrencyDisplay';
import Button from '../ui/Button';
import { PropositionStatusBadge } from './PropositionStatusBadge';

interface PropositionDetailsProps {
  proposition: Proposition;
  isReceived: boolean;
  onAccept?: () => void;
  onRefuse?: () => void;
  onDelete?: () => void;
  onContactClient?: () => void;
  onContactVoyageur?: () => void;
  isResponding?: boolean;
  isCanceling?: boolean;
}

export default function PropositionDetails({
  proposition,
  isReceived,
  onAccept,
  onRefuse,
  onDelete,
  onContactClient,
  onContactVoyageur,
  isResponding = false,
  isCanceling = false,
}: PropositionDetailsProps) {
  const isPending = proposition.statut === 'en_attente';
  const isAccepted = proposition.statut === 'acceptee';
  const isRefused = proposition.statut === 'refusee';

  const otherUser = isReceived ? proposition.client : proposition.voyageur;
  const showActionButtons = isPending && isReceived && onAccept && onRefuse;
  const showContactButton = (isAccepted || isPending) && (onContactClient || onContactVoyageur);

  return (
    <ScrollView className="flex-1 bg-gray-50 dark:bg-black">
      <View className="p-4 space-y-4">
        {/* Hero Card - Statut & Profil */}
        <Animated.View entering={FadeInDown.delay(100).springify()}>
          <Card className="overflow-hidden">
            {/* Header avec gradient */}
            <View className="bg-primary/5 dark:bg-primary/10 p-4 border-b border-gray-200 dark:border-gray-700">
              <View className="flex-row items-start justify-between gap-3 mb-4">
                <PropositionStatusBadge statut={proposition.statut} />
                <Text className="text-xs text-gray-500 dark:text-gray-400">
                  {formatDate(proposition.createdAt)}
                </Text>
              </View>

              {/* Profil utilisateur */}
              <View className="flex-row items-center gap-3">
                <Avatar
                  src={otherUser.photo}
                  fallback={formatFullName(otherUser.nom, otherUser.prenom)}
                  size="lg"
                  verified={otherUser.emailVerifie}
                />
                <View className="flex-1">
                  <Text
                    className="font-bold text-base text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {formatFullName(otherUser.nom, otherUser.prenom)}
                  </Text>
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    {isReceived ? 'Client' : 'Voyageur'}
                  </Text>
                </View>
              </View>
            </View>

            {/* Montants clés */}
            <View className="p-4">
              <View className="flex-row gap-2">
                {/* Poids */}
                <View className="flex-1 items-center p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                  <Weight size={20} className="text-primary mb-2" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Poids
                  </Text>
                  <Text className="text-base font-bold text-primary">
                    {formatWeight(proposition.demande.poidsEstime)}
                  </Text>
                </View>

                {/* Prix/kg */}
                <View className="flex-1 items-center p-3 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
                  <DollarSign size={20} className="text-primary mb-2" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Prix/kg
                  </Text>
                  <CurrencyDisplay
                    amount={proposition.prixParKilo}
                    currency={proposition.currency}
                    converted={proposition.converted}
                    viewerCurrency={proposition.viewerCurrency}
                    field="prixParKilo"
                    className="text-base font-bold text-primary"
                  />
                </View>

                {/* Commission */}
                <View className="flex-1 items-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <Package size={20} className="text-green-600 dark:text-green-400 mb-2" />
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Commission
                  </Text>
                  <CurrencyDisplay
                    amount={proposition.commissionProposeePourUnBagage}
                    currency={proposition.currency}
                    converted={proposition.converted}
                    viewerCurrency={proposition.viewerCurrency}
                    field="commission"
                    className="text-base font-bold text-green-600 dark:text-green-400"
                  />
                </View>
              </View>

              {/* Message de la proposition */}
              {proposition.message && (
                <View className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <View className="flex-row items-start gap-2">
                    <MessageSquare size={16} className="text-gray-400 dark:text-gray-500 mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">
                        Message
                      </Text>
                      <Text className="text-sm text-gray-700 dark:text-gray-300 leading-5">
                        {proposition.message}
                      </Text>
                    </View>
                  </View>
                </View>
              )}

              {/* Message de refus */}
              {isRefused && proposition.messageRefus && (
                <View className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-800">
                  <View className="flex-row items-start gap-2">
                    <XCircle size={16} className="text-red-600 dark:text-red-400 mt-0.5" />
                    <View className="flex-1">
                      <Text className="text-xs font-medium text-red-600 dark:text-red-400 mb-1">
                        Raison du refus
                      </Text>
                      <Text className="text-sm text-red-700 dark:text-red-300 leading-5">
                        {proposition.messageRefus}
                      </Text>
                    </View>
                  </View>
                </View>
              )}
            </View>

            {/* Actions */}
            <View className="px-4 py-3 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
              <View className="space-y-2">
                {showActionButtons && (
                  <View className="flex-row gap-2">
                    <View className="flex-1">
                      <Button
                        variant="outline"
                        onPress={onRefuse}
                        disabled={isResponding}
                        leftIcon={<XCircle size={18} />}
                      >
                        Refuser
                      </Button>
                    </View>

                    <View className="flex-1">
                      <Button
                        variant="primary"
                        onPress={onAccept}
                        disabled={isResponding}
                        leftIcon={<CheckCircle2 size={18} />}
                      >
                        {isResponding ? 'Acceptation...' : 'Accepter'}
                      </Button>
                    </View>
                  </View>
                )}

                <Button
                  variant="outline"
                  onPress={onDelete}
                  disabled={isCanceling}
                  leftIcon={<Trash2 size={16} />}
                  className="border-red-600 dark:border-red-400"
                >
                  <Text className="text-red-600 dark:text-red-400">
                    {isCanceling ? 'Annulation...' : 'Annuler la proposition'}
                  </Text>
                </Button>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Voyage Card */}
        <Animated.View entering={FadeInDown.delay(200).springify()}>
          <Card>
            <View className="p-4 bg-primary/5 dark:bg-primary/10 rounded-lg border border-primary/20">
              <View className="flex-row items-center gap-2 mb-3">
                <Plane size={18} className="text-primary" />
                <Text className="text-sm font-semibold text-gray-900 dark:text-white">
                  Trajet
                </Text>
              </View>

              <View className="flex-row items-center gap-2">
                <View className="flex-1">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    De
                  </Text>
                  <Text
                    className="text-sm font-bold text-gray-900 dark:text-white"
                    numberOfLines={1}
                  >
                    {proposition.voyage.villeDepart}
                  </Text>
                </View>

                <View className="w-8 h-8 bg-primary/10 dark:bg-primary/20 rounded-full items-center justify-center">
                  <Plane
                    size={16}
                    className="text-primary"
                    style={{ transform: [{ rotate: '45deg' }] }}
                  />
                </View>

                <View className="flex-1 items-end">
                  <Text className="text-xs text-gray-500 dark:text-gray-400 mb-0.5">
                    Vers
                  </Text>
                  <Text
                    className="text-sm font-bold text-gray-900 dark:text-white text-right"
                    numberOfLines={1}
                  >
                    {proposition.voyage.villeArrivee}
                  </Text>
                </View>
              </View>

              <View className="flex-row items-center gap-2 mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <Calendar size={14} className="text-gray-400 dark:text-gray-500" />
                <Text className="text-xs text-gray-600 dark:text-gray-400">
                  {formatDate(proposition.voyage.dateDepart)}
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Profil utilisateur Card */}
        <Animated.View entering={FadeInDown.delay(300).springify()}>
          <Card>
            <View className="p-4">
              <Text className="text-sm font-semibold text-gray-900 dark:text-white mb-3">
                {isReceived ? 'Client' : 'Voyageur'}
              </Text>

              <View className="flex-row items-start gap-3 mb-4">
                <Avatar
                  src={otherUser.photo}
                  fallback={formatFullName(otherUser.nom, otherUser.prenom)}
                  size="md"
                  verified={otherUser.emailVerifie}
                />
                <View className="flex-1">
                  <Text
                    className="font-bold text-base text-gray-900 dark:text-white mb-1"
                    numberOfLines={1}
                  >
                    {formatFullName(otherUser.nom, otherUser.prenom)}
                  </Text>
                  {otherUser.bio && (
                    <Text
                      className="text-sm text-gray-600 dark:text-gray-400"
                      numberOfLines={2}
                    >
                      {otherUser.bio}
                    </Text>
                  )}
                </View>
              </View>

              <View className="space-y-2 pt-3 border-t border-gray-200 dark:border-gray-700">
                {showContactButton && (
                  <Button
                    variant="outline"
                    onPress={isReceived ? onContactClient : onContactVoyageur}
                    leftIcon={<MessageCircle size={18} />}
                  >
                    Contacter {isReceived ? 'le client' : 'le voyageur'}
                  </Button>
                )}

                {otherUser.address && (
                  <View className="flex-row items-start gap-2 p-2">
                    <MapPin size={14} className="text-gray-400 dark:text-gray-500 mt-0.5" />
                    <Text
                      className="text-sm text-gray-600 dark:text-gray-400"
                      numberOfLines={2}
                    >
                      {otherUser.address.ville}
                      {otherUser.address.pays && `, ${otherUser.address.pays}`}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </Card>
        </Animated.View>
      </View>
    </ScrollView>
  );
}