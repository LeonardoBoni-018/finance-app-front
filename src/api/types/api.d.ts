// Auto-generated types from OpenAPI spec
// Run: npm run generate:api (requires backend running on localhost:8080)

// Auth
export interface LoginResponseDTO {
  token: string;
  tokenType: string;
  expiresInMs: number;
}

export interface LoginRequestDTO {
  email: string;
  password: string;
}

export interface UserResponseDTO {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

export interface UserRequestDTO {
  name: string;
  email: string;
  password: string;
}

// Accounts
export interface AccountResponseDTO {
  id: number;
  name: string;
  type: AccountType;
  balance: number;
  createdAt: string;
}

export interface AccountRequestDTO {
  name: string;
  type: AccountType;
}

export type AccountType = 'CHECKING' | 'SAVINGS' | 'CREDIT_CARD' | 'WALLET';

// Transactions
export interface TransactionResponseDTO {
  id: number;
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
  createdAt: string;
  accountId: number;
  category: CategoryResponseDTO | null;
}

export interface TransactionRequestDTO {
  description: string;
  amount: number;
  type: TransactionType;
  transactionDate: string;
  accountId: number;
  categoryId: number | null;
}

export type TransactionType = 'INCOME' | 'EXPENSE';

// Categories
export interface CategoryResponseDTO {
  id: number;
  name: string;
  type: TransactionType;
  icon: string | null;
  color: string | null;
}

export interface CategoryRequestDTO {
  name: string;
  type: TransactionType;
  icon?: string;
  color?: string;
}

// Reminders
export interface ReminderResponseDTO {
  id: number;
  title: string;
  description: string | null;
  amount: number | null;
  dueDate: string;
  status: ReminderStatus;
  notificationSent: boolean;
  createdAt: string;
}

export interface ReminderRequestDTO {
  title: string;
  description?: string;
  amount?: number;
  dueDate: string;
}

export type ReminderStatus = 'PENDING' | 'PAID' | 'OVERDUE';

// Problem Details (RFC 7807)
export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  fields?: Record<string, string>;
  timestamp: string;
  path: string;
}