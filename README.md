# BEC Mobile - Application React Native

Application mobile pour la plateforme BEC, développée avec React Native (Expo) et TypeScript.

## 🚀 Stack Technique

- **Framework**: React Native 0.81 (via Expo SDK 54)
- **Navigation**: Expo Router
- **UI**: NativeWind (Tailwind CSS pour React Native)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **API Client**: Axios
- **Real-time**: Mercure (via EventSource)
- **TypeScript**: Support complet

## 📋 Prérequis

- Node.js 18+
- npm ou yarn
- Expo CLI
- Pour iOS : Xcode (macOS uniquement)
- Pour Android : Android Studio

## 🛠️ Installation

```bash
# Cloner le projet
git clone <repository-url>
cd bec-mobile

# Installer les dépendances
npm install

# Copier les variables d'environnement
cp .env.example .env.local
# Puis éditer .env.local avec vos valeurs

# Lancer le projet
npm start
```

## 🏃 Commandes Disponibles

```bash
# Démarrer le serveur de développement
npm start

# Lancer sur iOS
npm run ios

# Lancer sur Android
npm run android

# Lancer sur Web
npm run web

# Vérifier les types TypeScript
npm run type-check

# Linter le code
npm run lint

# Générer les fichiers natifs
npm run prebuild
```

## 📁 Structure du Projet

```

├── app/              # Routes Expo Router
│   ├── (auth)/      # Écrans d'authentification
│   ├── (tabs)/      # Navigation principale par tabs
│   ├── (protected)/ # Écrans protégés
│   └── (admin)/     # Section admin
├── components/       # Composants réutilisables
├── lib/             # Logique métier
│   ├── api/         # Clients API
│   ├── hooks/       # Hooks personnalisés
│   ├── store/       # Stores Zustand
│   └── validations/ # Schémas Zod
├── types/           # Types TypeScript
└── constants/       # Constantes de l'app
```

## 🔐 Authentification

L'application utilise un système d'authentification par token JWT stocké de manière sécurisée avec `expo-secure-store`.

## 🎨 Styling

Le styling est géré avec NativeWind (Tailwind CSS pour React Native). Les classes Tailwind peuvent être utilisées directement dans les composants.

## 📱 Build Production

```bash
# Build de développement
eas build --profile development --platform ios
eas build --profile development --platform android

# Build de production
eas build --profile production --platform ios
eas build --profile production --platform android
```

## 🧪 Tests

Tests à venir...

## 📝 License

Private