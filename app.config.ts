import { ConfigContext, ExpoConfig } from 'expo/config';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'FinanceApp',
  slug: 'finance-app',
  scheme: 'financeapp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon.png',
  userInterfaceStyle: 'light',
  splash: {
    image: './assets/splash.png',
    resizeMode: 'contain',
    backgroundColor: '#F6F6F3'
  },
  updates: { fallbackToCacheTimeout: 0 },
  assetBundlePatterns: ['**/*'],
  ios: {
    supportsTablet: false,
    bundleIdentifier: 'com.seudominio.financeapp',
    infoPlist: {
      NSFaceIDUsageDescription: 'Permite usar Face ID para acessar o app',
      UIBackgroundModes: ['remote-notification']
    }
  },
  android: {
    adaptiveIcon: {
      foregroundImage: './assets/adaptive-icon.png',
      backgroundColor: '#F6F6F3'
    },
    package: 'com.seudominio.financeapp',
    permissions: ['RECEIVE_BOOT_COMPLETED', 'VIBRATE', 'USE_BIOMETRIC', 'USE_FINGERPRINT']
  },
  web: { favicon: './assets/favicon.png' },
  plugins: [
    'expo-secure-store',
    'expo-notifications',
    ['expo-font', { fonts: ['assets/fonts/Nunito-Regular.ttf', 'assets/fonts/Nunito-Bold.ttf'] }],
    ['expo-splash-screen', { backgroundColor: '#F6F6F3', image: './assets/splash.png', dark: { backgroundColor: '#1A1A18' } }]
  ],
  extra: {
    apiUrl: process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080',
    eas: { projectId: 'your-eas-project-id' }
  }
});