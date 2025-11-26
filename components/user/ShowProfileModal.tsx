import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Check } from 'lucide-react-native';
import type { User } from '@/types';
import Modal from '../ui/Modal';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';

export interface ShowProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
}

export default function ShowProfileModal({
  isOpen,
  onClose,
  user
}: ShowProfileModalProps) {
  if (!user) return null;

  const InfoRow = ({ label, value }: { label: string; value?: string | null }) => {
    if (!value) return null;
    return (
      <View className="gap-1">
        <Text className="text-sm font-medium text-gray-500 dark:text-gray-400">
          {label}
        </Text>
        <Text className="text-base text-gray-900 dark:text-gray-100">
          {value}
        </Text>
      </View>
    );
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Profil utilisateur"
      size="md"
    >
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 16 }}
      >
        <View className="gap-6">
          {/* Avatar et nom */}
          <View className="items-center gap-3">
            <Avatar
              src={user.photo}
              alt={`${user.prenom} ${user.nom}`}
              fallback={`${user.prenom} ${user.nom}`}
              size="xl"
              verified={user.emailVerifie && user.telephoneVerifie}
            />
            <View className="items-center">
              <Text className="text-xl font-semibold text-gray-900 dark:text-gray-100">
                {user.prenom} {user.nom}
              </Text>
              <Text className="text-sm text-gray-500 dark:text-gray-400">
                {user.email}
              </Text>
            </View>
          </View>

          {/* Badges de vérification */}
          <View className="flex-row items-center justify-center gap-2 flex-wrap">
            {user.emailVerifie && (
              <Badge variant="success" size="sm">
                <View className="flex-row items-center gap-1">
                  <Check size={14} strokeWidth={3} />
                  <Text className="text-xs font-medium">Email vérifié</Text>
                </View>
              </Badge>
            )}
            {user.telephoneVerifie && (
              <Badge variant="info" size="sm">
                <View className="flex-row items-center gap-1">
                  <Check size={14} strokeWidth={3} />
                  <Text className="text-xs font-medium">Téléphone vérifié</Text>
                </View>
              </Badge>
            )}
          </View>

          {/* Informations */}
          <View className="gap-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <InfoRow label="Téléphone" value={user.telephone} />
            <InfoRow label="Bio" value={user.bio} />
            
            {user.address && (
              <>
                <InfoRow label="Pays" value={user.address.pays} />
                <InfoRow label="Ville" value={user.address.ville} />
                <InfoRow label="Quartier" value={user.address.quartier} />
                <InfoRow label="Adresse" value={user.address.adresseLigne1} />
                <InfoRow label="Code postal" value={user.address.codePostal} />
              </>
            )}
          </View>

          {/* Date d'inscription */}
          <View className="border-t border-gray-200 dark:border-gray-700 pt-4">
            <Text className="text-xs text-gray-400 dark:text-gray-500 text-center">
              Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </Text>
          </View>
        </View>
      </ScrollView>
    </Modal>
  );
}