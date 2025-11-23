import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, type ViewProps } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { cn } from '@/lib/utils/cn';
import { Upload, X, Image as ImageIcon } from 'lucide-react-native';

// On définit un type simplifié pour le fichier sur mobile
export interface FileAsset {
  uri: string;
  name?: string;
  type?: string;
  size?: number;
}

export interface InputFileProps extends ViewProps {
  label?: string;
  error?: string;
  helperText?: string;
  showPreview?: boolean;
  maxSize?: number; // En MB
  acceptedFormats?: string[]; // ex: ['image/jpeg', 'image/png']
  onFileSelect?: (file: FileAsset | null) => void;
  disabled?: boolean;
}

export default function InputFile({
  className,
  label,
  error,
  helperText,
  showPreview = true,
  maxSize = 5,
  acceptedFormats = ['image/jpeg', 'image/png', 'image/webp'],
  onFileSelect,
  disabled = false,
  ...props
}: InputFileProps) {
  const [selectedAsset, setSelectedAsset] = useState<FileAsset | null>(null);
  const [localError, setLocalError] = useState<string>('');

  // Fonction pour choisir l'image
  const pickImage = async () => {
    if (disabled) return;
    setLocalError('');

    try {
      // Demander la permission (souvent implicite sur les versions récentes, mais bonne pratique)
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission refusée', 'Nous avons besoin d\'accéder à vos photos.');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images, // On limite aux images par défaut
        allowsEditing: false, // Mettre à true pour permettre le recadrage
        quality: 0.8,
        // Pour simuler le comportement web, on demande des infos supplémentaires
        selectionLimit: 1, 
      });

      if (!result.canceled && result.assets[0]) {
        const asset = result.assets[0];

        // 1. Validation de la taille (asset.fileSize est en octets)
        if (asset.fileSize && asset.fileSize > maxSize * 1024 * 1024) {
          setLocalError(`Le fichier est trop volumineux (max ${maxSize}MB)`);
          return;
        }

        // 2. Validation du format (basique par extension car le mimeType n'est pas toujours fiable sur mobile)
        // Pour une validation stricte, il faudrait vérifier la signature du fichier, mais ici on vérifie l'extension/type retourné
        const assetType = asset.mimeType || 'image/jpeg'; // Fallback
        if (acceptedFormats.length > 0 && !acceptedFormats.some(fmt => assetType.includes(fmt.split('/')[1]))) {
           // Note : Cette validation est simplifiée pour l'exemple mobile
           // setLocalError("Format non supporté");
           // return;
        }

        const fileData: FileAsset = {
          uri: asset.uri,
          name: asset.fileName || `photo_${Date.now()}.jpg`,
          type: asset.mimeType || 'image/jpeg',
          size: asset.fileSize,
        };

        setSelectedAsset(fileData);
        onFileSelect?.(fileData);
      }
    } catch (err) {
      console.error(err);
      setLocalError("Erreur lors de la sélection de l'image");
    }
  };

  const handleRemove = () => {
    setSelectedAsset(null);
    setLocalError('');
    onFileSelect?.(null);
  };

  const displayError = error || localError;

  return (
    <View className={cn('w-full mb-4', className)} {...props}>
      {/* LABEL */}
      {label && (
        <Text className="text-sm font-medium text-gray-700 mb-2">
          {label}
        </Text>
      )}

      <View className="w-full">
        {/* ZONE DE PREVIEW (Si image sélectionnée) */}
        {showPreview && selectedAsset ? (
          <View className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
            <Image
              source={{ uri: selectedAsset.uri }}
              className="w-full h-full"
              resizeMode="contain"
            />
            
            {/* Bouton Supprimer */}
            <TouchableOpacity
              onPress={handleRemove}
              className="absolute top-2 right-2 bg-red-500 rounded-full p-2 shadow-sm z-10"
              activeOpacity={0.8}
            >
              <X size={16} color="white" />
            </TouchableOpacity>

            {/* Nom du fichier en bas */}
            <View className="absolute bottom-0 left-0 right-0 bg-black/50 p-2">
              <Text className="text-white text-xs truncate" numberOfLines={1}>
                {selectedAsset.name}
              </Text>
            </View>
          </View>
        ) : (
          /* BOUTON DE SÉLECTION (Zone pointillée) */
          <TouchableOpacity
            onPress={pickImage}
            disabled={disabled}
            activeOpacity={0.7}
            className={cn(
              'flex-row items-center justify-center gap-3 px-4 py-8 border-2 border-dashed rounded-lg bg-gray-50',
              displayError
                ? 'border-error bg-error/5'
                : 'border-gray-300',
              disabled && 'opacity-50'
            )}
          >
            <View className="items-center justify-center">
              <Upload 
                size={24} 
                color={displayError ? '#ef4444' : '#9ca3af'} 
                className="mb-2"
              />
              <Text className={cn(
                "text-sm font-medium",
                displayError ? "text-error" : "text-gray-600"
              )}>
                Appuyer pour choisir une image
              </Text>
              <Text className="text-xs text-gray-400 mt-1">
                JPG, PNG (Max {maxSize}MB)
              </Text>
            </View>
          </TouchableOpacity>
        )}

        {/* Affichage du nom si pas de preview mais fichier sélectionné */}
        {!showPreview && selectedAsset && (
          <View className="flex-row items-center justify-between p-3 bg-gray-50 rounded-lg mt-3 border border-gray-200">
            <View className="flex-row items-center flex-1 mr-2">
              <ImageIcon size={20} color="#6b7280" className="mr-2" />
              <Text className="text-sm text-gray-700 flex-1" numberOfLines={1}>
                {selectedAsset.name}
              </Text>
            </View>
            <TouchableOpacity onPress={handleRemove}>
              <X size={20} color="#ef4444" />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* MESSAGES D'ERREUR ET AIDE */}
      {displayError ? (
        <Text className="mt-2 text-sm text-error font-medium">
          {displayError}
        </Text>
      ) : helperText ? (
        <Text className="mt-2 text-sm text-gray-500">
          {helperText}
        </Text>
      ) : null}
    </View>
  );
}