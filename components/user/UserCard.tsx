import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { Star, MessageCircle } from 'lucide-react-native';
import { ROUTES } from '@/lib/utils/constants';
import type { User } from '@/types';
import { Card, CardContent } from '../ui/Card';
import Avatar from '../ui/Avatar';
import Button from '../ui/Button';

interface UserCardProps {
  user: User;
  averageRating?: number;
  totalAvis?: number;
  onMessage?: () => void;
}

export default function UserCard({ 
  user, 
  averageRating, 
  totalAvis, 
  onMessage 
}: UserCardProps) {
  const router = useRouter();

  const handlePress = () => {
    router.push({
      pathname: "/(protected)/user/[id]",
      params: { id: user.id.toString() }
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-5">
        {/* Profile Link Area */}
        <Pressable 
          onPress={handlePress}
          className="mb-4 active:opacity-70"
          accessibilityRole="button"
          accessibilityLabel={`Voir le profil de ${user.prenom} ${user.nom}`}
        >
          <View className="items-center">
            <Avatar
              src={user.photo || undefined}
              fallback={`${user.nom} ${user.prenom}`}
              size="lg"
              verified={user.emailVerifie}
            />
            <Text className="mt-3 font-semibold text-gray-900 dark:text-gray-100 text-center">
              {user.prenom} {user.nom}
            </Text>
            
            {user.bio && (
              <Text 
                className="mt-1 text-sm text-gray-600 dark:text-gray-400 text-center"
                numberOfLines={2}
              >
                {user.bio}
              </Text>
            )}
          </View>
        </Pressable>

        {/* Stats */}
        {averageRating !== undefined && (
          <View className="flex-row items-center justify-center gap-4 py-3 border-t border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row items-center gap-1">
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
                  ({totalAvis})
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Actions */}
        {onMessage && (
          <View className="mt-4">
            <Button
              variant="primary"
              onPress={onMessage}
              leftIcon={<MessageCircle size={16} />}
            >
              Contacter
            </Button>
          </View>
        )}
      </CardContent>
    </Card>
  );
}