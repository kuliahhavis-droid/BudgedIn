import { prisma } from '../lib/prisma';
import type { NotificationType } from '@prisma/client';
import { eventBus } from '../lib/events';

export const notificationRepository = {
  list: (userId: string) => prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 }),
  create: async (userId: string, title: string, message: string, type: NotificationType) => {
    const notification = await prisma.notification.create({ data: { userId, title, message, type } });
    eventBus.emit(`user:${userId}`, {
      type: 'NEW_NOTIFICATION',
      title,
      message,
      data: notification
    });
    return notification;
  },
  hasNotificationThisMonth: async (userId: string, category: string, type: NotificationType, month: number, year: number) => {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    const count = await prisma.notification.count({
      where: {
        userId,
        type,
        createdAt: { gte: start, lt: end },
        message: { startsWith: category, mode: 'insensitive' }
      }
    });
    return count > 0;
  },
  markRead: async (userId: string, id: string) => {
    const result = await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
    eventBus.emit(`user:${userId}`, {
      type: 'NOTIFICATIONS_UPDATED',
      action: 'markRead',
      id
    });
    return result;
  },
  markAllRead: async (userId: string) => {
    const result = await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
    eventBus.emit(`user:${userId}`, {
      type: 'NOTIFICATIONS_UPDATED',
      action: 'markAllRead'
    });
    return result;
  }
};
