import { prisma } from '../lib/prisma.js';
export const budgetRepository = {
    list(userId, query) {
        return prisma.budget.findMany({
            where: { userId, ...(query.month ? { month: query.month } : {}), ...(query.year ? { year: query.year } : {}) },
            include: { categories: true },
            orderBy: [{ year: 'desc' }, { month: 'desc' }]
        });
    },
    upsert(userId, input) {
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
    async update(userId, id, input) {
        const data = {
            month: input.month,
            year: input.year,
            totalBudget: input.totalBudget,
            ...(input.categories ? { categories: { deleteMany: {}, create: input.categories } } : {})
        };
        return prisma.budget.update({ where: { id, userId }, data, include: { categories: true } });
    },
    findOwned: (userId, id) => prisma.budget.findFirst({ where: { id, userId }, include: { categories: true } }),
    delete: (userId, id) => prisma.budget.deleteMany({ where: { id, userId } })
};
