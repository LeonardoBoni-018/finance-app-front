import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { authStore } from '@/store/authStore';
import { mapApiError } from '@/utils/error';

const API_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://10.0.2.2:8080';

export const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = authStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      const { logout } = authStore.getState();
      logout();
      return Promise.reject(mapApiError(error));
    }

    return Promise.reject(mapApiError(error));
  }
);

export const endpoints = {
  auth: {
    login: '/api/auth/login',
    me: '/api/users/me',
  },
  users: {
    base: '/api/users',
    register: '/api/users',
  },
  accounts: {
    base: '/api/accounts',
    byId: (id: number) => `/api/accounts/${id}`,
  },
  transactions: {
    base: '/api/transactions',
    byAccount: (accountId: number) => `/api/accounts/${accountId}/transactions`,
  },
  categories: {
    base: '/api/categories',
  },
  reminders: {
    base: '/api/reminders',
    pay: (id: number) => `/api/reminders/${id}/pay`,
  },
} as const;