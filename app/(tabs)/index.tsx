import { Text, View, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { LogIn } from 'lucide-react-native';

export default function HomeScreen() {
  return (
    // 1. Fond principal : 'bg-background' (Blanc en light, Noir/Sombre en dark)
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView contentContainerClassName="p-6">
        
        {/* En-tête */}
        <View className="mb-8">
          {/* 'text-primary' s'adapte aussi (plus clair en dark mode selon votre CSS) */}
          <Text className="font-heading text-3xl font-bold text-primary mb-2">
            Bagage Express
          </Text>
          {/* 'text-muted' remplace text-gray-600 */}
          <Text className="font-sans text-muted text-base">
            Transport de colis simplifié entre villes.
          </Text>
        </View>

        {/* Carte */}
        {/* - 'bg-surface' : Blanc en light, Gris foncé en dark 
           - 'border-border' : S'adapte pour rester subtil
        */}
        <View className="bg-surface p-6 rounded-xl shadow-sm border border-border mb-6">
          {/* 'text-foreground' : Noir en light, Blanc en dark */}
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
            {/* Le texte sur 'secondary' est souvent noir ou blanc fixe, 
                ici on garde gray-900 si le jaune reste vif, sinon on peut adapter */}
            <Text className="text-gray-900 font-bold text-base">
              Faire un nouvel envoi
            </Text>
          </TouchableOpacity>
        </View>

        {/* Section info */}
        {/* bg-info/10 fonctionnera car 'info' est une variable CSS RGB */}
        <View className="flex-row items-center bg-info/10 p-4 rounded-lg border border-info/20 mb-6">
          <View className="h-2 w-2 rounded-full bg-info mr-3" />
          {/* text-info : Bleu foncé en light, Bleu clair en dark */}
          <Text className="font-sans text-info font-medium flex-1">
            Le service est disponible 24/7 à Douala et Yaoundé.
          </Text>
        </View>

        {/* Bouton Login */}
        <Link href="/login" asChild>
          <TouchableOpacity className="flex-row items-center justify-center bg-surface border border-border py-3 px-4 rounded-lg active:bg-muted/10">
            {/* className="text-foreground" permet à l'icône de changer de couleur auto */}
            <LogIn size={20} className="text-foreground mr-2" />
            <Text className="text-foreground font-bold text-base ml-2">
              Se connecter
            </Text>
          </TouchableOpacity>
        </Link>

      </ScrollView>
    </SafeAreaView>
  );
}