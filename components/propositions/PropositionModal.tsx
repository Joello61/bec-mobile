import React, { useState } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { AlertCircle, Plus, Lightbulb, ArrowRight } from 'lucide-react-native';
import { ROUTES } from '@/lib/utils/constants';
import type { Voyage, CreatePropositionInput } from '@/types';
import Modal from '../ui/Modal';
import CurrencyDisplay from '../common/CurrencyDisplay';
import Button from '../ui/Button';
import PropositionForm from '../forms/PropositionForm';

interface PropositionModalProps {
  isOpen: boolean;
  onClose: () => void;
  voyage: Voyage;
  userDemandes: Array<{
    id: number;
    villeDepart: string;
    villeArrivee: string;
    dateLimite: string;
    prixParKilo: number;
    commission: number;
  }>;
  onSubmit: (data: CreatePropositionInput) => Promise<void>;
}

export default function PropositionModal({
  isOpen,
  onClose,
  voyage,
  userDemandes,
  onSubmit,
}: PropositionModalProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (data: CreatePropositionInput) => {
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      onClose();
    } catch (error) {
      // Error handling is done in the parent component
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCreateDemande = () => {
    onClose();
    router.push("/(protected)/demandes/create");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      title="Faire une proposition"
    >
      <ScrollView className="flex-1">
        <View className="p-6">
          {/* Header */}
          <View className="mb-6">
            <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Faire une proposition
            </Text>
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Voyage: {voyage.villeDepart} vers {voyage.villeArrivee}
            </Text>
          </View>

          {/* Info voyage - Si l'utilisateur a des demandes */}
          {userDemandes.length > 0 && (
            <View className="mb-6 p-4 bg-primary/5 dark:bg-primary/10 border border-primary/20 rounded-lg">
              <View className="space-y-3">
                {/* Départ */}
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Départ:
                  </Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {new Date(voyage.dateDepart).toLocaleDateString('fr-FR')}
                  </Text>
                </View>

                {/* Poids disponible */}
                <View className="flex-row justify-between">
                  <Text className="text-sm text-gray-600 dark:text-gray-400">
                    Poids disponible:
                  </Text>
                  <Text className="text-sm font-medium text-gray-900 dark:text-white">
                    {voyage.poidsDisponible} kg
                  </Text>
                </View>

                {/* Prix suggéré */}
                {voyage.prixParKilo && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Prix suggéré/kg:
                    </Text>
                    <CurrencyDisplay
                      amount={voyage.prixParKilo}
                      currency={voyage.currency}
                      converted={voyage.converted}
                      viewerCurrency={voyage.viewerCurrency}
                      field="prixParKilo"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    />
                  </View>
                )}

                {/* Commission suggérée */}
                {voyage.commissionProposeePourUnBagage && (
                  <View className="flex-row justify-between items-center">
                    <Text className="text-sm text-gray-600 dark:text-gray-400">
                      Commission suggérée:
                    </Text>
                    <CurrencyDisplay
                      amount={voyage.commissionProposeePourUnBagage}
                      currency={voyage.currency}
                      converted={voyage.converted}
                      viewerCurrency={voyage.viewerCurrency}
                      field="commission"
                      className="text-sm font-semibold text-gray-900 dark:text-white"
                    />
                  </View>
                )}
              </View>
            </View>
          )}

          {/* Formulaire ou message si aucune demande */}
          {userDemandes.length === 0 ? (
            <View className="items-center py-4">
              {/* Icône d'alerte */}
              <View className="w-16 h-16 bg-amber-100 dark:bg-amber-900/20 rounded-full items-center justify-center mb-4">
                <AlertCircle size={32} className="text-amber-600 dark:text-amber-400" />
              </View>

              {/* Titre */}
              <Text className="text-lg font-semibold text-gray-900 dark:text-white mb-2 text-center">
                Aucune demande correspondante
              </Text>

              {/* Message explicatif */}
              <Text className="text-gray-600 dark:text-gray-400 mb-2 text-center px-4">
                Pour faire une proposition sur ce voyage, vous devez d'abord créer une demande
                pour le même trajet :
              </Text>
              
              <View className="flex-row items-center gap-2 mb-6">
                <Text className="text-gray-900 dark:text-white font-semibold">
                  {voyage.villeDepart}
                </Text>
                <ArrowRight size={16} className="text-gray-600 dark:text-gray-400" />
                <Text className="text-gray-900 dark:text-white font-semibold">
                  {voyage.villeArrivee}
                </Text>
              </View>

              {/* Actions */}
              <View className="w-full space-y-3 mb-6">
                <Button variant="outline" onPress={onClose}>
                  Annuler
                </Button>
                <Button
                  variant="primary"
                  leftIcon={<Plus size={16} />}
                  onPress={handleCreateDemande}
                >
                  Créer une demande
                </Button>
              </View>

              {/* Info supplémentaire */}
              <View className="w-full p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
                <View className="flex-row items-center gap-2 mb-2">
                  <Lightbulb size={16} className="text-blue-600 dark:text-blue-400" />
                  <Text className="text-sm font-semibold text-blue-900 dark:text-blue-300">
                    Comment ça marche ?
                  </Text>
                </View>
                
                <View className="space-y-2">
                  <View className="flex-row gap-2">
                    <Text className="text-sm text-blue-800 dark:text-blue-300">1.</Text>
                    <Text className="text-sm text-blue-800 dark:text-blue-300 flex-1">
                      Créez une demande pour le trajet {voyage.villeDepart} → {voyage.villeArrivee}
                    </Text>
                  </View>
                  
                  <View className="flex-row gap-2">
                    <Text className="text-sm text-blue-800 dark:text-blue-300">2.</Text>
                    <Text className="text-sm text-blue-800 dark:text-blue-300 flex-1">
                      Revenez sur ce voyage
                    </Text>
                  </View>
                  
                  <View className="flex-row gap-2">
                    <Text className="text-sm text-blue-800 dark:text-blue-300">3.</Text>
                    <Text className="text-sm text-blue-800 dark:text-blue-300 flex-1">
                      Faites votre proposition en liant votre demande
                    </Text>
                  </View>
                </View>
              </View>
            </View>
          ) : (
            <PropositionForm
              voyage={voyage}
              userDemandes={userDemandes}
              onSubmit={handleSubmit}
              onCancel={onClose}
              isSubmitting={isSubmitting}
            />
          )}
        </View>
      </ScrollView>
    </Modal>
  );
}