import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { Package, Plus, ArrowRight } from 'lucide-react-native';
import DemandeStatusBadge from '../demandes/DemandeStatusBadge';
import { formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { ROUTES } from '@/lib/utils/constants';
import type { DashboardDemande } from '@/types';
import { cn } from '@/lib/utils/cn';
import { Card, CardContent } from '../ui/Card';
import EmptyState from '../common/EmptyState';
import Button from '../ui/Button';

interface RecentDemandesProps {
  demandes: DashboardDemande[];
  total: number;
  enCours: number;
}

export default function RecentDemandes({ demandes, total, enCours }: RecentDemandesProps) {
  const router = useRouter();

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-6">
          <View className="flex-row items-center gap-3 flex-1">
            <View className="w-10 h-10 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center">
              <Package size={20} className="text-primary dark:text-primary-light" />
            </View>
            <View className="flex-1">
              <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Mes Demandes
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {enCours} en cours sur {total} total
              </Text>
            </View>
          </View>
          <Pressable
            onPress={() => router.push("/(protected)/demandes")}
            className="active:opacity-70"
          >
            <View className="flex-row items-center gap-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg">
              <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                Voir tout
              </Text>
              <ArrowRight size={16} className="text-gray-700 dark:text-gray-300" />
            </View>
          </Pressable>
        </View>

        {/* List */}
        {demandes.length === 0 ? (
          <EmptyState
            icon={<Package size={64} className="text-gray-400 dark:text-gray-500" />}
            title="Aucune demande"
            description="Vous n'avez pas encore créé de demande"
            action={{
              label: 'Créer une demande',
              onPress: () => router.push("/(protected)/demandes/create"),
            }}
          />
        ) : (
          <View className="gap-3">
            {demandes.map((demande, index) => {
              const daysRemaining = demande.dateLimite 
                ? getDaysRemaining(demande.dateLimite) 
                : null;
              
              return (
                <Animated.View
                  key={demande.id}
                  entering={FadeInRight.delay(index * 100)}
                >
                  <Pressable
                    onPress={() => router.push({
                        pathname: "/(protected)/demandes/[id]",
                        params: { id: demande.id.toString() }
                    })}
                    className="active:opacity-70"
                  >
                    <View className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg active:border-primary dark:active:border-primary-light active:bg-primary/5 dark:active:bg-primary/10">
                      <View className="flex-row items-start justify-between mb-2">
                        <View className="flex-1">
                          {/* Itinéraire */}
                          <View className="flex-row items-center gap-2 mb-1">
                            <Text className="font-medium text-gray-900 dark:text-gray-100">
                              {demande.villeDepart}
                            </Text>
                            <ArrowRight size={16} className="text-gray-400" />
                            <Text className="font-medium text-gray-900 dark:text-gray-100">
                              {demande.villeArrivee}
                            </Text>
                          </View>
                          
                          {/* Info secondaire */}
                          <View className="flex-row items-center gap-3">
                            <Text className="text-sm text-gray-600 dark:text-gray-400">
                              {formatWeight(demande.poidsEstime)}
                            </Text>
                            {daysRemaining !== null && (
                              <>
                                <Text className="text-sm text-gray-400">•</Text>
                                <Text
                                  className={cn(
                                    'text-sm',
                                    daysRemaining < 3 && daysRemaining >= 0
                                      ? 'text-error dark:text-red-400 font-medium'
                                      : 'text-gray-600 dark:text-gray-400'
                                  )}
                                >
                                  {daysRemaining >= 0 
                                    ? `${daysRemaining}j restants` 
                                    : 'Expiré'}
                                </Text>
                              </>
                            )}
                          </View>
                        </View>
                        <DemandeStatusBadge statut={demande.statut} size="sm" />
                      </View>
                    </View>
                  </Pressable>
                </Animated.View>
              );
            })}
          </View>
        )}

        {/* CTA */}
        {demandes.length > 0 && (
          <View className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <Button
              variant="outline"
              onPress={() => router.push("/(protected)/demandes/create")}
              leftIcon={<Plus size={16} />}
            >
              Créer une nouvelle demande
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}