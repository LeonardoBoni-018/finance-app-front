import React from 'react';
import { authStore } from '@/store/authStore';

export const useAuthHydration = () => {
  const { isHydrated, hydrate } = authStore();

  React.useEffect(() => {
    hydrate();
  }, [hydrate]);

  return { hydrating: !isHydrated };
};