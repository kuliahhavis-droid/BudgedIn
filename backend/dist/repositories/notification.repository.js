import { prisma } from '../lib/prisma.js';
import { eventBus } from '../lib/events.js';
export const notificationRepository = {
    list: (userId) => prisma.notification.findMany({ where: { userId }, orderBy: { createdAt: 'desc' }, take: 100 }),
    create: async (userId, title, message, type) => {
        const notification = await prisma.notification.create({ data: { userId, title, message, type } });
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_NOTIFICATION',
            title,
            message,
            data: notification
        });
        return notification;
    },
    hasNotificationThisMonth: async (userId, category, type, month, year) => {
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
    markRead: async (userId, id) => {
        const result = await prisma.notification.updateMany({ where: { id, userId }, data: { isRead: true } });
        eventBus.emit(`user:${userId}`, {
            type: 'NOTIFICATIONS_UPDATED',
            action: 'markRead',
            id
        });
        return result;
    },
    markAllRead: async (userId) => {
        const result = await prisma.notification.updateMany({ where: { userId, isRead: false }, data: { isRead: true } });
        eventBus.emit(`user:${userId}`, {
            type: 'NOTIFICATIONS_UPDATED',
            action: 'markAllRead'
        });
        return result;
    }
};
