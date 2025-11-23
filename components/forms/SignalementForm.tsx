import React, { useState } from 'react';
import { View, Text, TextInput, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { AlertCircle } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal';
import Select from '@/components/ui/Select';

// Validation & Types
// Note: Assurez-vous que ce fichier existe, sinon pointez vers @/lib/validations
import { createSignalementSchema, type CreateSignalementFormData } from '@/lib/validations/signalement.schema';
import { cn } from '@/lib/utils/cn';

interface SignalementFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreateSignalementFormData) => Promise<void>;
  voyageId?: number;
  demandeId?: number;
  messageId?: number;
  utilisateurSignaleId?: number;
}

const SIGNALEMENT_MOTIFS = [
  { value: 'contenu_inapproprie', label: 'Contenu inapproprié' },
  { value: 'spam', label: 'Spam ou publicité' },
  { value: 'arnaque', label: 'Arnaque ou fraude' },
  { value: 'objet_illegal', label: 'Objet illégal' },
  { value: 'autre', label: 'Autre' },
] as const;

export default function SignalementForm({
  isOpen,
  onClose,
  onSubmit,
  voyageId,
  demandeId,
  messageId,
  utilisateurSignaleId,
}: SignalementFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CreateSignalementFormData>({
    resolver: zodResolver(createSignalementSchema),
    defaultValues: {
      voyageId,
      demandeId,
      messageId,
      utilisateurSignaleId,
      motif: 'contenu_inapproprie',
      description: '',
    },
  });

  const handleFormSubmit = async (data: CreateSignalementFormData) => {
    Keyboard.dismiss(); // Ferme le clavier pour voir le bouton
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  // Déterminer le type d'entité pour le titre
  const getEntityType = () => {
    if (voyageId) return 'ce voyage';
    if (demandeId) return 'cette demande';
    if (messageId) return 'ce message';
    if (utilisateurSignaleId) return 'cet utilisateur';
    return 'cet élément';
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Signaler ${getEntityType()}`}
      size="md"
    >
      <View className="py-2">
        
        {/* Avertissement */}
        <View className="flex-row gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg mb-5">
          <AlertCircle size={22} color="#d97706" style={{ marginTop: 2 }} />
          <View className="flex-1">
            <Text className="text-sm font-bold text-amber-900 mb-1">
              Signalement sérieux uniquement
            </Text>
            <Text className="text-xs text-amber-800 leading-4">
              Signalez uniquement les contenus qui violent nos conditions d'utilisation. 
              Les signalements abusifs peuvent entraîner des sanctions sur votre compte.
            </Text>
          </View>
        </View>

        {/* Motif */}
        <View className="mb-4">
          <Controller
            name="motif"
            control={control}
            render={({ field: { onChange, value } }) => (
              <Select
                label="Motif du signalement"
                required
                options={SIGNALEMENT_MOTIFS.map((motif) => ({
                  value: motif.value,
                  label: motif.label
                }))}
                value={value}
                onChange={onChange}
                error={errors.motif?.message}
                searchable={false} // Liste courte, pas besoin de recherche
              />
            )}
          />
        </View>

        {/* Description */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Description détaillée <Text className="text-error">*</Text>
          </Text>
          
          <Controller
            control={control}
            name="description"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={cn(
                  "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900",
                  "h-32", // Hauteur fixe pour simuler rows={6}
                  errors.description && "border-error"
                )}
                placeholder="Décrivez en détail la raison de votre signalement (minimum 20 caractères)..."
                placeholderTextColor="#9ca3af"
                multiline
                numberOfLines={6}
                textAlignVertical="top" // Important pour Android
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors.description ? (
            <Text className="mt-1 text-sm text-error">
              {errors.description.message}
            </Text>
          ) : (
            <Text className="mt-1 text-xs text-gray-500">
              Minimum 20 caractères, maximum 1000 caractères
            </Text>
          )}
        </View>

        {/* Actions */}
        <View className="flex-row gap-3 pt-2">
          <View className="flex-1">
            <Button
              variant="outline"
              onPress={onClose}
              disabled={isSubmitting}
            >
              Annuler
            </Button>
          </View>
          <View className="flex-1">
            <Button
              variant="danger" // Style rouge pour action critique
              onPress={handleSubmit(handleFormSubmit)}
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Envoyer
            </Button>
          </View>
        </View>

      </View>
    </Modal>
  );
}