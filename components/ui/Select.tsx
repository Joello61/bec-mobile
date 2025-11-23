import React, { useState, useRef, useEffect, forwardRef } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  TextInput, 
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Check, ChevronDown, Search, X } from 'lucide-react-native';
import { cn } from '@/lib/utils/cn';

export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

export interface SelectProps {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  options: SelectOption[];
  value?: string;
  onChange?: (value: string) => void;
  onSearch?: (query: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  searchable?: boolean;
  required?: boolean;
}

const Select = forwardRef<View, SelectProps>(
  (
    {
      label,
      error,
      helperText,
      leftIcon,
      options,
      value,
      onChange,
      onSearch,
      placeholder = 'Sélectionner...',
      disabled,
      className,
      searchable = true,
      required,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    
    const searchTimeoutRef = useRef<any>(null);

    useEffect(() => {
      return () => {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);
      };
    }, []);

    const handleSearchChange = (query: string) => {
      setSearchQuery(query);

      if (onSearch && query.length >= 2) {
        if (searchTimeoutRef.current) clearTimeout(searchTimeoutRef.current);

        searchTimeoutRef.current = setTimeout(() => {
          const localResults = options.filter((option) =>
            option.label.toLowerCase().includes(query.toLowerCase())
          );

          if (localResults.length === 0) {
            onSearch(query);
          }
        }, 300);
      }
    };

    const handleSelect = (optionValue: string) => {
      onChange?.(optionValue);
      setIsOpen(false);
      setSearchQuery('');
    };

    const filteredOptions = searchable && searchQuery
      ? options.filter((option) =>
          option.label.toLowerCase().includes(searchQuery.toLowerCase())
        )
      : options;

    const selectedOption = options.find((opt) => opt.value === value);
    const displayText = selectedOption?.label || placeholder;

    const baseInputStyles = 'w-full flex-row items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-3';

    return (
      <View className="w-full mb-4">
        {/* 1. LABEL */}
        {label && (
          <Text className="text-sm font-medium text-gray-700 mb-1.5">
            {label}
            {required && <Text className="text-error ml-1">*</Text>}
          </Text>
        )}

        {/* 2. TRIGGER */}
        <TouchableOpacity
          ref={ref}
          onPress={() => !disabled && setIsOpen(true)}
          activeOpacity={0.7}
          className={cn(
            baseInputStyles,
            error && 'border-error',
            disabled && 'bg-gray-100 opacity-50',
            className
          )}
          disabled={disabled}
        >
          <View className="flex-row items-center flex-1 mr-2">
            {leftIcon && <View className="mr-2">{leftIcon}</View>}
            
            <Text 
              className={cn(
                'text-base', 
                !selectedOption ? 'text-gray-400' : 'text-gray-900'
              )} 
              numberOfLines={1}
            >
              {displayText}
            </Text>
          </View>

          <ChevronDown size={20} color={error ? '#ef4444' : '#9ca3af'} />
        </TouchableOpacity>

        {/* 3. MESSAGES */}
        {error ? (
          <Text className="mt-1 text-sm text-error font-medium">{error}</Text>
        ) : helperText ? (
          <Text className="mt-1 text-sm text-gray-500">{helperText}</Text>
        ) : null}

        {/* 4. MODALE DE SÉLECTION */}
        <Modal
          visible={isOpen}
          animationType="slide"
          presentationStyle="pageSheet"
          onRequestClose={() => setIsOpen(false)}
        >
          {/* SafeAreaView gère automatiquement l'encoche (notch) sur iPhone */}
          <SafeAreaView className="flex-1 bg-white">
            {/* Header Modale */}
            <View className="flex-row items-center justify-between px-4 py-4 border-b border-gray-100">
              <Text className="text-lg font-bold text-gray-900">
                {label || 'Sélectionner'}
              </Text>
              <TouchableOpacity 
                onPress={() => setIsOpen(false)}
                className="p-2 bg-gray-100 rounded-full"
              >
                <X size={20} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Barre de Recherche */}
            {searchable && (
              <View className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                <View className="flex-row items-center bg-white border border-gray-300 rounded-lg px-3 h-10">
                  <Search size={18} color="#9ca3af" />
                  <TextInput
                    className="flex-1 ml-2 text-base text-gray-900 h-full"
                    placeholder="Rechercher..."
                    value={searchQuery}
                    onChangeText={handleSearchChange}
                    autoFocus={true}
                    placeholderTextColor="#9ca3af"
                  />
                  {searchQuery.length > 0 && (
                    <TouchableOpacity onPress={() => setSearchQuery('')}>
                      <X size={16} color="#9ca3af" />
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}

            {/* Liste des Options */}
            <FlatList
              data={filteredOptions}
              keyExtractor={(item) => item.value}
              contentContainerStyle={{ paddingBottom: 40 }}
              keyboardShouldPersistTaps="handled"
              ListEmptyComponent={() => (
                <View className="items-center justify-center py-10">
                  <Text className="text-gray-500">Aucun résultat trouvé</Text>
                </View>
              )}
              renderItem={({ item }) => {
                const isSelected = item.value === value;
                return (
                  <TouchableOpacity
                    onPress={() => !item.disabled && handleSelect(item.value)}
                    disabled={item.disabled}
                    className={cn(
                      "flex-row items-center justify-between px-5 py-4 border-b border-gray-100",
                      isSelected && "bg-primary/5",
                      item.disabled && "opacity-50"
                    )}
                  >
                    <Text 
                      className={cn(
                        "text-base flex-1",
                        isSelected ? "text-primary font-bold" : "text-gray-700"
                      )}
                    >
                      {item.label}
                    </Text>
                    
                    {isSelected && (
                      <Check size={20} color="#00695c" />
                    )}
                  </TouchableOpacity>
                );
              }}
            />
          </SafeAreaView>
        </Modal>
      </View>
    );
  }
);

Select.displayName = 'Select';

export default Select;