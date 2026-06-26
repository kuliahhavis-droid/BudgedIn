import { apiGet, apiPost, apiPatch, apiDelete } from './api';
import type {
  SavingsGoal,
  SavingsTransaction,
  CreateGoalInput,
  UpdateGoalInput,
  ContributeInput,
} from '../types';

// Backend route is /savings-goals (see backend/src/routes/index.ts)
const BASE = '/savings-goals';

export const savingsService = {
  getGoals: async () => {
    const response = await apiGet<SavingsGoal[]>(BASE);
    return response.data ?? [];
  },

  getGoal: async (id: string) => {
    const response = await apiGet<SavingsGoal>(`${BASE}/${id}`);
    return response.data;
  },

  createGoal: async (data: CreateGoalInput) => {
    const response = await apiPost<SavingsGoal>(BASE, data);
    return response.data;
  },

  updateGoal: async (id: string, data: UpdateGoalInput) => {
    const response = await apiPatch<SavingsGoal>(`${BASE}/${id}`, data);
    return response.data;
  },

  deleteGoal: async (id: string) => {
    const response = await apiDelete<null>(`${BASE}/${id}`);
    return response;
  },

  addContribution: async (goalId: string, data: ContributeInput) => {
    const response = await apiPost<SavingsTransaction>(`${BASE}/${goalId}/contributions`, data);
    return response.data;
  },
};
