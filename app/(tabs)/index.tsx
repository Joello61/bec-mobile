import { Link } from 'expo-router';
import { LogIn } from 'lucide-react-native';
import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen() {
  return (
    <SafeAreaView className="flex-1 bg-background" edges={['top']}>
      <ScrollView 
        contentContainerStyle={{ padding: 24 }}
        showsVerticalScrollIndicator={false}
      >
        {/* En-tête */}
        <View className="mb-8">
          <Text className="font-heading text-3xl font-bold text-primary mb-2">
            Bagage Express
          </Text>
          <Text className="font-sans text-muted text-base">
            Transport de colis simplifié entre villes.
          </Text>
        </View>

        {/* Carte */}
        <View className="bg-surface p-6 rounded-xl shadow-sm border border-border mb-6">
          <Text className="font-heading text-xl font-semibold text-foreground mb-2">
            Statut actuel
          </Text>
          <Text className="font-sans text-muted mb-4">
            Vous n'avez aucun envoi en cours pour le moment.
          </Text>

          <TouchableOpacity 
            className="bg-secondary py-3 px-4 rounded-lg items-center active:opacity-90"
            onPress={() => console.log('Nouvel envoi')}
          >
            <Text className="text-gray-900 font-bold text-base">
              Faire un nouvel envoi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section info */}
        <View className="flex-row items-center bg-info/10 p-4 rounded-lg border border-info/20">
          <View className="h-2 w-2 rounded-full bg-info mr-3" />
          <Text className="font-sans text-info font-medium flex-1">
            Le service est disponible 24/7 à Douala et Yaoundé.
          </Text>
        </View>

        {/* Bouton login */}
        <Link href="/login" asChild>
          <TouchableOpacity className="flex-row items-center justify-center bg-white border border-gray-300 py-3 px-4 rounded-lg active:bg-gray-100 mt-8">
            <LogIn size={20} color="#374151" style={{ marginRight: 10 }} />
            <Text className="text-gray-700 font-bold text-base">
              Se connecter
            </Text>
          </TouchableOpacity>
        </Link>

      </ScrollView>
    </SafeAreaView>
  );
}
