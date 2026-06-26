/**
 * use-goals.ts — re-exports from use-savings.ts with the names expected by goals-page.tsx
 * goals-page.tsx imports from '@/hooks/use-goals' but logic lives in use-savings.ts
 */
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { savingsService } from '../services/savings.service';
import type { CreateGoalInput, UpdateGoalInput, ContributeInput } from '../types';

export function useSavingsGoals() {
  return useQuery({
    queryKey: ['savings-goals'],
    queryFn: () => savingsService.getGoals(),
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: CreateGoalInput) => savingsService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Target tabungan berhasil dibuat!');
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal membuat target tabungan'),
  });
}

export function useUpdateGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateGoalInput }) =>
      savingsService.updateGoal(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Target tabungan berhasil diperbarui!');
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal memperbarui target tabungan'),
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => savingsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Target tabungan berhasil dihapus!');
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal menghapus target tabungan'),
  });
}

/**
 * goals-page calls: contributeMutation.mutate({ goalId, amount, notes })
 * savingsService.addContribution(goalId, { amount, notes })
 */
export function useContribute() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ goalId, amount, notes }: { goalId: string; amount: number; notes?: string }) =>
      savingsService.addContribution(goalId, { amount, notes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Kontribusi berhasil ditambahkan!');
    },
    onError: (error: Error) => toast.error(error.message || 'Gagal menambahkan kontribusi'),
  });
}
