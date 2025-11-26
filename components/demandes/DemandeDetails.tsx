import React, { useState } from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import {
  Calendar,
  Package,
  MessageCircle,
  AlertCircle,
  Clock,
  Flag,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  ArrowRight,
  Shield,
  AlertTriangle,
  ChevronDown,
  Plane,
} from 'lucide-react-native';
import DemandeStatusBadge from './DemandeStatusBadge';
import { formatDate, formatWeight, getDaysRemaining } from '@/lib/utils/format';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAuth } from '@/lib/hooks/useAuth';
import type { Demande } from '@/types';
import type { CreateSignalementFormData } from '@/lib/validations';
import { cn } from '@/lib/utils/cn';
import { useToast } from '../ui/Toast';
import { Card, CardContent, CardHeader } from '../ui/Card';
import CurrencyDisplay from '../common/CurrencyDisplay';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';
import SignalementForm from '../forms/SignalementForm';
import FavoriteButton from '../favoris/FavoriteButton';

interface DemandeDetailsProps {
  demande: Demande;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function DemandeDetails({
  demande,
  isOwner = false,
  onEdit,
  onDelete,
  onContact,
}: DemandeDetailsProps) {
  const [isSignalementOpen, setIsSignalementOpen] = useState(false);
  const [isSystemInfoExpanded, setIsSystemInfoExpanded] = useState(false);
  const toast = useToast();
  
  const daysRemaining = demande.dateLimite ? getDaysRemaining(demande.dateLimite) : null;
  const { user } = useAuth();
  const { addDemandeToFavoris, removeFavori, isFavoriDemande } = useFavoriActions();
  const { createSignalement } = useSignalementActions();

  const isFavorite = isFavoriDemande(demande.id);
  const isExpired = demande.statut === 'expiree';
  const isUrgent = daysRemaining !== null && daysRemaining < 3 && daysRemaining >= 0;
  const showContactButton = !isOwner && demande.statut === 'en_recherche';

  const handleToggleFavorite = async () => {
    if (user?.isProfileComplete) {
      if (isFavorite) {
        await removeFavori(demande.id, 'demande');
      } else {
        await addDemandeToFavoris(demande.id);
      }
    } else {
      toast.error('Veuillez compléter votre profil pour pouvoir ajouter aux favoris.');
    }
  };

  const handleSignalement = async (data: CreateSignalementFormData) => {
    if (user?.isProfileComplete) {
      await createSignalement(data);
    } else {
      toast.error('Veuillez compléter votre profil pour pouvoir signaler une demande.');
    }
  };

  return (
    <ScrollView
      className="flex-1 bg-background dark:bg-gray-900"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ paddingBottom: 24 }}
    >
      <View className="gap-4 p-4">
        {/* Hero Section - Itinéraire */}
        <Card className="overflow-hidden">
          <View
            className={cn(
              'px-6 py-6',
              isUrgent
                ? 'bg-red-50 dark:bg-red-900/20'
                : 'bg-accent/5 dark:bg-accent/10'
            )}
          >
            {/* Header avec statut et actions */}
            <View className="flex-row items-center justify-between mb-6">
              <View className="flex-row items-center gap-3 flex-1">
                <DemandeStatusBadge statut={demande.statut} size="md" />
                {isUrgent && (
                  <View className="flex-row items-center gap-2 px-3 py-1.5 bg-red-100 dark:bg-red-900/40 rounded-lg">
                    <AlertTriangle size={16} className="text-red-600 dark:text-red-400" />
                    <Text className="text-sm font-bold text-red-700 dark:text-red-300">
                      {daysRemaining}j restant{daysRemaining! > 1 ? 's' : ''}
                    </Text>
                  </View>
                )}
              </View>

              {/* Actions */}
              {user && !isOwner && (
                <View className="flex-row items-center gap-2">
                  {!isExpired && (
                    <FavoriteButton
                      isFavorite={isFavorite}
                      onToggle={handleToggleFavorite}
                      size="md"
                    />
                  )}
                  <Pressable
                    onPress={() => setIsSignalementOpen(true)}
                    className="w-9 h-9 rounded-full bg-white/60 dark:bg-gray-800/60 flex items-center justify-center active:opacity-70"
                  >
                    <Flag size={18} className="text-gray-600 dark:text-gray-400" />
                  </Pressable>
                </View>
              )}
            </View>

            {/* Itinéraire visuel */}
            <View className="gap-4">
              <View className="flex-row items-center gap-4">
                <View className="flex-1">
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Départ
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                    {demande.villeDepart}
                  </Text>
                </View>

