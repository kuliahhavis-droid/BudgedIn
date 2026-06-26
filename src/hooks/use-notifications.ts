import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useMemo } from 'react';
import { toast } from 'sonner';
import { notificationService } from '../services/notification.service';
import { useNotificationStore } from '../stores/notification-store';
import type { Notification } from '../types';

export function useNotifications() {
  const setUnreadCount = useNotificationStore((state) => state.setUnreadCount);

  return useQuery({
    queryKey: ['notifications'],
    queryFn: async () => {
      const notifications = await notificationService.getNotifications();
      const unread = notifications.filter((n) => !n.isRead).length;
      setUnreadCount(unread);
      return notifications;
    },
    refetchInterval: 30000,
  });
}

export function useUnreadCount() {
  const { data: notifications } = useNotifications();

  return useMemo(() => {
    if (!notifications) return 0;
    return notifications.filter((n: Notification) => !n.isRead).length;
  }, [notifications]);
}

export function useMarkAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => notificationService.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menandai notifikasi sebagai sudah dibaca');
    },
  });
}

export function useMarkAllAsRead() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => notificationService.markAllAsRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notifications'] });
      toast.success('Semua notifikasi ditandai sebagai sudah dibaca');
    },
    onError: (error: Error) => {
      toast.error(error.message || 'Gagal menandai semua notifikasi sebagai sudah dibaca');
    },
  });
}
