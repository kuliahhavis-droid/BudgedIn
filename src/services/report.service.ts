import { apiGet, apiFetchBlob } from './api';
import type { DashboardData, MonthlyReport } from '../types';

export const reportService = {
  getDashboard: async (month?: number, year?: number) => {
    let url = '/reports/dashboard';
    if (month !== undefined && year !== undefined) {
      url += `?month=${month}&year=${year}`;
    }
    const response = await apiGet<DashboardData>(url);
    return response.data;
  },

  getMonthlyReport: async (month: number, year: number) => {
    const response = await apiGet<MonthlyReport>(
      `/reports/monthly?month=${month}&year=${year}`
    );
    return response.data;
  },

  getTrends: async (year: number) => {
    const response = await apiGet<DashboardData>('/reports/dashboard');
    return response.data.monthlyOverview || [];
  },

  getCategoryBreakdown: async (month: number, year: number) => {
    const response = await apiGet<any>(
      `/reports/monthly?month=${month}&year=${year}`
    );
    const byCategory = response.data?.byCategory || [];
    const totalExpense = response.data?.totalExpense || 1;
    return byCategory.map((c: any) => ({
      category: c.category,
      amount: c.expense,
      percentage: Number(((c.expense / totalExpense) * 100).toFixed(2))
    }));
  },

  exportCsv: async (month: number, year: number) => {
    const blob = await apiFetchBlob(
      `/reports/export?month=${month}&year=${year}&format=csv`
    );
    return blob;
  },
};
