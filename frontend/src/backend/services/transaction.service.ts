import { transactionRepository, type TransactionInput, type TransactionQuery, type TransactionUpdateInput } from '../repositories/transaction.repository';
import { budgetService } from './budget.service';
import { HttpError } from '../utils/http-error';
import { eventBus } from '../lib/events';

export const transactionService = {
  async list(userId: string, query: TransactionQuery) {
    return transactionRepository.list(userId, query);
  },
  async create(userId: string, input: TransactionInput) {
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
  async update(userId: string, id: string, input: TransactionUpdateInput) {
    const existing = await transactionRepository.findOwned(userId, id);
    if (!existing) throw new HttpError(404, 'Transaction not found');
    
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
  async delete(userId: string, id: string) {
    const existing = await transactionRepository.findOwned(userId, id);
    if (!existing) throw new HttpError(404, 'Transaction not found');
    
    const result = await transactionRepository.delete(userId, id);
    
    // Emit real-time event to SSE listeners
    eventBus.emit(`user:${userId}`, {
      type: 'NEW_TRANSACTION'
    });
    
    return { deleted: result.count > 0 };
  }
};
