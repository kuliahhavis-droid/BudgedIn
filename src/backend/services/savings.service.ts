import { savingsRepository, type ContributionInput, type SavingsGoalInput, type SavingsGoalUpdateInput } from '../repositories/savings.repository';
import { HttpError } from '../utils/http-error';
import { notificationService } from './notification.service';

export const savingsService = {
  list: savingsRepository.list,
  create: savingsRepository.create,
  async update(userId: string, id: string, input: SavingsGoalUpdateInput) {
    const existing = await savingsRepository.findOwned(userId, id);
    if (!existing) throw new HttpError(404, 'Savings goal not found');
    return savingsRepository.update(userId, id, input);
  },
  async delete(userId: string, id: string) {
    const result = await savingsRepository.delete(userId, id);
    if (result.count === 0) throw new HttpError(404, 'Savings goal not found');
    return { deleted: true };
  },
  async contribute(userId: string, id: string, input: ContributionInput) {
    const existing = await savingsRepository.findOwned(userId, id);
    if (!existing) throw new HttpError(404, 'Savings goal not found');
    const result = await savingsRepository.contribute(userId, id, input);
    if (result.goal.status === 'completed' && existing.status !== 'completed') {
      await notificationService.goalCompleted(userId, result.goal.goalName);
    }
    return result;
  }
};

export type { ContributionInput, SavingsGoalInput };
