import { transactionRepository } from '../repositories/transaction.repository.js';
import { budgetService } from './budget.service.js';
import { HttpError } from '../utils/http-error.js';
import { eventBus } from '../lib/events.js';
export const transactionService = {
    async list(userId, query) {
        return transactionRepository.list(userId, query);
    },
    async create(userId, input) {
        const transaction = await transactionRepository.create(userId, input);
        // Evaluate budget notifications for expenses
        if (input.type === 'expense') {
            const date = new Date(input.transactionDate);
            await budgetService.evaluateNotifications(userId, date.getUTCMonth() + 1, date.getUTCFullYear());
        }
        // Emit real-time event to SSE listeners
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_TRANSACTION',
            data: transaction
        });
        return transaction;
    },
    async update(userId, id, input) {
        const existing = await transactionRepository.findOwned(userId, id);
        if (!existing)
            throw new HttpError(404, 'Transaction not found');
        const updated = await transactionRepository.update(userId, id, input);
        if (input.type === 'expense' || existing.type === 'expense') {
            const date = new Date(input.transactionDate ?? existing.transactionDate);
            await budgetService.evaluateNotifications(userId, date.getUTCMonth() + 1, date.getUTCFullYear());
        }
        // Emit real-time event to SSE listeners
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_TRANSACTION'
        });
        return updated;
    },
    async delete(userId, id) {
        const existing = await transactionRepository.findOwned(userId, id);
        if (!existing)
            throw new HttpError(404, 'Transaction not found');
        const result = await transactionRepository.delete(userId, id);
        // Emit real-time event to SSE listeners
        eventBus.emit(`user:${userId}`, {
            type: 'NEW_TRANSACTION'
        });
        return { deleted: result.count > 0 };
    }
};
