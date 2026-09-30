import React from 'react';
import { authStore } from '@/store/authStore';

export const useAuthGuard = (user: ReturnType<typeof authStore>['user']) => {
  React.useEffect(() => {
    // Navigation is handled by Expo Router groups
  }, [user]);
};