import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api/client';
import type { ReminderResponseDTO, ReminderRequestDTO } from '@/api/types/api';

export const useReminders = () => {
  return useQuery({
    queryKey: ['reminders'],
    queryFn: async () => {
      const { data } = await api.get<ReminderResponseDTO[]>('/api/reminders');
      return data;
    },
  });
};

export const useCreateReminder = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (dto: ReminderRequestDTO) => {
      const { data } = await api.post<ReminderResponseDTO>('/api/reminders', dto);
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};

export const useMarkReminderPaid = () => {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: number) => {
      const { data } = await api.patch<ReminderResponseDTO>(`/api/reminders/${id}/pay`);
      return data;
    },
    onMutate: async (id) => {
      await qc.cancelQueries({ queryKey: ['reminders'] });
      const previous = qc.getQueryData<ReminderResponseDTO[]>(['reminders']);
      qc.setQueryData<ReminderResponseDTO[]>(['reminders'], (old) =>
        old?.map((r) => (r.id === id ? { ...r, status: 'PAID' } : r)) ?? []
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) qc.setQueryData(['reminders'], context.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ['reminders'] });
    },
  });
};