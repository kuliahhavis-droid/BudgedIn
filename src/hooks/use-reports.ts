import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export function useMonthlyReport(month: number, year: number) {
  return useQuery({
    queryKey: ['reports', 'monthly', month, year],
    queryFn: () => reportService.getMonthlyReport(month, year),
    enabled: !!month && !!year,
  });
}

export function useTrends(year: number) {
  return useQuery({
    queryKey: ['reports', 'trends', year],
    queryFn: () => reportService.getTrends(year),
    enabled: !!year,
  });
}

export function useCategoryBreakdown(month: number, year: number) {
  return useQuery({
    queryKey: ['reports', 'category-breakdown', month, year],
    queryFn: () => reportService.getCategoryBreakdown(month, year),
    enabled: !!month && !!year,
  });
}

/**
 * Composite hook used by reports-page.tsx
 * Returns monthlyReport data and combined loading state
 */
export function useReports(month: number, year: number) {
  const { data: monthlyReport, isPending: isMonthlyLoading } = useMonthlyReport(month, year);
  const { data: trends, isPending: isTrendsLoading } = useTrends(year);
  const { data: categoryBreakdown, isPending: isCategoryLoading } = useCategoryBreakdown(month, year);

  return {
    monthlyReport,
    trends,
    categoryBreakdown,
    isLoading: isMonthlyLoading || isTrendsLoading || isCategoryLoading,
  };
}
