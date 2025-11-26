import React from 'react';
import { View, Text } from 'react-native';
import { MapPin, Home, Building2, Mail as MailIcon, Edit2, Calendar } from 'lucide-react-native';
import type { Address } from '@/types/address';
import { formatDate } from '@/lib/utils/format';
import { Card } from '../ui/Card';
import Button from '../ui/Button';
import Badge from '../ui/Badge';

interface AddressCardProps {
  address: Address;
  canModify: boolean;
  nextModificationDate?: string | null;
  onEdit?: () => void;
  showEditButton?: boolean;
}

export default function AddressCard({ 
  address, 
  canModify,
  nextModificationDate,
  onEdit,
  showEditButton = true 
}: AddressCardProps) {
  const addressType = address.quartier ? 'african' : 'postal';

  return (
    <Card className="p-6">
      <View className="flex-row items-start justify-between mb-4">
        <View className="flex-1">
          <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            Mon adresse
          </Text>
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {addressType === 'african' ? 'Format Afrique' : 'Format International'}
          </Text>
        </View>
        {showEditButton && onEdit && (
          <Button
            variant="outline"
            size="sm"
            leftIcon={<Edit2 size={16} />}
            onPress={onEdit}
            disabled={!canModify}
          >
            Modifier
          </Button>
        )}
      </View>

      <View className="gap-3">
        {/* Pays */}
        <View className="flex-row items-start gap-3">
          <MapPin 
            size={20} 
            className="text-gray-400 dark:text-gray-500 mt-0.5" 
          />
          <View className="flex-1">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Pays</Text>
            <Text className="font-medium text-gray-900 dark:text-gray-100">
              {address.pays}
            </Text>
          </View>
        </View>

        {/* Ville */}
        <View className="flex-row items-start gap-3">
          <Building2 
            size={20} 
            className="text-gray-400 dark:text-gray-500 mt-0.5" 
          />
          <View className="flex-1">
            <Text className="text-sm text-gray-600 dark:text-gray-400">Ville</Text>
            <Text className="font-medium text-gray-900 dark:text-gray-100">
              {address.ville}
            </Text>
          </View>
        </View>

        {/* Format Afrique - Quartier */}
        {address.quartier && (
          <View className="flex-row items-start gap-3">
            <Home 
              size={20} 
              className="text-gray-400 dark:text-gray-500 mt-0.5" 
            />
            <View className="flex-1">
              <Text className="text-sm text-gray-600 dark:text-gray-400">Quartier</Text>
              <Text className="font-medium text-gray-900 dark:text-gray-100">
                {address.quartier}
              </Text>
            </View>
          </View>
        )}

        {/* Format Diaspora - Adresse complète */}
        {address.adresseLigne1 && (
          <>
            <View className="flex-row items-start gap-3">
              <Home 
                size={20} 
                className="text-gray-400 dark:text-gray-500 mt-0.5" 
              />
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Adresse</Text>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {address.adresseLigne1}
                </Text>
                {address.adresseLigne2 && (
                  <Text className="font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                    {address.adresseLigne2}
                  </Text>
                )}
              </View>
            </View>

            <View className="flex-row items-start gap-3">
              <MailIcon 
                size={20} 
                className="text-gray-400 dark:text-gray-500 mt-0.5" 
              />
              <View className="flex-1">
                <Text className="text-sm text-gray-600 dark:text-gray-400">Code postal</Text>
                <Text className="font-medium text-gray-900 dark:text-gray-100">
                  {address.codePostal}
                </Text>
              </View>
            </View>
          </>
        )}
      </View>

      {/* Informations de modification */}
      <View className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
        <View className="flex-row items-center gap-2">
          <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
          <Text className="text-sm text-gray-600 dark:text-gray-400">
            {address.lastModifiedAt ? (
              <>Dernière modification : {formatDate(address.lastModifiedAt)}</>
            ) : (
              <>Jamais modifiée</>
            )}
          </Text>
        </View>

        {!canModify && nextModificationDate && (
          <View className="mt-2">
            <Badge variant="warning">
              Prochaine modification possible le {new Date(nextModificationDate).toLocaleDateString('fr-FR')}
            </Badge>
          </View>
        )}

        {canModify && (
          <View className="mt-2">
            <Badge variant="success">
              Modification autorisée
            </Badge>
          </View>
        )}
      </View>
    </Card>
  );
}