import { prisma } from '../lib/prisma.js';
import { budgetRepository } from '../repositories/budget.repository.js';
import { HttpError } from '../utils/http-error.js';
import { notificationService } from './notification.service.js';
import { eventBus } from '../lib/events.js';
const monthRange = (month, year) => {
    const start = new Date(Date.UTC(year, month - 1, 1));
    const end = new Date(Date.UTC(year, month, 1));
    return { start, end };
};
export const budgetService = {
    async list(userId, query) {
        const budgets = await budgetRepository.list(userId, query);
        const result = [];
        for (const budget of budgets) {
            const { start, end } = monthRange(budget.month, budget.year);
            const spending = await prisma.transaction.groupBy({
                by: ['category'],
                where: { userId, type: 'expense', transactionDate: { gte: start, lt: end } },
                _sum: { amount: true }
            });
            const usedByCategory = new Map(spending.map((item) => [item.category, Number(item._sum.amount ?? 0)]));
            const totalUsed = Array.from(usedByCategory.values()).reduce((sum, value) => sum + value, 0);
            result.push({
                ...budget,
                used: totalUsed,
                remaining: Number(budget.totalBudget) - totalUsed,
                percentageUsed: Number(budget.totalBudget) > 0 ? (totalUsed / Number(budget.totalBudget)) * 100 : 0,
                categories: budget.categories.map((category) => {
                    const used = usedByCategory.get(category.category) ?? 0;
                    const percentageUsed = Number(category.allocatedAmount) > 0 ? (used / Number(category.allocatedAmount)) * 100 : 0;
                    return { ...category, used, remaining: Number(category.allocatedAmount) - used, percentageUsed, status: getBudgetStatus(percentageUsed) };
                })
            });
        }
        return result;
    },
    async upsert(userId, input) {
        const budget = await budgetRepository.upsert(userId, input);
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_BUDGET',
            data: budget
        });
        return budget;
    },
    async update(userId, id, input) {
        const existing = await budgetRepository.findOwned(userId, id);
        if (!existing)
            throw new HttpError(404, 'Budget not found');
        const budget = await budgetRepository.update(userId, id, input);
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_BUDGET',
            data: budget
        });
        return budget;
    },
    async delete(userId, id) {
        const result = await budgetRepository.delete(userId, id);
        if (result.count === 0)
            throw new HttpError(404, 'Budget not found');
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_BUDGET'
        });
        return { deleted: true };
    },
    async evaluateNotifications(userId, month, year) {
        const [budget] = await this.list(userId, { month, year });
        if (!budget)
            return [];
        const notifications = [];
        for (const item of budget.categories) {
            const notif = await notificationService.budgetWarning(userId, item.category, item.percentageUsed, month, year);
            if (notif) {
                notifications.push(notif);
            }
        }
        return notifications;
    }
};
export const getBudgetStatus = (percentage) => {
    if (percentage > 100)
        return 'Over Budget';
    if (percentage >= 81)
        return 'Critical';
    if (percentage >= 51)
        return 'Warning';
    return 'Safe';
};
