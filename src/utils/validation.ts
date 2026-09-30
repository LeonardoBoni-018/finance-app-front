import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(1, 'Senha é obrigatória'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres').max(120, 'Nome muito longo'),
  email: z.string().email('E-mail inválido').min(1, 'E-mail é obrigatório'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres').max(100, 'Senha muito longa'),
});

export const accountSchema = z.object({
  name: z.string().min(1, 'Nome da conta é obrigatório').max(100, 'Nome muito longo'),
  type: z.enum(['CHECKING', 'SAVINGS', 'CREDIT_CARD', 'WALLET'], { message: 'Tipo de conta inválido' }),
});

export const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória').max(150, 'Descrição muito longa'),
  amount: z.string().refine((v) => parseFloat(v.replace(',', '.')) > 0, 'Valor deve ser positivo'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Tipo de transação inválido' }),
  transactionDate: z.string().min(1, 'Data é obrigatória'),
  accountId: z.number().int().positive('Conta é obrigatória'),
  categoryId: z.number().int().positive().optional().nullable(),
});

export const categorySchema = z.object({
  name: z.string().min(1, 'Nome da categoria é obrigatório').max(60, 'Nome muito longo'),
  type: z.enum(['INCOME', 'EXPENSE'], { message: 'Tipo de categoria inválido' }),
  icon: z.string().optional(),
  color: z.string().regex(/^#[A-Fa-f0-9]{6}$/, 'Cor deve ser hexadecimal (ex: #FF5733)').optional(),
});

export const reminderSchema = z.object({
  title: z.string().min(1, 'Título é obrigatório').max(150, 'Título muito longo'),
  description: z.string().max(500, 'Descrição muito longa').optional(),
  amount: z.string().refine((v) => !v || parseFloat(v.replace(',', '.')) > 0, 'Valor deve ser positivo').optional(),
  dueDate: z.string().min(1, 'Data de vencimento é obrigatória').refine((d) => new Date(d) >= new Date(new Date().setHours(0,0,0,0)), 'Data não pode ser no passado'),
});

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AccountInput = z.infer<typeof accountSchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type CategoryInput = z.infer<typeof categorySchema>;
export type ReminderInput = z.infer<typeof reminderSchema>;