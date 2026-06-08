import { prisma } from '../lib/prisma.js';
export const savingsRepository = {
    list: (userId) => prisma.savingsGoal.findMany({ where: { userId }, include: { contributions: true }, orderBy: [{ status: 'asc' }, { targetDate: 'asc' }] }),
    create: (userId, input) => prisma.savingsGoal.create({ data: { userId, ...input } }),
    update: (userId, id, input) => prisma.savingsGoal.update({ where: { id, userId }, data: input }),
    findOwned: (userId, id) => prisma.savingsGoal.findFirst({ where: { id, userId } }),
    delete: (userId, id) => prisma.savingsGoal.deleteMany({ where: { id, userId } }),
    async contribute(userId, goalId, input) {
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
