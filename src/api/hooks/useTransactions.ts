import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { TransactionResponseDTO, TransactionRequestDTO } from '@/api/types/api';

export const useTransactions = (params?: { accountId?: number; period?: string }) => {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: async () => {
      const url = params?.accountId ? `/api/accounts/${params.accountId}/transactions` : '/api/transactions';
      const { data } = await api.get<TransactionResponseDTO[]>(url, { params: { period: params?.period } });
      return data;
    },
  });
};

export const useCreateTransaction = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: TransactionRequestDTO) => {
      const { data } = await api.post<TransactionResponseDTO>('/api/transactions', dto);
      return data;
    },
    onSuccess: (_, vars) => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      qc.invalidateQueries({ queryKey: ['accounts', vars.accountId] });
      qc.invalidateQueries({ queryKey: ['accounts'] });
    },
  });
};