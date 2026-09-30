import React from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { paperTheme } from '@/theme/paperTheme';
import { authStore } from '@/store/authStore';
import { useAuthHydration } from '@/hooks/useAuthHydration';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export default function RootLayout() {
  const { user, isHydrated } = authStore();
  const { hydrating } = useAuthHydration();

  if (hydrating || !isHydrated) {
    return null;
  }

  return (
    <QueryClientProvider client={queryClient}>
      <PaperProvider theme={paperTheme}>
        {null}
      </PaperProvider>
    </QueryClientProvider>
  );
}