import React from 'react';
import { Text, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Bell } from 'lucide-react-native';
import { ROUTES } from '@/lib/utils/constants';

interface NotificationBellProps {
  count: number;
  onClick?: () => void;
  asLink?: boolean;
}

export default function NotificationBell({ 
  count, 
  onClick, 
  asLink = true 
}: NotificationBellProps) {
  const router = useRouter();
  const scale = useSharedValue(1);
  const badgeScale = useSharedValue(0);
  const hasNotifications = count > 0;

  // Animation du badge à l'apparition
  React.useEffect(() => {
    if (hasNotifications) {
      badgeScale.value = withSequence(
        withSpring(1.2, { damping: 8 }),
        withSpring(1, { damping: 10 })
      );
    } else {
      badgeScale.value = withSpring(0, { damping: 10 });
    }
  }, [hasNotifications, count]);

  const handlePress = () => {
    // Animation du press
    scale.value = withSequence(
      withSpring(0.9, { damping: 10 }),
      withSpring(1, { damping: 10 })
    );

    if (onClick) {
      onClick();
    } else if (asLink) {
      router.push("/(protected)/notifications");
    }
  };

  const animatedButtonStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const animatedBadgeStyle = useAnimatedStyle(() => ({
    transform: [{ scale: badgeScale.value }],
  }));

  return (
    <Animated.View style={animatedButtonStyle}>
      <Pressable
        onPress={handlePress}
        className="relative p-2 rounded-lg active:bg-gray-100 dark:active:bg-gray-800"
        accessibilityRole="button"
        accessibilityLabel={`${count} notifications non lues`}
        accessibilityHint="Appuyez pour voir vos notifications"
      >
        <Bell 
          size={24} 
          className="text-gray-700 dark:text-gray-300" 
        />
        
        {hasNotifications && (
          <Animated.View
            style={animatedBadgeStyle}
            className="absolute -top-1 -right-1 w-5 h-5 bg-error dark:bg-red-500 rounded-full flex items-center justify-center"
          >
            <Text className="text-white text-xs font-medium">
              {count > 9 ? '9+' : count}
            </Text>
          </Animated.View>
        )}
      </Pressable>
    </Animated.View>
  );
}