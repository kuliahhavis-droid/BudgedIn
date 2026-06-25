import { Prisma } from '@prisma/client';
import { prisma } from '../lib/prisma';
import type { z } from 'zod';
import type { transactionQuerySchema, transactionSchema, updateTransactionSchema } from '../validators/transaction.validator';

export type TransactionQuery = z.infer<typeof transactionQuerySchema>;
export type TransactionInput = z.infer<typeof transactionSchema>;
export type TransactionUpdateInput = z.infer<typeof updateTransactionSchema>;

const toCreateData = (userId: string, input: TransactionInput): Prisma.TransactionCreateInput => ({
  user: { connect: { id: userId } },
  title: input.title,
  description: input.description ?? input.notes ?? null,
  amount: input.amount,
  type: input.type,
  category: input.category,
  transactionDate: input.transactionDate
});

export const transactionRepository = {
  async list(userId: string, query: TransactionQuery) {
    const where: Prisma.TransactionWhereInput = {
      userId,
      ...(query.type ? { type: query.type } : {}),
      ...(query.category ? { category: query.category } : {}),
      ...(query.search
        ? {
            OR: [
              { title: { contains: query.search, mode: 'insensitive' } },
              { description: { contains: query.search, mode: 'insensitive' } },
              { category: { contains: query.search, mode: 'insensitive' } }
            ]
          }
        : {}),
      ...(query.from || query.to ? { transactionDate: { gte: query.from, lte: query.to } } : {})
    };
    const orderBy = { [query.sortBy || 'transactionDate']: query.sortOrder } as Prisma.TransactionOrderByWithRelationInput;
    const items = await prisma.transaction.findMany({ 
      where, 
      orderBy, 
      skip: (query.page - 1) * query.limit, 
      take: query.limit 
    });
    const total = await prisma.transaction.count({ where });
    return { items, meta: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) } };
  },
  create: (userId: string, input: TransactionInput) => prisma.transaction.create({ data: toCreateData(userId, input) }),
  update: (userId: string, id: string, input: TransactionUpdateInput) =>
    prisma.transaction.updateMany({
      where: { id, userId },
      data: {
        ...input,
        description: input.description ?? input.notes ?? undefined,
        transactionDate: input.transactionDate
      }
    }),
  findOwned: (userId: string, id: string) => prisma.transaction.findFirst({ where: { id, userId } }),
  delete: (userId: string, id: string) => prisma.transaction.deleteMany({ where: { id, userId } })
};
