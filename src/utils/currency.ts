import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export const formatBRL = (value: number | string | null | undefined): string => {
  const num = typeof value === 'string' ? parseFloat(value) : (value ?? 0);
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatBRLSigned = (value: number | string, type?: 'INCOME' | 'EXPENSE'): string => {
  const num = typeof value === 'string' ? parseFloat(value) : value;
  const sign = type === 'INCOME' ? '+' : type === 'EXPENSE' ? '−' : num >= 0 ? '+' : '';
  return `${sign}${formatBRL(Math.abs(num))}`;
};

export const parseBRL = (value: string): number => {
  const cleaned = value.replace(/[^\d,-]/g, '').replace(',', '.');
  return parseFloat(cleaned) || 0;
};

export const formatDateBR = (date: string | Date, pattern = "dd/MM/yyyy"): string => {
  return format(new Date(date), pattern, { locale: ptBR });
};

export const formatRelativeDate = (date: string | Date): string => {
  const d = new Date(date);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const target = new Date(d);
  target.setHours(0, 0, 0, 0);
  const diff = Math.round((target.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  if (diff === 0) return 'Hoje';
  if (diff === 1) return 'Amanhã';
  if (diff === -1) return 'Ontem';
  if (diff > 0 && diff < 7) return `em ${diff} dias`;
  if (diff < 0 && diff > -7) return `há ${Math.abs(diff)} dias`;
  return formatDateBR(d);
};

export const isOverdue = (dueDate: string | Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return new Date(dueDate) < today;
};

export const formatDateForInput = (date: Date): string => {
  return format(date, 'yyyy-MM-dd');
};