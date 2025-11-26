import React, { useState, useRef, useEffect } from 'react';
import { View, Pressable } from 'react-native';
import { Search, X } from 'lucide-react-native';
import Input from '../ui/Input';

interface SearchBarProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  defaultValue?: string;
  debounceMs?: number;
}

export default function SearchBar({ 
  placeholder = 'Rechercher...', 
  onSearch,
  defaultValue = '',
  debounceMs = 300 
}: SearchBarProps) {
  const [query, setQuery] = useState(defaultValue);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleChange = (value: string) => {
    setQuery(value);

    // Clear previous timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    // Set new debounced search
    timeoutRef.current = setTimeout(() => {
      onSearch(value);
    }, debounceMs);
  };

  const handleClear = () => {
    setQuery('');
    onSearch('');
    
    // Clear any pending search
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  return (
    <View className="relative">
      <Input
        value={query}
        onChangeText={handleChange}
        placeholder={placeholder}
        leftIcon={<Search size={20} className="text-muted" />}
        rightIcon={
          query ? (
            <Pressable
              onPress={handleClear}
              className="p-1 rounded active:opacity-70"
              accessibilityLabel="Effacer"
              accessibilityRole="button"
            >
              <X size={16} className="text-muted" />
            </Pressable>
          ) : undefined
        }
        autoCapitalize="none"
        autoCorrect={false}
        returnKeyType="search"
        onSubmitEditing={() => onSearch(query)}
      />
    </View>
  );
}