import { notificationRepository } from '../repositories/notification.repository.js';
export const notificationService = {
    list: notificationRepository.list,
    markRead: notificationRepository.markRead,
    markAllRead: notificationRepository.markAllRead,
    async budgetWarning(userId, category, percentUsed, month, year) {
        if (percentUsed > 100) {
            const exists = await notificationRepository.hasNotificationThisMonth(userId, category, 'overspending', month, year);
            if (exists)
                return null;
            return notificationRepository.create(userId, 'Budget exceeded', `${category} is over budget at ${Math.round(percentUsed)}%.`, 'overspending');
        }
        if (percentUsed >= 100) {
            const exists = await notificationRepository.hasNotificationThisMonth(userId, category, 'budget_critical', month, year);
            if (exists)
                return null;
            return notificationRepository.create(userId, 'Budget limit reached', `${category} has reached its monthly limit.`, 'budget_critical');
        }
        if (percentUsed >= 80) {
            const exists = await notificationRepository.hasNotificationThisMonth(userId, category, 'budget_warning', month, year);
            if (exists)
                return null;
            return notificationRepository.create(userId, 'Budget warning', `${category} has used ${Math.round(percentUsed)}% of its allocation.`, 'budget_warning');
        }
        return null;
    },
    goalCompleted(userId, name) {
        return notificationRepository.create(userId, 'Savings goal completed', `${name} is fully funded. Nice work.`, 'goal_achievement');
    }
};
