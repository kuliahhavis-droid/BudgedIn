import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type {
  Transaction,
  CreateTransactionInput,
  UpdateTransactionInput,
  TransactionFilters,
  PaginatedResponse,
} from '../types';

function buildQueryString(filters: TransactionFilters): string {
  const params = new URLSearchParams();

  if (filters.page !== undefined) params.set('page', String(filters.page));
  if (filters.limit !== undefined) params.set('limit', String(filters.limit));
  if (filters.search) params.set('search', filters.search);
  if (filters.type) params.set('type', filters.type);
  if (filters.category) params.set('category', filters.category);
  if (filters.from) params.set('from', filters.from);
  if (filters.to) params.set('to', filters.to);
  if (filters.sortBy) params.set('sortBy', filters.sortBy);
  if (filters.sortOrder) params.set('sortOrder', filters.sortOrder);

  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

export const transactionService = {
  getTransactions: async (filters: TransactionFilters = {}) => {
    const queryString = buildQueryString(filters);
    const response = await apiGet<PaginatedResponse<Transaction>>(`/transactions${queryString}`);
    // The API may return PaginatedResponse directly as the outer shape
    // Handle both wrapped and direct responses
    return (response.data as unknown as PaginatedResponse<Transaction>) ?? response;
  },

  getTransaction: async (id: string) => {
    const response = await apiGet<Transaction>(`/transactions/${id}`);
    return response.data;
  },

  createTransaction: async (data: CreateTransactionInput) => {
    const response = await apiPost<Transaction>('/transactions', data);
    return response.data;
  },

  updateTransaction: async (id: string, data: UpdateTransactionInput) => {
    const response = await apiPatch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  deleteTransaction: async (id: string) => {
    const response = await apiDelete<null>(`/transactions/${id}`);
    return response;
  },
};
