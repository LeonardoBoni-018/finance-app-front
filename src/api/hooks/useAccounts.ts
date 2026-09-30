import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { AccountResponseDTO, AccountRequestDTO } from '@/api/types/api';

export const useAccounts = (options?: { queryKey?: unknown[] }) => {
  return useQuery({
    queryKey: options?.queryKey ?? ['accounts'],
    queryFn: async () => {
      const { data } = await api.get<AccountResponseDTO[]>('/api/accounts');
      return data;
    },
  });
};

export const useAccount = (id: number) => {
  return useQuery({
    queryKey: ['accounts', id],
    queryFn: async () => {
      const { data } = await api.get<AccountResponseDTO>(`/api/accounts/${id}`);
      return data;
    },
    enabled: !!id,
  });
};

export const useCreateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: AccountRequestDTO) => {
      const { data } = await api.post<AccountResponseDTO>('/api/accounts', dto);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};

export const useUpdateAccount = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, dto }: { id: number; dto: Partial<AccountRequestDTO> }) => {
      const { data } = await api.patch<AccountResponseDTO>(`/api/accounts/${id}`, dto);
      return data;
    },
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['accounts'] });
      qc.invalidateQueries({ queryKey: ['accounts', id] });
    },
  });
};