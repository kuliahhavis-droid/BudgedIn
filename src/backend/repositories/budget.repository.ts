import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { z } from 'zod';
import type { budgetQuerySchema, budgetSchema, updateBudgetSchema } from '../validators/budget.validator';

export type BudgetInput = z.infer<typeof budgetSchema>;
export type BudgetUpdateInput = z.infer<typeof updateBudgetSchema>;
export type BudgetQuery = z.infer<typeof budgetQuerySchema>;

export const budgetRepository = {
  list(userId: string, query: BudgetQuery) {
    return prisma.budget.findMany({
      where: { userId, ...(query.month ? { month: query.month } : {}), ...(query.year ? { year: query.year } : {}) },
      include: { categories: true },
      orderBy: [{ year: 'desc' }, { month: 'desc' }]
    });
  },
  upsert(userId: string, input: BudgetInput) {
    return prisma.budget.upsert({
      where: { userId_month_year: { userId, month: input.month, year: input.year } },
      create: {
        userId,
        month: input.month,
        year: input.year,
        totalBudget: input.totalBudget,
        categories: { create: input.categories }
      },
      update: {
        totalBudget: input.totalBudget,
        categories: {
          deleteMany: {},
          create: input.categories
        }
      },
      include: { categories: true }
    });
  },
  async update(userId: string, id: string, input: BudgetUpdateInput) {
    const data: Prisma.BudgetUpdateInput = {
      month: input.month,
      year: input.year,
      totalBudget: input.totalBudget,
      ...(input.categories ? { categories: { deleteMany: {}, create: input.categories } } : {})
    };
    return prisma.budget.update({ where: { id, userId }, data, include: { categories: true } });
  },
  findOwned: (userId: string, id: string) => prisma.budget.findFirst({ where: { id, userId }, include: { categories: true } }),
  delete: (userId: string, id: string) => prisma.budget.deleteMany({ where: { id, userId } })
};
