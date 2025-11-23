import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Star } from 'lucide-react-native';

// Composants UI
import Button from '@/components/ui/Button';
import Modal from '@/components/ui/Modal'; // Notre Modal native créée précédemment

// Validation & Types
import { createAvisSchema, type CreateAvisFormData } from '@/lib/validations/avis.schema';
import { cn } from '@/lib/utils/cn';

interface AvisFormProps {
  isOpen: boolean;
  onClose: () => void;
  cibleId: number;
  cibleNom: string;
  voyageId?: number;
  onSubmit: (data: CreateAvisFormData) => Promise<void>;
}

export default function AvisForm({ 
  isOpen, 
  onClose, 
  cibleId, 
  cibleNom,
  voyageId, 
  onSubmit 
}: AvisFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm<CreateAvisFormData>({
    resolver: zodResolver(createAvisSchema),
    defaultValues: {
      cibleId,
      voyageId,
      note: 0,
      commentaire: '',
    },
  });

  const handleFormSubmit = async (data: CreateAvisFormData) => {
    Keyboard.dismiss(); // Fermer le clavier avant de soumettre
    setIsSubmitting(true);
    try {
      await onSubmit(data);
      reset();
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Composant Interne pour les Étoiles
  const StarInput = ({ value, onChange }: { value: number, onChange: (v: number) => void }) => {
    return (
      <View className="flex-row justify-center gap-2">
        {[1, 2, 3, 4, 5].map((starIndex) => (
          <TouchableOpacity
            key={starIndex}
            onPress={() => onChange(starIndex)}
            activeOpacity={0.7}
          >
            <Star
              size={36} // Taille 'lg'
              color={starIndex <= value ? '#ffb300' : '#d1d5db'} // Secondary (Jaune) ou Gris
              fill={starIndex <= value ? '#ffb300' : 'transparent'} // Remplissage si actif
              strokeWidth={starIndex <= value ? 0 : 2} // Pas de bordure si rempli
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={`Avis pour ${cibleNom}`}
      size="md"
    >
      <View className="py-2">
        {/* 1. NOTE (Rating) */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-3 text-center">
            Note <Text className="text-error">*</Text>
          </Text>
          
          <Controller
            control={control}
            name="note"
            render={({ field: { onChange, value } }) => (
              <StarInput value={value} onChange={onChange} />
            )}
          />
          
          {errors.note && (
            <Text className="mt-2 text-sm text-error text-center">
              {errors.note.message}
            </Text>
          )}
        </View>

        {/* 2. COMMENTAIRE (Textarea) */}
        <View className="mb-6">
          <Text className="text-sm font-medium text-gray-700 mb-2">
            Commentaire
          </Text>
          
          <Controller
            control={control}
            name="commentaire"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                className={cn(
                  "w-full bg-white border border-gray-300 rounded-lg px-4 py-3 text-base text-gray-900",
                  "h-32", // Hauteur fixe pour simuler rows={5}
                  errors.commentaire && "border-error"
                )}
                placeholder="Partagez votre expérience avec ce voyageur..."
                placeholderTextColor="#9ca3af"
                multiline={true}
                numberOfLines={5}
                textAlignVertical="top" // CRUCIAL sur Android pour que le texte commence en haut
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
              />
            )}
          />

          {errors.commentaire ? (
            <Text className="mt-1 text-sm text-error">
              {errors.commentaire.message}
            </Text>
          ) : (
            <Text className="mt-1 text-xs text-gray-500">
              Optionnel - Décrivez votre expérience
            </Text>
          )}
        </View>

        {/* 3. ACTIONS */}
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
              variant="primary" 
              onPress={handleSubmit(handleFormSubmit)} 
              isLoading={isSubmitting}
              disabled={isSubmitting}
            >
              Publier
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}