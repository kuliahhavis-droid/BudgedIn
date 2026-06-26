import { apiGet, apiPatch } from './api';
import type { Notification } from '../types';

export const notificationService = {
  getNotifications: async () => {
    const response = await apiGet<Notification[]>('/notifications');
    return response.data;
  },

  markAsRead: async (id: string) => {
    const response = await apiPatch<Notification>(`/notifications/${id}/read`);
    return response.data;
  },

  markAllAsRead: async () => {
    const response = await apiPatch<null>('/notifications/read-all');
    return response;
  },

  getUnreadCount: async () => {
    const response = await apiGet<Notification[]>('/notifications');
    const notifications = response.data;
    return notifications.filter((n) => !n.isRead).length;
  },
};
