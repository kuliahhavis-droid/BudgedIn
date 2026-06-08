import { savingsRepository } from '../repositories/savings.repository.js';
import { HttpError } from '../utils/http-error.js';
import { notificationService } from './notification.service.js';
export const savingsService = {
    list: savingsRepository.list,
    create: savingsRepository.create,
    async update(userId, id, input) {
        const existing = await savingsRepository.findOwned(userId, id);
        if (!existing)
            throw new HttpError(404, 'Savings goal not found');
        return savingsRepository.update(userId, id, input);
    },
    async delete(userId, id) {
        const result = await savingsRepository.delete(userId, id);
        if (result.count === 0)
            throw new HttpError(404, 'Savings goal not found');
        return { deleted: true };
    },
    async contribute(userId, id, input) {
        const existing = await savingsRepository.findOwned(userId, id);
        if (!existing)
            throw new HttpError(404, 'Savings goal not found');
        const result = await savingsRepository.contribute(userId, id, input);
        if (result.goal.status === 'completed' && existing.status !== 'completed') {
            await notificationService.goalCompleted(userId, result.goal.goalName);
        }
        return result;
    }
};
