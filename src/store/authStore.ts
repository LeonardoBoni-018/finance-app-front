import * as SecureStore from 'expo-secure-store';
import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { api } from '@/api/client';

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface LoginResponseDTO {
  token: string;
  tokenType: string;
  expiresInMs: number;
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
}

interface AuthState {
  user: UserResponseDTO | null;
  accessToken: string | null;
  isHydrated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: UserRequestDTO) => Promise<void>;
  logout: () => void;
  hydrate: () => Promise<void>;
  setUser: (user: UserResponseDTO) => void;
}

const secureStorage = {
  getItem: async (name: string): Promise<string | null> => {
    try {
      return await SecureStore.getItemAsync(name);
    } catch {
      return null;
    }
  },
  setItem: async (name: string, value: string): Promise<void> => {
    try {
      await SecureStore.setItemAsync(name, value);
    } catch {
      // ignore
    }
  },
  removeItem: async (name: string): Promise<void> => {
    try {
      await SecureStore.deleteItemAsync(name);
    } catch {
      // ignore
    }
  },
};

export const authStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      isHydrated: false,

      login: async (email: string, password: string) => {
        const { data } = await api.post<LoginResponseDTO>('/api/auth/login', { email, password });
        set({ accessToken: data.token });
        const { data: me } = await api.get<UserResponseDTO>('/api/users/me');
        set({ user: me });
      },

      register: async (dto: UserRequestDTO) => {
        await api.post<UserResponseDTO>('/api/users', dto);
        await get().login(dto.email, dto.password);
      },

      logout: () => {
        set({ user: null, accessToken: null });
        SecureStore.deleteItemAsync('auth-storage');
      },

      hydrate: async () => {
        const token = await SecureStore.getItemAsync('accessToken');
        if (token) {
          set({ accessToken: token, isHydrated: true });
          try {
            const { data: me } = await api.get<UserResponseDTO>('/api/users/me');
            set({ user: me });
          } catch {
            set({ accessToken: null, user: null });
            await SecureStore.deleteItemAsync('accessToken');
          }
        } else {
          set({ isHydrated: true });
        }
      },

      setUser: (user: UserResponseDTO) => set({ user }),
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => secureStorage),
      partialize: (state) => ({ accessToken: state.accessToken }),
      onRehydrateStorage: () => (state) => {
        state?.hydrate();
      },
    }
  )
);