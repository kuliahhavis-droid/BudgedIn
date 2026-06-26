import { prisma } from '../lib/prisma';
import type { z } from 'zod';
import type { contributionSchema, savingsGoalSchema, updateSavingsGoalSchema } from '../validators/savings.validator';

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>;
export type SavingsGoalUpdateInput = z.infer<typeof updateSavingsGoalSchema>;
export type ContributionInput = z.infer<typeof contributionSchema>;

export const savingsRepository = {
  list: (userId: string) =>
    prisma.savingsGoal.findMany({ where: { userId }, include: { contributions: true }, orderBy: [{ status: 'asc' }, { targetDate: 'asc' }] }),
  create: (userId: string, input: SavingsGoalInput) => prisma.savingsGoal.create({ data: { userId, ...input } }),
  update: (userId: string, id: string, input: SavingsGoalUpdateInput) => prisma.savingsGoal.update({ where: { id, userId }, data: input }),
  findOwned: (userId: string, id: string) => prisma.savingsGoal.findFirst({ where: { id, userId } }),
  delete: (userId: string, id: string) => prisma.savingsGoal.deleteMany({ where: { id, userId } }),
  async contribute(userId: string, goalId: string, input: ContributionInput) {
    return prisma.$transaction(async (tx) => {
      const goal = await tx.savingsGoal.findFirstOrThrow({ where: { id: goalId, userId } });
      const contribution = await tx.savingsTransaction.create({ data: { goalId, amount: input.amount, notes: input.notes } });
      const currentAmount = Number(goal.currentAmount) + input.amount;
      const status = currentAmount >= Number(goal.targetAmount) ? 'completed' : goal.status;
      const updatedGoal = await tx.savingsGoal.update({ where: { id: goalId }, data: { currentAmount, status } });
      return { contribution, goal: updatedGoal };
    });
  }
};
