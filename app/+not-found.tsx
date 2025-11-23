import { Link, Stack } from 'expo-router';
import { Text, View } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oups !' }} />
      
      <View className="flex-1 items-center justify-center bg-gray-50 p-6">
        <Text className="font-heading text-xl font-bold text-gray-900 mb-4">
          Cette page n'existe pas.
        </Text>

        <Link href="/" className="mt-4 py-3 px-6 bg-primary rounded-lg">
          <Text className="text-white font-medium">
            Retourner à l'accueil
          </Text>
        </Link>
      </View>
    </>
  );
}