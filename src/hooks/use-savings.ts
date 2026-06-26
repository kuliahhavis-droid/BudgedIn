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

export function useSavingsGoal(id: string) {
  return useQuery({
    queryKey: ['savings-goals', id],
    queryFn: () => savingsService.getGoal(id),
    enabled: !!id,
  });
}

export function useCreateGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: CreateGoalInput) => savingsService.createGoal(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Target tabungan berhasil dibuat');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal membuat target tabungan');
    },
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
      toast.success('Target tabungan berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui target tabungan');
    },
  });
}

export function useDeleteGoal() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => savingsService.deleteGoal(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Target tabungan berhasil dihapus');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menghapus target tabungan');
    },
  });
}

export function useContribute() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ goalId, data }: { goalId: string; data: ContributeInput }) =>
      savingsService.addContribution(goalId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['savings-goals'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      toast.success('Kontribusi berhasil ditambahkan');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menambahkan kontribusi');
    },
  });
}
