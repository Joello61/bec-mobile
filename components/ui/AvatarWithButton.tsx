import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { cn } from '@/lib/utils/cn';
import Avatar, { type AvatarProps } from './Avatar';
import { Camera, Info } from 'lucide-react-native';

export interface AvatarWithButtonProps extends AvatarProps {
  buttonType?: 'camera' | 'info';
  onButtonClick?: () => void;
}

export default function AvatarWithButton({
  buttonType = 'camera',
  onButtonClick,
  className,
  size = 'md',
  ...avatarProps
}: AvatarWithButtonProps) {
  
  // Configuration des tailles (Icône + Padding du bouton)
  const buttonConfig = {
    xs: { iconSize: 10, padding: 'p-1', offset: '-bottom-1 -right-1' },
    sm: { iconSize: 12, padding: 'p-1', offset: '-bottom-1 -right-1' },
    md: { iconSize: 14, padding: 'p-1.5', offset: '-bottom-1 -right-1' },
    lg: { iconSize: 16, padding: 'p-1.5', offset: '-bottom-1 -right-1' },
    xl: { iconSize: 20, padding: 'p-2', offset: '-bottom-1 -right-1' },
  };

  const offsetConfig = {
    xs: 'bottom-[-2px] right-[-2px]',
    sm: 'bottom-[-2px] right-[-2px]',
    md: 'bottom-[-2px] right-[-2px]',
    lg: 'bottom-[0px] right-[0px]',
    xl: 'bottom-[2px] right-[2px]',
  };

  const { iconSize, padding } = buttonConfig[size] || buttonConfig.md;
  const offset = offsetConfig[size] || offsetConfig.md;

  const IconComponent = buttonType === 'camera' ? Camera : Info;
  const buttonTitle = buttonType === 'camera' ? 'Modifier la photo' : 'Voir le profil';

  // Couleurs du bouton
  const buttonColors = buttonType === 'camera'
    ? 'bg-primary border-white'
    : 'bg-gray-100 border-white';

  const iconColor = buttonType === 'camera' ? 'white' : '#374151'; 

  return (
    <View className={cn('relative', className)}>
      {/* Composant Avatar de base */}
      <Avatar size={size} {...avatarProps} />

      {/* Bouton flottant */}
      <TouchableOpacity
        onPress={onButtonClick}
        activeOpacity={0.8}
        accessibilityLabel={buttonTitle}
        className={cn(
          'absolute rounded-full border-2 shadow-sm items-center justify-center',
          buttonColors,
          padding,
          offset
        )}
      >
        <IconComponent size={iconSize} color={iconColor} strokeWidth={2} />
      </TouchableOpacity>
    </View>
  );
}