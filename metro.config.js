const { getDefaultConfig } = require('expo/metro-config');
const { withNativeWind } = require('nativewind/metro');

/** @type {import('expo/metro-config').MetroConfig} */
const config = getDefaultConfig(__dirname);

// ✅ Configuration pour les fichiers CJS
config.resolver.sourceExts.push('cjs');

// ✅ AJOUT : Configuration pour les SVG
const { transformer, resolver } = config;

config.transformer = {
  ...transformer,
  babelTransformerPath: require.resolve("react-native-svg-transformer/expo")
};

config.resolver = {
  ...resolver,
  assetExts: resolver.assetExts.filter((ext) => ext !== "svg"),
  sourceExts: [...resolver.sourceExts, "svg"]
};

// ✅ Appliquer NativeWind en dernier
module.exports = withNativeWind(config, { input: './global.css' });