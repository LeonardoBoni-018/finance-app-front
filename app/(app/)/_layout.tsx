import React from 'react';
import { Tabs } from 'expo-router';
import { useRouter } from 'expo-router';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { paperTheme } from '@/theme/paperTheme';
import { FAB } from '@/components/ui/FAB';
import { colors } from '@/theme/tokens';
import { HomeIcon, ReceiptIcon, BellIcon, WalletIcon, Plus } from '@/components/ui/Icons';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { staleTime: 30_000, retry: 1, refetchOnWindowFocus: false },
  },
});

export default function AppLayout() {
  const router = useRouter();
  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarActiveTintColor: colors.primary,
            tabBarInactiveTintColor: colors.textDisabled,
            tabBarStyle: {
              backgroundColor: colors.surface,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              paddingBottom: 8,
              paddingTop: 4,
              height: 64,
            },
            tabBarLabelStyle: { fontSize: 11, fontWeight: '600', fontFamily: 'Nunito-Bold' },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: 'Início',
              tabBarIcon: ({ focused }) => <HomeIcon size={24} filled={focused} color={focused ? colors.primary : colors.textDisabled} />,
            }}
          />
          <Tabs.Screen
            name="transactions"
            options={{
              title: 'Transações',
              tabBarIcon: ({ focused }) => <ReceiptIcon size={24} filled={focused} color={focused ? colors.primary : colors.textDisabled} />,
            }}
          />
          <Tabs.Screen
            name="reminders"
            options={{
              title: 'Lembretes',
              tabBarIcon: ({ focused }) => <BellIcon size={24} filled={focused} color={focused ? colors.primary : colors.textDisabled} />,
            }}
          />
          <Tabs.Screen
            name="accounts"
            options={{
              title: 'Contas',
              tabBarIcon: ({ focused }) => <WalletIcon size={24} filled={focused} color={focused ? colors.primary : colors.textDisabled} />,
            }}
          />
        </Tabs>

        <FAB
          onPress={() => router.push('/transactions/new')}
          icon={<Plus size={24} color={colors.textOnPrimary} />}
          testID="fab-new-transaction"
        />
      </PaperProvider>
    </QueryClientProvider>
  );
}