import React from 'react';
import { View, Text } from 'react-native';
import { Mail, Phone, Calendar, Star, Edit } from 'lucide-react-native';
import { formatDate, formatPhone } from '@/lib/utils/format';
import type { User } from '@/types';
import { Card } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Badge from '../ui/Badge';
import Button from '../ui/Button';

interface UserProfileHeaderProps {
  user: User;
  averageRating?: number;
  totalAvis?: number;
  isOwnProfile?: boolean;
  onEdit?: () => void;
  onMessage?: () => void;
}

export default function UserProfileHeader({
  user,
  averageRating,
  totalAvis,
  isOwnProfile = false,
  onEdit,
  onMessage,
}: UserProfileHeaderProps) {
  return (
    <Card className="p-6">
      <View className="gap-6">
        {/* Header: Avatar + Info principale */}
        <View className="flex-row gap-6">
          {/* Avatar */}
          <View>
            <Avatar
              src={user.photo || undefined}
              fallback={`${user.nom} ${user.prenom}`}
              size="xl"
              verified={user.emailVerifie}
            />
          </View>

          {/* Info principale */}
          <View className="flex-1">
            <View className="gap-2 mb-3">
              <Text className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {user.prenom} {user.nom}
              </Text>

              {/* Badges de vérification */}
              <View className="flex-row flex-wrap gap-2">
                {user.emailVerifie && (
                  <Badge variant="success" size="sm">
                    Email vérifié
                  </Badge>
                )}
                {user.telephoneVerifie && (
                  <Badge variant="success" size="sm">
                    Téléphone vérifié
                  </Badge>
                )}
              </View>

              {/* Rating */}
              {averageRating !== undefined && (
                <View className="flex-row items-center gap-2">
                  <Star 
                    size={16} 
                    className="text-amber-500 dark:text-amber-400"
                    fill="currentColor"
                  />
                  <Text className="text-sm font-medium text-gray-900 dark:text-gray-100">
                    {averageRating.toFixed(1)}
                  </Text>
                  {totalAvis !== undefined && (
                    <Text className="text-sm text-gray-500 dark:text-gray-400">
                      ({totalAvis} avis)
                    </Text>
                  )}
                </View>
              )}
            </View>
          </View>
        </View>

        {/* Actions */}
        <View className="flex-row gap-2">
          {isOwnProfile && onEdit ? (
            <Button
              variant="outline"
              onPress={onEdit}
              leftIcon={<Edit size={16} />}
              className="flex-1"
            >
              Modifier
            </Button>
          ) : (
            onMessage && (
              <Button 
                variant="primary" 
                onPress={onMessage}
                className="flex-1"
              >
                Contacter
              </Button>
            )
          )}
        </View>

        {/* Bio */}
        {user.bio && (
          <View className="pt-4 border-t border-gray-200 dark:border-gray-700">
            <Text className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {user.bio}
            </Text>
          </View>
        )}

        {/* Contact Info */}
        <View className="gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          {/* Email */}
          <View className="flex-row items-center gap-2">
            <Mail size={16} className="text-gray-600 dark:text-gray-400" />
            <Text className="text-sm text-gray-600 dark:text-gray-400 flex-1">
              {user.email}
            </Text>
          </View>

          {/* Téléphone */}
          {user.telephone && (
            <View className="flex-row items-center gap-2">
              <Phone size={16} className="text-gray-600 dark:text-gray-400" />
              <Text className="text-sm text-gray-600 dark:text-gray-400">
                {formatPhone(user.telephone)}
              </Text>
            </View>
          )}

          {/* Date d'inscription */}
          <View className="flex-row items-center gap-2">
            <Calendar size={16} className="text-gray-600 dark:text-gray-400" />
            <Text className="text-sm text-gray-600 dark:text-gray-400">
              Membre depuis {formatDate(user.createdAt)}
            </Text>
          </View>
        </View>
      </View>
    </Card>
  );
}