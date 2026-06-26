import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { profileService } from '../services/profile.service';
import { useAuthStore } from '../stores/auth-store';
import type { UpdateProfileInput } from '../types';

export function useProfile() {
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => profileService.getProfile(),
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: UpdateProfileInput) => profileService.updateProfile(data),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser(updatedProfile);
      toast.success('Profil berhasil diperbarui');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal memperbarui profil');
    },
  });
}

export function useUploadAvatar() {
  const queryClient = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (file: File) => profileService.uploadAvatar(file),
    onSuccess: (updatedProfile) => {
      queryClient.invalidateQueries({ queryKey: ['profile'] });
      setUser(updatedProfile);
      toast.success('Avatar berhasil diunggah');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengunggah avatar');
    },
  });
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (newPassword: string) => profileService.changePassword(newPassword),
    onSuccess: () => {
      toast.success('Kata sandi berhasil diubah');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mengubah kata sandi');
    },
  });
}

export function useResetData() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => profileService.resetData(),
    onSuccess: () => {
      queryClient.invalidateQueries();
      toast.success('Semua data keuangan Anda berhasil direset.');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal mereset data keuangan.');
    },
  });
}

