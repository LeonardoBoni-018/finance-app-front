// vitest.setup.tsx
import '@testing-library/jest-native';
import 'react-native-gesture-handler/jestSetup';

(global as any).__DEV__ = true;

// Mock expo modules
jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
  setItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));

jest.mock('expo-notifications', () => ({
  getPermissionsAsync: jest.fn(),
  requestPermissionsAsync: jest.fn(),
  scheduleNotificationAsync: jest.fn(),
}));

jest.mock('expo-router', () => ({
  useRouter: () => ({ push: jest.fn(), replace: jest.fn(), back: jest.fn() }),
  useLocalSearchParams: () => ({}),
  Stack: ({ children }: { children: React.ReactNode }) => children,
  Tabs: ({ children }: { children: React.ReactNode }) => children,
}));

jest.mock('react-native-paper', () => ({
  ...jest.requireActual('react-native-paper'),
  Provider: ({ children }: { children: React.ReactNode }) => children,
  Text: ({ children, ...props }: any) => <span {...props}>{children}</span>,
  Button: ({ children, ...props }: any) => <button {...props}>{children}</button>,
  TextInput: ({ ...props }: any) => <input {...props} />,
  Card: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  Modal: ({ children, ...props }: any ) => <div {...props}>{children}</div>,
}));

jest.mock('react-native-reanimated', () => {
  return {
    default: {
      useSharedValue: () => ({ value: 0 }),
      useAnimatedStyle: () => ({}),
      withTiming: (v: any) => v,
      withSpring: (v: any) => v,
      Easing: { out: () => () => 1, cubic: () => 1 },
    },
    useSharedValue: () => ({ value: 0 }),
    useAnimatedStyle: () => ({}),
    withTiming: (v: any) => v,
    withSpring: (v: any) => v,
  };
});

// Mock lucide icons
jest.mock('lucide-react-native', () => {
  const icons = ['Plus', 'Home', 'Receipt', 'Bell', 'Wallet', 'Calendar', 'CheckCircle', 'AlertCircle', 'XCircle'];
  return icons.reduce((acc, name) => {
    acc[name] = ({ size = 24, color = 'black', ...props }: any) => (
      <svg width={size} height={size} {...props}><text x="0" y={size * 0.8}>{name[0]}</text></svg>
    );
    return acc;
  }, {} as Record<string, any>);
});