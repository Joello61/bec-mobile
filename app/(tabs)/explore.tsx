import { Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ExploreScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <Text className="font-heading text-3xl font-bold text-foreground mb-4">
          Explorer
        </Text>
        <Text className="font-sans text-muted">
          Découvrez les voyages et demandes disponibles.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}