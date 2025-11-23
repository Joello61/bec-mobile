import React, { createContext, useContext, useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  type ViewProps 
} from 'react-native';
import { cn } from '@/lib/utils/cn';

// === CONTEXTE ===
interface TabsContextType {
  value: string;
  onValueChange: (value: string) => void;
}

const TabsContext = createContext<TabsContextType | null>(null);

function useTabs() {
  const context = useContext(TabsContext);
  if (!context) {
    throw new Error('Tabs compound components must be used within a Tabs component');
  }
  return context;
}

// === TABS ROOT ===
export interface TabsProps extends ViewProps {
  defaultValue: string;
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
}

export function Tabs({ 
  defaultValue, 
  value, 
  onValueChange, 
  children, 
  className,
  ...props 
}: TabsProps) {
  const [internalValue, setInternalValue] = useState(defaultValue);

  const activeValue = value !== undefined ? value : internalValue;
  const handleValueChange = onValueChange || setInternalValue;

  return (
    <TabsContext.Provider value={{ value: activeValue, onValueChange: handleValueChange }}>
      <View className={cn('w-full', className)} {...props}>
        {children}
      </View>
    </TabsContext.Provider>
  );
}

// === TABS LIST (Le conteneur des boutons) ===
export interface TabsListProps extends ViewProps {
  children: React.ReactNode;
}

export function TabsList({ children, className, ...props }: TabsListProps) {
  return (
    <View className={cn('border-b border-gray-200 mb-4', className)} {...props}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 4 }}
      >
        {children}
      </ScrollView>
    </View>
  );
}

// === TABS TRIGGER (Un bouton d'onglet) ===
export interface TabsTriggerProps extends React.ComponentProps<typeof TouchableOpacity> {
  value: string;
  title: string;
  icon?: React.ReactNode;
}

export function TabsTrigger({ 
  value, 
  title, 
  icon, 
  className, 
  disabled,
  ...props 
}: TabsTriggerProps) {
  const context = useTabs();
  const isActive = context.value === value;

  return (
    <TouchableOpacity
      onPress={() => !disabled && context.onValueChange(value)}
      disabled={disabled}
      activeOpacity={0.7}
      className={cn(
        'flex-row items-center justify-center px-4 py-3 mr-2 border-b-2',
        isActive ? 'border-primary' : 'border-transparent',
        disabled && 'opacity-50',
        className
      )}
      {...props}
    >
      {icon && <View className="mr-2">{icon}</View>}
      <Text
        className={cn(
          'text-sm font-medium',
          isActive ? 'text-primary font-bold' : 'text-gray-500'
        )}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

// === TABS CONTENT (Le contenu affiché) ===
export interface TabsContentProps extends ViewProps {
  value: string;
  children: React.ReactNode;
}

export function TabsContent({ value, children, className, ...props }: TabsContentProps) {
  const context = useTabs();
  
  if (context.value !== value) {
    return null;
  }

  return (
    <View className={cn('w-full', className)} {...props}>
      {children}
    </View>
  );
}