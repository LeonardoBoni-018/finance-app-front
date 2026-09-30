import { useMutation } from '@tanstack/react-query';
import { api } from '@/api/client';
import { authStore } from '@/store/authStore';
import type { LoginResponseDTO, UserResponseDTO } from '@/api/types/api';

interface LoginInput { email: string; password: string; }
interface RegisterInput { name: string; email: string; password: string; }

export const useLogin = () => {
  return useMutation({
    mutationFn: async (input: LoginInput) => {
      const { data } = await api.post<LoginResponseDTO>('/api/auth/login', input);
      authStore.getState().accessToken = data.token;
      const { data: me } = await api.get<UserResponseDTO>('/api/users/me');
      authStore.getState().user = me;
      return me;
    },
  });
};

export const useRegister = () => {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      await api.post<UserResponseDTO>('/api/users', input);
      const { data } = await api.post<LoginResponseDTO>('/api/auth/login', { email: input.email, password: input.password });
      authStore.getState().accessToken = data.token;
      const { data: me } = await api.get<UserResponseDTO>('/api/users/me');
      authStore.getState().user = me;
      return me;
    },
  });
};

export const useLogout = () => {
  return {
    mutate: () => authStore.getState().logout(),
  };
};