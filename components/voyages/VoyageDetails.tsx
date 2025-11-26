import React, { useState } from 'react';
import {
  Package,
  MessageCircle,
  AlertCircle,
  Flag,
  Star,
  DollarSign,
  MapPin,
  Phone,
  Mail,
  Clock,
  Plane,
  Heart,
  Shield,
  ChevronDown,
} from 'lucide-react-native';
import VoyageStatusBadge from './VoyageStatusBadge';
import AvisForm from '@/components/forms/AvisForm';
import SignalementForm from '@/components/forms/SignalementForm';
import CurrencyDisplay from '@/components/common/CurrencyDisplay';
import { formatDate, formatWeight } from '@/lib/utils/format';
import { useFavoriActions } from '@/lib/hooks/useFavoris';
import { useSignalementActions } from '@/lib/hooks/useSignalement';
import { useAuth } from '@/lib/hooks/useAuth';
import { cn } from '@/lib/utils/cn';
import type { Voyage } from '@/types';
import type {
  CreateSignalementFormData,
  CreateAvisFormData,
} from '@/lib/validations';
import { useAvisStore } from '@/lib/store/avisStore';
import Avatar from '../ui/Avatar';
import { Card } from '../ui/Card';
import { Pressable, ScrollView, View, Text } from 'react-native';
import Button from '../ui/Button';
import Modal from '../ui/Modal';

interface VoyageDetailsProps {
  voyage: Voyage;
  isOwner?: boolean;
  onEdit?: () => void;
  onDelete?: () => void;
  onContact?: () => void;
}

