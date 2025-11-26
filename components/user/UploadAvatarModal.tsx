import React, { useState } from 'react';
import { View, Text, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useAvatar } from '@/lib/hooks/useUsers';
import { useToast } from '@/lib/hooks';
import { Camera, Image as ImageIcon, Trash2 } from 'lucide-react-native';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

export interface UploadAvatarModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentAvatar?: string | null;
  userName?: string;
}

export default function UploadAvatarModal({
  isOpen,
  onClose,
  currentAvatar,
  userName
}: UploadAvatarModalProps) {
  const { uploadAvatar, deleteAvatar, isUploading } = useAvatar();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<ImagePicker.ImagePickerAsset | null>(null);
  const toast = useToast();

  // Demander les permissions
  const requestPermissions = async (type: 'camera' | 'library') => {
    if (type === 'camera') {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      if (status !== 'granted') {
        toast.error('Permission caméra refusée');
        return false;
      }
    } else {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        toast.error('Permission galerie refusée');
        return false;
      }
    }
    return true;
  };

  // Prendre une photo
  const handleTakePhoto = async () => {
    const hasPermission = await requestPermissions('camera');
    if (!hasPermission) return;

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  // Choisir depuis la galerie
  const handlePickImage = async () => {
    const hasPermission = await requestPermissions('library');
    if (!hasPermission) return;

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedImage(result.assets[0].uri);
      setImageFile(result.assets[0]);
    }
  };

  // Upload de l'avatar
  const handleUpload = async () => {
    if (!imageFile) {
      toast.error('Veuillez sélectionner une image');
      return;
    }

    // Vérifier la taille (max 5MB)
    if (imageFile.fileSize && imageFile.fileSize > 5 * 1024 * 1024) {
      toast.error('L\'image doit faire moins de 5MB');
      return;
    }

    try {
      // Créer un objet File pour l'upload
      const file = {
        uri: imageFile.uri,
        name: imageFile.fileName || 'avatar.jpg',
        type: imageFile.mimeType || 'image/jpeg',
      } as any;

      await uploadAvatar(file);
      toast.success('Avatar mis à jour avec succès');
      handleClose();
    } catch (error: any) {
      toast.error(error.message || 'Erreur lors de l\'upload');
    }
  };

  // Supprimer l'avatar
  const handleDelete = async () => {
    if (!currentAvatar) {
      toast.error('Aucun avatar à supprimer');
      return;
    }

    Alert.alert(
      'Supprimer l\'avatar',
      'Voulez-vous vraiment supprimer votre avatar ?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteAvatar();
              toast.success('Avatar supprimé avec succès');
              handleClose();
            } catch (error: any) {
              toast.error(error.message || 'Erreur lors de la suppression');
            }
          },
        },
      ]
    );
  };

  const handleClose = () => {
    setSelectedImage(null);
    setImageFile(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Modifier la photo de profil"
      size="md"
    >
      <View className="gap-6">
        {/* Avatar actuel/preview */}
        <View className="items-center gap-3">
          <Avatar
            src={selectedImage || currentAvatar}
            alt={userName || 'Avatar'}
            fallback={userName}
            size="xl"
          />
          <Text className="text-sm text-gray-500 dark:text-gray-400">
            {selectedImage ? 'Aperçu de la nouvelle photo' : 'Photo actuelle'}
          </Text>
        </View>

        {/* Actions de sélection */}
        {!selectedImage && (
          <View className="gap-3">
            <Button
              variant="outline"
              leftIcon={<Camera size={20} />}
              onPress={handleTakePhoto}
              disabled={isUploading}
            >
              Prendre une photo
            </Button>
            <Button
              variant="outline"
              leftIcon={<ImageIcon size={20} />}
              onPress={handlePickImage}
              disabled={isUploading}
            >
              Choisir depuis la galerie
            </Button>
          </View>
        )}

        {/* Info */}
        <View className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg">
          <Text className="text-xs text-blue-700 dark:text-blue-300 text-center">
            JPEG, PNG ou WebP • Maximum 5MB
          </Text>
        </View>

        {/* Actions finales */}
        <View className="gap-2">
          {/* Bouton de suppression */}
          {currentAvatar && !selectedImage && (
            <Button
              variant="outline"
              leftIcon={<Trash2 size={20} />}
              onPress={handleDelete}
              disabled={isUploading}
              className="border-error text-error"
            >
              Supprimer l&apos;avatar
            </Button>
          )}
          
          {/* Actions principales */}
          <View className="flex-row gap-2">
            <Button
              variant="outline"
              onPress={handleClose}
              disabled={isUploading}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              onPress={handleUpload}
              disabled={!selectedImage || isUploading}
              isLoading={isUploading}
              className="flex-1"
            >
              {isUploading ? 'Upload...' : 'Sauvegarder'}
            </Button>
          </View>
        </View>
      </View>
    </Modal>
  );
}