                <View className="items-center gap-2">
                  <View
                    className={cn(
                      'w-14 h-14 rounded-full flex items-center justify-center shadow-lg',
                      isUrgent
                        ? 'bg-red-100 dark:bg-red-900/40'
                        : 'bg-white dark:bg-gray-800'
                    )}
                  >
                    <Package
                      size={28}
                      className={cn(
                        isUrgent
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-accent dark:text-accent-light'
                      )}
                    />
                  </View>
                  <View className="flex-row items-center gap-1 px-2 py-0.5 bg-white/80 dark:bg-gray-800/80 rounded-full">
                    <ArrowRight size={12} className="text-gray-500 dark:text-gray-400" />
                    <Text className="text-[10px] text-gray-600 dark:text-gray-400">
                      Transport
                    </Text>
                  </View>
                </View>

                <View className="flex-1 items-end">
                  <Text className="text-xs text-gray-600 dark:text-gray-400 mb-1">
                    Arrivée
                  </Text>
                  <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100 text-right">
                    {demande.villeArrivee}
                  </Text>
                </View>
              </View>

              {/* Date limite */}
              {demande.dateLimite && (
                <View
                  className={cn(
                    'flex-row items-center justify-center gap-3 px-4 py-3 rounded-lg',
                    isUrgent
                      ? 'bg-red-100 dark:bg-red-900/40'
                      : 'bg-white/60 dark:bg-gray-800/60'
                  )}
                >
                  <Clock
                    size={20}
                    className={cn(
                      isUrgent
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-accent dark:text-accent-light'
                    )}
                  />
                  <View>
                    <Text
                      className={cn(
                        'text-xs font-medium text-center',
                        isUrgent
                          ? 'text-red-700 dark:text-red-300'
                          : 'text-gray-600 dark:text-gray-400'
                      )}
                    >
                      Date limite
                    </Text>
                    <Text
                      className={cn(
                        'text-lg font-bold text-center',
                        isUrgent
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-gray-900 dark:text-gray-100'
                      )}
                    >
                      {formatDate(demande.dateLimite)}
                    </Text>
                    {daysRemaining !== null && (
                      <Text
                        className={cn(
                          'text-sm font-medium text-center mt-1',
                          daysRemaining < 0
                            ? 'text-gray-500 dark:text-gray-400'
                            : isUrgent
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400'
                        )}
                      >
                        {daysRemaining < 0
                          ? 'Expiré'
                          : daysRemaining === 0
                          ? "Expire aujourd'hui !"
                          : daysRemaining === 1
                          ? 'Expire demain !'
                          : `${daysRemaining} jours restants`}
                      </Text>
                    )}
                  </View>
                </View>
              )}
            </View>
          </View>

          {/* Infos rapides en badges */}
          <View className="px-6 py-4 bg-gray-50 dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700">
            <View className="flex-row flex-wrap gap-2">
              <View className="flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                <Package size={16} className="text-accent dark:text-accent-light" />
                <Text className="text-sm font-semibold text-gray-900 dark:text-gray-100">
                  {formatWeight(demande.poidsEstime)}
                </Text>
                <Text className="text-xs text-gray-500 dark:text-gray-400">estimé</Text>
              </View>

              {demande.prixParKilo && (
                <View className="flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <DollarSign size={16} className="text-accent dark:text-accent-light" />
                  <CurrencyDisplay
                    amount={demande.prixParKilo}
                    currency={demande.currency}
                    converted={demande.converted}
                    viewerCurrency={demande.viewerCurrency}
                    field="prixParKilo"
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                  />
                  <Text className="text-xs text-gray-500 dark:text-gray-400">/kg</Text>
                </View>
              )}

