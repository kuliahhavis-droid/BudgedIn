import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type {
  Budget,
  BudgetWithSpending,
  CreateBudgetInput,
  UpdateBudgetInput,
} from '../types';

export const budgetService = {
  getBudgets: async (params?: { month?: number; year?: number }) => {
    const searchParams = new URLSearchParams();
    if (params?.month !== undefined) searchParams.set('month', String(params.month));
    if (params?.year !== undefined) searchParams.set('year', String(params.year));

    const qs = searchParams.toString();
    const path = `/budgets${qs ? `?${qs}` : ''}`;

    const response = await apiGet<BudgetWithSpending[]>(path);
    return response.data;
  },

  getBudget: async (id: string) => {
    const response = await apiGet<BudgetWithSpending>(`/budgets/${id}`);
    return response.data;
  },

  createBudget: async (data: CreateBudgetInput) => {
    const response = await apiPost<Budget>('/budgets', data);
    return response.data;
  },

  updateBudget: async (id: string, data: UpdateBudgetInput) => {
    const response = await apiPatch<Budget>(`/budgets/${id}`, data);
    return response.data;
  },

  deleteBudget: async (id: string) => {
    const response = await apiDelete<null>(`/budgets/${id}`);
    return response;
  },
};