export default function VoyageDetails({
  voyage,
  isOwner = false,
  onEdit,
  onDelete,
  onContact,
}: VoyageDetailsProps) {
  const [isSignalementOpen, setIsSignalementOpen] = useState(false);
  const [isAvisOpen, setIsAvisOpen] = useState(false);
  const [isSystemInfoExpanded, setIsSystemInfoExpanded] = useState(false);
  
  const { user } = useAuth();
  const { addVoyageToFavoris, removeFavori, isFavoriVoyage } = useFavoriActions();
  const { createSignalement } = useSignalementActions();
  const { createAvis, showToast } = useAvisStore();

  const isFavorite = isFavoriVoyage(voyage.id);
  const isExpired = voyage.statut === 'expire';
  const canLeaveReview = !isOwner && voyage.statut === 'complete';
  const showContactButton = !isOwner && voyage.statut === 'actif';

  const handleToggleFavorite = async () => {
    if (!user?.isProfileComplete) {
      showToast({
        type: 'error',
        message: 'Veuillez compléter votre profil pour ajouter aux favoris.',
      });
      return;
    }

    if (isFavorite) {
      await removeFavori(voyage.id, 'voyage');
    } else {
      await addVoyageToFavoris(voyage.id);
    }
  };

  const handleSignalement = async (data: CreateSignalementFormData) => {
    if (!user?.isProfileComplete) {
      showToast({
        type: 'error',
        message: 'Veuillez compléter votre profil pour signaler un voyage.',
      });
      return;
    }
    await createSignalement(data);
    setIsSignalementOpen(false);
  };

  const handleAvis = async (data: CreateAvisFormData) => {
    if (!user?.isProfileComplete) {
      showToast({
        type: 'error',
        message: 'Veuillez compléter votre profil pour laisser un avis.',
      });
      return;
    }
    await createAvis(data);
    setIsAvisOpen(false);
  };

  return (
    <ScrollView 
      className="flex-1 bg-background"
      showsVerticalScrollIndicator={false}
    >
      <View className="p-4 gap-4">
        {/* Header Card - Itinéraire */}
        <Card>
          <View className="p-4">
            {/* En-tête avec badges et actions */}
            <View className="flex flex-row items-center justify-between mb-4">
              <VoyageStatusBadge statut={voyage.statut} />
              
              {user && !isOwner && (
                <View className="flex flex-row items-center gap-2">
                  {!isExpired && (
                    <Pressable
                      onPress={handleToggleFavorite}
                      className="w-9 h-9 rounded-full bg-surface items-center justify-center active:opacity-70"
                      accessibilityLabel={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
                      accessibilityRole="button"
                    >
                      <Heart
                        size={18}
                        className={cn(
                          'transition-colors',
                          isFavorite ? 'text-red-500' : 'text-muted'
                        )}
                        fill={isFavorite ? 'rgb(239, 68, 68)' : 'none'}
                      />
                    </Pressable>
                  )}
                  <Pressable
                    onPress={() => setIsSignalementOpen(true)}
                    className="w-9 h-9 rounded-full bg-surface items-center justify-center active:opacity-70"
                    accessibilityLabel="Signaler"
                    accessibilityRole="button"
                  >
                    <Flag size={18} className="text-muted" />
                  </Pressable>
                </View>
              )}
            </View>

            {/* Itinéraire visuel */}
            <View className="flex flex-row items-center justify-between mb-6">
              <View className="flex-1">
                <Text className="text-sm text-muted mb-1">Départ</Text>
                <Text className="text-xl font-bold text-foreground">
                  {voyage.villeDepart}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {formatDate(voyage.dateDepart)}
                </Text>
              </View>

              <View className="items-center px-4">
                <View className="w-12 h-12 rounded-full bg-primary/10 items-center justify-center">
                  <Plane size={24} className="text-primary" style={{ transform: [{ rotate: '45deg' }] }} />
                </View>
              </View>

              <View className="flex-1 items-end">
                <Text className="text-sm text-muted mb-1">Arrivée</Text>
                <Text className="text-xl font-bold text-foreground text-right">
                  {voyage.villeArrivee}
                </Text>
                <Text className="text-xs text-muted mt-1">
                  {formatDate(voyage.dateArrivee)}
                </Text>
              </View>
            </View>

            {/* Infos rapides - Grid 2 colonnes */}
            <View className="flex flex-row flex-wrap gap-2">
              {/* Poids disponible */}
              <View className="flex-1 min-w-[45%] bg-surface rounded-lg p-3 border border-border">
                <View className="flex flex-row items-center gap-2 mb-1">
                  <Package size={16} className="text-primary" />
                  <Text className="text-xs text-muted">Disponible</Text>
                </View>
                <Text className="text-base font-bold text-foreground">
                  {formatWeight(voyage.poidsDisponible)}
                </Text>
                {parseFloat(voyage.poidsDisponibleRestant) !== parseFloat(voyage.poidsDisponible) && (
                  <Text className="text-xs text-muted mt-1">
                    Restant: <Text className="font-semibold">{formatWeight(voyage.poidsDisponibleRestant)}</Text>
                  </Text>
                )}
              </View>

              {/* Prix par kilo */}
              {voyage.prixParKilo && (
                <View className="flex-1 min-w-[45%] bg-surface rounded-lg p-3 border border-border">
                  <View className="flex flex-row items-center gap-2 mb-1">
                    <DollarSign size={16} className="text-primary" />
                    <Text className="text-xs text-muted">Prix/kg</Text>
                  </View>
                  <CurrencyDisplay
                    amount={voyage.prixParKilo}
                    currency={voyage.currency}
                    converted={voyage.converted}
                    viewerCurrency={voyage.viewerCurrency}
                    field="prixParKilo"
                    className="text-base font-bold text-foreground"
                  />
                </View>
              )}

              {/* Commission */}
              {voyage.commissionProposeePourUnBagage && (
                <View className="flex-1 min-w-[45%] bg-surface rounded-lg p-3 border border-border">
                  <View className="flex flex-row items-center gap-2 mb-1">
                    <Shield size={16} className="text-primary" />
                    <Text className="text-xs text-muted">Commission</Text>
                  </View>
                  <CurrencyDisplay
                    amount={voyage.commissionProposeePourUnBagage}
                    currency={voyage.currency}
                    converted={voyage.converted}
                    viewerCurrency={voyage.viewerCurrency}
                    field="commission"
                    className="text-base font-bold text-foreground"
                  />
                </View>
              )}
            </View>
          </View>
        </Card>

        {/* Description */}
        {voyage.description && (
          <Card>
            <View className="p-4">
              <Text className="text-base font-semibold text-foreground mb-3">
                Description du voyage
              </Text>
              <Text className="text-sm text-foreground leading-relaxed">
                {voyage.description}
              </Text>
            </View>
          </Card>
        )}

        {/* Informations du voyageur */}
        <Card>
          <View className="p-4">
            <Text className="text-base font-semibold text-foreground mb-4">
              Informations du voyageur
            </Text>

            {/* Profil */}
            <View className="flex flex-row items-start gap-3 mb-4">
              <Avatar
                src={voyage.voyageur.photo || undefined}
                fallback={`${voyage.voyageur.nom} ${voyage.voyageur.prenom}`}
                size="lg"
                verified={voyage.voyageur.emailVerifie}
              />
              <View className="flex-1">
                <View className="flex flex-row items-center gap-2 flex-wrap mb-1">
                  <Text className="text-base font-semibold text-foreground">
                    {voyage.voyageur.prenom} {voyage.voyageur.nom}
                  </Text>
                  {!isOwner &&
                    voyage.voyageur.noteAvisMoyen !== null &&
                    voyage.voyageur.noteAvisMoyen > 0 && (
                      <View className="flex flex-row items-center gap-1 px-2 py-0.5 bg-amber-50 rounded-full">
                        <Star size={14} className="text-amber-400" fill="rgb(251, 191, 36)" />
                        <Text className="text-xs font-medium text-amber-700">
                          {voyage.voyageur.noteAvisMoyen.toFixed(1)}
                        </Text>
                      </View>
                    )}
                </View>
                {voyage.voyageur.bio && (
                  <Text className="text-sm text-muted" numberOfLines={2}>
                    {voyage.voyageur.bio}
                  </Text>
                )}
              </View>
            </View>

            {/* Coordonnées */}
            <View className="gap-3 pt-4 border-t border-border">
              <View className="flex flex-row items-center gap-3">
                <Mail size={16} className="text-muted" />
                <Text className="text-sm text-foreground flex-1" numberOfLines={1}>
                  {voyage.voyageur.email}
                </Text>
              </View>

              {voyage.voyageur.telephone && (
                <View className="flex flex-row items-center gap-3">
                  <Phone size={16} className="text-muted" />
                  <Text className="text-sm text-foreground">
                    {voyage.voyageur.telephone}
                  </Text>
                </View>
              )}

              {voyage.voyageur.address && (
                <View className="flex flex-row items-center gap-3">
                  <MapPin size={16} className="text-muted" />
                  <Text className="text-sm text-foreground flex-1" numberOfLines={2}>
                    {voyage.voyageur.address.ville}
                    {voyage.voyageur.address.quartier && `, ${voyage.voyageur.address.quartier}`}
                    {voyage.voyageur.address.pays && ` - ${voyage.voyageur.address.pays}`}
                  </Text>
                </View>
              )}

              <View className="flex flex-row items-center gap-3">
                <Clock size={16} className="text-muted" />
                <Text className="text-sm text-foreground">
                  Membre depuis {formatDate(voyage.voyageur.createdAt)}
                </Text>
              </View>
            </View>

            {/* Actions utilisateur */}
            {(showContactButton || canLeaveReview) && (
              <View className="gap-3 pt-4 border-t border-border mt-4">
                {showContactButton && (
                  <Button
                    variant="primary"
                    onPress={onContact}
                    leftIcon={<MessageCircle size={20} className="text-white" />}
                  >
                    Contacter le voyageur
                  </Button>
                )}

                {canLeaveReview && (
                  <Button
                    variant="outline"
                    onPress={() => setIsAvisOpen(true)}
                    leftIcon={<Star size={20} className="text-foreground" />}
                  >
                    Laisser un avis
                  </Button>
                )}
              </View>
            )}
          </View>
        </Card>

        {/* Conseils de sécurité */}
        {!isOwner && (
          <Card className="bg-blue-50 border-blue-100">
            <View className="p-4">
              <View className="flex flex-row items-start gap-3">
                <View className="w-10 h-10 rounded-lg bg-blue-100 items-center justify-center">
                  <Shield size={20} className="text-blue-600" />
                </View>
                <View className="flex-1">
                  <Text className="text-sm font-semibold text-gray-900 mb-1">
                    Conseils de sécurité
                  </Text>
                  <Text className="text-xs text-gray-600 leading-relaxed">
                    Vérifiez toujours l'identité du voyageur. Ne payez jamais en avance sans confirmation.
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        )}

        {/* Informations système - Collapsible */}
        <Pressable
          onPress={() => setIsSystemInfoExpanded(!isSystemInfoExpanded)}
          accessibilityRole="button"
          accessibilityLabel="Informations système"
        >
          <Card>
            <View className="p-4">
              <View className="flex flex-row items-center justify-between">
                <View className="flex flex-row items-center gap-2">
                  <Clock size={16} className="text-muted" />
                  <Text className="text-sm font-medium text-foreground">
                    Informations système
                  </Text>
                </View>
                <ChevronDown
                  size={20}
                  className={cn(
                    'text-muted transition-transform',
                    isSystemInfoExpanded && 'rotate-180'
                  )}
                  style={{
                    transform: [{ rotate: isSystemInfoExpanded ? '180deg' : '0deg' }]
                  }}
                />
              </View>

              {isSystemInfoExpanded && (
                <View className="gap-3 pt-4 border-t border-border mt-4">
                  <View className="flex flex-row justify-between">
                    <Text className="text-sm text-muted">Créé le :</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {formatDate(voyage.createdAt)}
                    </Text>
                  </View>
                  <View className="flex flex-row justify-between">
                    <Text className="text-sm text-muted">Mise à jour :</Text>
                    <Text className="text-sm font-medium text-foreground">
                      {formatDate(voyage.updatedAt)}
                    </Text>
                  </View>
                </View>
              )}
            </View>
          </Card>
        </Pressable>

        {/* Actions propriétaire */}
        {isOwner && !isExpired && (
          <View className="gap-3">
            <Button
              variant="outline"
              onPress={onEdit}
              disabled={voyage.statut === 'annule'}
            >
              Modifier le voyage
            </Button>
            <Button
              variant="danger"
              onPress={onDelete}
              disabled={voyage.statut === 'annule'}
              leftIcon={<AlertCircle size={20} className="text-white" />}
            >
              {voyage.statut === 'annule' ? 'Voyage annulé' : 'Annuler le voyage'}
            </Button>
          </View>
        )}
      </View>

      {/* Modals */}
      {user && !isOwner && (
        <Modal
          visible={isSignalementOpen}
          onClose={() => setIsSignalementOpen(false)}
          title="Signaler ce voyage"
        >
          <SignalementForm
            onSubmit={handleSignalement}
            voyageId={voyage.id}
            onCancel={() => setIsSignalementOpen(false)}
          />
        </Modal>
      )}

      {user && canLeaveReview && (
        <Modal
          visible={isAvisOpen}
          onClose={() => setIsAvisOpen(false)}
          title="Laisser un avis"
        >
          <AvisForm
            cibleId={voyage.voyageur.id}
            cibleNom={`${voyage.voyageur.prenom} ${voyage.voyageur.nom}`}
            voyageId={voyage.id}
            onSubmit={handleAvis}
            onCancel={() => setIsAvisOpen(false)}
          />
        </Modal>
      )}
    </ScrollView>
  );
}