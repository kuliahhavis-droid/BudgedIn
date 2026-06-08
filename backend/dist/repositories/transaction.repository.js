import { prisma } from '../lib/prisma.js';
const toCreateData = (userId, input) => ({
    user: { connect: { id: userId } },
    title: input.title,
    description: input.description ?? input.notes ?? null,
    amount: input.amount,
    type: input.type,
    category: input.category,
    transactionDate: input.transactionDate
});
export const transactionRepository = {
    async list(userId, query) {
        const where = {
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
        const orderBy = { [query.sortBy || 'transactionDate']: query.sortOrder };
        const items = await prisma.transaction.findMany({
            where,
            orderBy,
            skip: (query.page - 1) * query.limit,
            take: query.limit
        });
        const total = await prisma.transaction.count({ where });
        return { items, meta: { total, page: query.page, limit: query.limit, pages: Math.ceil(total / query.limit) } };
    },
    create: (userId, input) => prisma.transaction.create({ data: toCreateData(userId, input) }),
    update: (userId, id, input) => prisma.transaction.updateMany({
        where: { id, userId },
        data: {
            ...input,
            description: input.description ?? input.notes ?? undefined,
            transactionDate: input.transactionDate
        }
    }),
    findOwned: (userId, id) => prisma.transaction.findFirst({ where: { id, userId } }),
    delete: (userId, id) => prisma.transaction.deleteMany({ where: { id, userId } })
};
