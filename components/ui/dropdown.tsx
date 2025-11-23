import React, { useState, useRef, createContext, useContext } from 'react';
import { 
  View, 
  Text, 
  Modal, 
  TouchableOpacity, 
  TouchableWithoutFeedback, 
  Platform, 
  Dimensions,
  type ViewStyle
} from 'react-native';
import { cn } from '@/lib/utils/cn';

// === CONTEXTE ===
interface DropdownContextType {
  closeDropdown: () => void;
}

const DropdownContext = createContext<DropdownContextType | null>(null);

const useDropdown = () => {
  const context = useContext(DropdownContext);
  if (!context) {
    throw new Error('useDropdown must be used within a Dropdown');
  }
  return context;
};

// === TYPES ===
export interface DropdownProps {
  trigger: React.ReactNode;
  children: React.ReactNode;
  align?: 'left' | 'right';
  className?: string;
}

// === COMPOSANT PRINCIPAL ===
export default function Dropdown({
  trigger,
  children,
  align = 'left',
  className
}: DropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0, right: 0, width: 0 });
  const triggerRef = useRef<View>(null);

  const openDropdown = () => {
    // On mesure la position du bouton sur l'écran global
    triggerRef.current?.measureInWindow((x, y, width, height) => {
      setPosition({
        top: y + height + (Platform.OS === 'android' ? 0 : 0), // Ajustement possible si barre d'état
        left: x,
        right: Dimensions.get('window').width - (x + width),
        width: width
      });
      setIsOpen(true);
    });
  };

  const closeDropdown = () => {
    setIsOpen(false);
  };

  // Calcul du style dynamique pour positionner le menu
  const dropdownStyle: ViewStyle = {
    position: 'absolute',
    top: position.top + 4, // Petit espacement vertical
  };

  if (align === 'left') {
    dropdownStyle.left = position.left;
  } else {
    dropdownStyle.right = position.right;
  }

  return (
    <DropdownContext.Provider value={{ closeDropdown }}>
      {/* 1. LE TRIGGER (Bouton) */}
      <View 
        ref={triggerRef} 
        // On enveloppe dans une View collapsable false pour assurer que la mesure fonctionne
        collapsable={false} 
        className={cn('relative', className)}
      >
        <TouchableOpacity onPress={openDropdown} activeOpacity={0.7}>
          {trigger}
        </TouchableOpacity>
      </View>

      {/* 2. LA MODALE (Overlay) */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        onRequestClose={closeDropdown}
      >
        {/* Fond transparent cliquable pour fermer */}
        <TouchableWithoutFeedback onPress={closeDropdown}>
          <View className="flex-1 bg-transparent">
            
            {/* Le Menu Flottant */}
            {/* On empêche le clic sur le menu de fermer la modale */}
            <TouchableWithoutFeedback>
              <View
                style={[dropdownStyle, { minWidth: 200, maxWidth: 300 }]}
                className="bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
              >
                {children}
              </View>
            </TouchableWithoutFeedback>

          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </DropdownContext.Provider>
  );
}

// === ITEMS ===
export interface DropdownItemProps {
  children: React.ReactNode;
  onClick?: () => void;
  icon?: React.ReactNode;
  danger?: boolean;
  disabled?: boolean;
  className?: string;
  closeOnClick?: boolean;
}

export function DropdownItem({
  children,
  onClick,
  icon,
  danger = false,
  disabled = false,
  className,
  closeOnClick = true
}: DropdownItemProps) {
  const { closeDropdown } = useDropdown();

  const handlePress = () => {
    if (!disabled) {
      onClick?.();
      if (closeOnClick) {
        closeDropdown();
      }
    }
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={0.7}
      className={cn(
        'flex-row items-center px-4 py-3',
        disabled && 'opacity-50',
        className
      )}
    >
      {icon && (
        <View className="mr-3">
          {icon}
        </View>
      )}
      <Text
        className={cn(
          'text-base font-medium',
          danger ? 'text-error' : 'text-gray-700'
        )}
      >
        {children}
      </Text>
    </TouchableOpacity>
  );
}

// === DIVIDER ===
export function DropdownDivider() {
  return <View className="h-[1px] bg-gray-200 my-1" />;
}

// === LABEL ===
export function DropdownLabel({ children }: { children: React.ReactNode }) {
  return (
    <View className="px-4 py-2">
      <Text className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        {children}
      </Text>
    </View>
  );
}