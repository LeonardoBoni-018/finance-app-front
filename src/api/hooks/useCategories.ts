import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { CategoryResponseDTO, CategoryRequestDTO } from '@/api/types/api';

export const useCategories = (type?: 'INCOME' | 'EXPENSE') => {
  return useQuery({
    queryKey: ['categories', type],
    queryFn: async () => {
      const { data } = await api.get<CategoryResponseDTO[]>('/api/categories', { params: { type } });
      return data;
    },
  });
};

export const useCreateCategory = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: CategoryRequestDTO) => {
      const { data } = await api.post<CategoryResponseDTO>('/api/categories', dto);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['categories'] });
    },
  });
};