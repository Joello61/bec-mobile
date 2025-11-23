import React from 'react';
import { View, Text, Image, type ViewProps } from 'react-native';
import { Check } from 'lucide-react-native';
import { formatImageUrl } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';

export interface AvatarProps extends ViewProps {
  src?: string | null;
  alt?: string;
  fallback?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  status?: 'online' | 'offline' | 'away' | 'busy';
  verified?: boolean;
}

export default function Avatar({
  src,
  alt = 'Avatar',
  fallback,
  size = 'md',
  status,
  verified = false,
  className,
  ...props
}: AvatarProps) {
  
  // === Dimensions du conteneur ===
  const containerSizes = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16',
  };

  // === Taille du texte (Initiales) ===
  const textSizes = {
    xs: 'text-xs',
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-2xl',
  };

  // === Badge de statut ===
  const statusColors = {
    online: 'bg-success',
    offline: 'bg-gray-400',
    away: 'bg-warning',
    busy: 'bg-error',
  };

  const statusSizes = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4',
  };

  // === Badge vérifié ===
  // Note : J'ai ajouté 'iconSize' pour passer un nombre à la prop 'size' de Lucide
  const verifiedBadge = {
    xs: { p: 'p-0', iconSize: 8, offset: '-bottom-[1px] -right-[1px]' },
    sm: { p: 'p-[2px]', iconSize: 10, offset: '-bottom-[5px] -right-[4px]' },
    md: { p: 'p-[2px]', iconSize: 12, offset: '-bottom-[3px] -right-[3px]' },
    lg: { p: 'p-1', iconSize: 14, offset: '-bottom-[4px] -right-[4px]' },
    xl: { p: 'p-1.5', iconSize: 18, offset: '-bottom-[5px] -right-[5px]' },
  };

  const { p, iconSize, offset } = verifiedBadge[size];

  // === Initiales fallback ===
  const getInitials = (name: string) =>
    name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);

  const initials = fallback ? getInitials(fallback) : '?';
  const formattedSrc = formatImageUrl(src);

  return (
    <View className={cn('relative', className)} {...props}>
      {/* Cercle Principal */}
      <View
        className={cn(
          'rounded-full items-center justify-center overflow-hidden bg-gray-100', // bg-gray-100 par défaut si chargement
          containerSizes[size],
          !src && 'bg-primary' // Fond vert si pas d'image (juste initiales)
        )}
      >
        {formattedSrc ? (
          <Image
            source={{ uri: formattedSrc }}
            accessibilityLabel={alt}
            resizeMode="cover"
            className="w-full h-full"
          />
        ) : (
          <Text className={cn('font-medium text-white text-center', textSizes[size])}>
            {initials}
          </Text>
        )}
      </View>

      {/* Badge de statut */}
      {status && (
        <View
          className={cn(
            'absolute bottom-0 right-0 rounded-full border-2 border-white',
            statusColors[status],
            statusSizes[size]
          )}
          accessibilityLabel={`Statut: ${status}`}
        />
      )}

      {/* Badge vérifié */}
      {verified && (
        <View
          className={cn(
            'absolute bg-info items-center justify-center rounded-full border-2 border-white shadow-sm',
            p,
            offset
          )}
          accessibilityLabel="Compte vérifié"
        >
          <Check size={iconSize} color="white" strokeWidth={3} />
        </View>
      )}
    </View>
  );
}