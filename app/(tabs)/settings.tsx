import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function SettingsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="p-6">
        <Text className="font-heading text-3xl font-bold text-foreground mb-4">
          Paramètres
        </Text>
        <Text className="font-sans text-muted">
          Configurez votre application.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}