              {demande.commissionProposeePourUnBagage && (
                <View className="flex-row items-center gap-2 px-3 py-2 bg-white dark:bg-gray-700 rounded-lg shadow-sm">
                  <Shield size={16} className="text-accent dark:text-accent-light" />
                  <CurrencyDisplay
                    amount={demande.commissionProposeePourUnBagage}
                    currency={demande.currency}
                    converted={demande.converted}
                    viewerCurrency={demande.viewerCurrency}
                    field="commission"
                    className="text-sm font-semibold text-gray-900 dark:text-gray-100"
                  />
                  <Text className="text-xs text-gray-500 dark:text-gray-400">
                    commission
                  </Text>
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Description */}
        <Card>
          <CardHeader title="Description de la demande" />
          <CardContent>
            <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {demande.description}
            </Text>
          </CardContent>
        </Card>

        {/* Client Info */}
        <Card>
          <CardHeader title="Client" />
          <CardContent>
            <View className="gap-4">
              {/* Profil */}
              <View className="flex-row items-start gap-4">
                <Avatar
                  src={demande.client.photo || undefined}
                  fallback={`${demande.client.nom} ${demande.client.prenom}`}
                  size="xl"
                  verified={demande.client.emailVerifie}
                />
                <View className="flex-1">
                  <Text className="font-bold text-lg text-gray-900 dark:text-gray-100 mb-1">
                    {demande.client.prenom} {demande.client.nom}
                  </Text>
                  {demande.client.bio && (
                    <Text
                      className="text-sm text-gray-600 dark:text-gray-400"
                      numberOfLines={3}
                    >
                      {demande.client.bio}
                    </Text>
                  )}
                </View>
              </View>

              {/* Contact */}
              <View className="gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                <View className="flex-row items-center gap-2">
                  <Mail size={16} className="text-gray-400" />
                  <Text
                    className="text-sm text-gray-600 dark:text-gray-400 flex-1"
                    numberOfLines={1}
                  >
                    {demande.client.email}
                  </Text>
                </View>
                {demande.client.telephone && (
                  <View className="flex-row items-center gap-2">
                    <Phone size={16} className="text-gray-400" />
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      {demande.client.telephone}
                    </Text>
                  </View>
                )}
                {demande.client.address && (
                  <View className="flex-row items-center gap-2">
                    <MapPin size={16} className="text-gray-400" />
                    <Text
                      className="text-sm text-gray-600 dark:text-gray-400 flex-1"
                      numberOfLines={2}
                    >
                      {demande.client.address.ville}
                      {demande.client.address.pays && `, ${demande.client.address.pays}`}
                    </Text>
                  </View>
                )}
                <View className="flex-row items-center gap-2">
                  <Calendar size={16} className="text-gray-400" />
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Membre depuis {formatDate(demande.client.createdAt)}
                  </Text>
                </View>
              </View>

              {/* Actions */}
              {(showContactButton || isOwner) && (
                <View className="gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  {showContactButton && (
                    <Button
                      variant="primary"
                      size="lg"
                      onPress={onContact}
                      leftIcon={<MessageCircle size={20} />}
                    >
                      Proposer mes services
                    </Button>
                  )}

                  {isOwner && !isExpired && (
                    <>
                      <Button
                        variant="outline"
                        size="lg"
                        onPress={onEdit}
                        disabled={demande.statut === 'annulee'}
                      >
                        Modifier la demande
                      </Button>
                      <Button
                        variant="danger"
                        size="lg"
                        onPress={onDelete}
                        leftIcon={<AlertCircle size={20} />}
                        disabled={demande.statut === 'annulee'}
                      >
                        {demande.statut === 'annulee' ? 'Demande annulée' : 'Annuler la demande'}
                      </Button>
                    </>
                  )}
                </View>
              )}
            </View>
          </CardContent>
        </Card>

        {/* Card Urgence (si applicable) */}
        {isUrgent && (
          <Card className="bg-red-50 dark:bg-red-900/20 border-red-100 dark:border-red-900/40">
            <CardContent className="p-4">
              <View className="flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/40 flex items-center justify-center">
                  <AlertTriangle size={20} className="text-red-600 dark:text-red-400" />
                </View>
                <View className="flex-1">
                  <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                    Demande urgente
                  </Text>
                  <Text className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                    Cette demande expire dans {daysRemaining} jour
                    {daysRemaining! > 1 ? 's' : ''}. Contactez rapidement le client si vous êtes
                    intéressé.
                  </Text>
                </View>
              </View>
            </CardContent>
          </Card>
        )}

        {/* Card Sécurité */}
        <Card className="bg-blue-50 dark:bg-blue-900/20 border-blue-100 dark:border-blue-900/40">
          <CardContent className="p-4">
            <View className="flex-row items-start gap-3">
              <View className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/40 flex items-center justify-center">
                <Shield size={20} className="text-blue-600 dark:text-blue-400" />
              </View>
              <View className="flex-1">
                <Text className="font-semibold text-sm text-gray-900 dark:text-gray-100 mb-1">
                  Conseils de sécurité
                </Text>
                <Text className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
                  Vérifiez toujours le contenu du colis. Ne transportez jamais d'objets illégaux
                  ou suspects.
                </Text>
              </View>
            </View>
          </CardContent>
        </Card>

        {/* Informations système - Collapsible */}
        <Pressable onPress={() => setIsSystemInfoExpanded(!isSystemInfoExpanded)}>
          <Card>
            <CardContent className="py-4">
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center gap-2">
                  <Clock size={16} className="text-gray-400" />
                  <Text className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    Informations système
                  </Text>
                </View>
                <ChevronDown
                  size={20}
                  className="text-gray-400"
                  style={{
                transform: [{ rotate: isSystemInfoExpanded ? '180deg' : '0deg' }],
              }}
            />
          </View>
        </CardContent>
      </Card>
    </Pressable>

    {isSystemInfoExpanded && (
      <Card className="border-t-0 rounded-t-none">
        <CardContent className="pt-0">
          <View className="gap-3">
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">Créée le :</Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(demande.createdAt)}
              </Text>
            </View>
            <View>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                Mise à jour :
              </Text>
              <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                {formatDate(demande.updatedAt)}
              </Text>
            </View>
          </View>
        </CardContent>
      </Card>
    )}
  </View>

  {/* Modal de signalement */}
  {user && !isOwner && (
    <SignalementForm
      isOpen={isSignalementOpen}
      onClose={() => setIsSignalementOpen(false)}
      onSubmit={handleSignalement}
      demandeId={demande.id}
    />
  )}
</ScrollView>
    );
}