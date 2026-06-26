import { useQuery } from '@tanstack/react-query';
import { reportService } from '../services/report.service';

export function useDashboard() {
  const now = new Date();
  const month = now.getMonth() + 1; // 1-12 berdasarkan waktu lokal pengguna
  const year = now.getFullYear();

  return useQuery({
    queryKey: ['dashboard', { month, year }],
    queryFn: () => reportService.getDashboard(month, year),
    staleTime: 1000 * 60, // 1 minute
  });
}
