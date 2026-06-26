import { prisma } from '../lib/prisma';

const monthRange = (month: number, year: number) => {
  const start = new Date(Date.UTC(year, month - 1, 1));
  const end = new Date(Date.UTC(year, month, 1));
  return { start, end };
};

export const reportService = {
  async monthly(userId: string, month: number, year: number) {
    const { start, end } = monthRange(month, year);
    const transactions = await prisma.transaction.findMany({ where: { userId, transactionDate: { gte: start, lt: end } } });
    const totalIncome = transactions.filter((item) => item.type === 'income').reduce((sum, item) => sum + Number(item.amount), 0);
    const totalExpense = transactions.filter((item) => item.type === 'expense').reduce((sum, item) => sum + Number(item.amount), 0);
    
    // Ambil data anggaran pengguna untuk bulan dan tahun yang bersangkutan
    const budget = await prisma.budget.findFirst({
      where: { userId, month, year }
    });
    const totalBudget = budget ? Number(budget.totalBudget) : 0;
    const budgetPerformance = totalBudget > 0 ? Math.round((totalExpense / totalBudget) * 100) : 0;

    const byCategory = Object.values(
      transactions.reduce<Record<string, { category: string; income: number; expense: number }>>((acc, item) => {
        acc[item.category] ??= { category: item.category, income: 0, expense: 0 };
        acc[item.category][item.type] += Number(item.amount);
        return acc;
      }, {})
    );
    return { month, year, totalIncome, totalExpense, savings: totalIncome - totalExpense, budgetPerformance, byCategory, transactions };
  },
  async dashboard(userId: string, queryMonth?: number, queryYear?: number) {
    const now = new Date();
    const month = queryMonth ?? (now.getUTCMonth() + 1);
    const year = queryYear ?? now.getUTCFullYear();
    const { start, end } = monthRange(month, year);

    // Get totals via aggregates (SQL-side) instead of fetching all transaction objects
    const aggregates = await prisma.transaction.groupBy({
      by: ['type'],
      where: { userId },
      _sum: { amount: true },
      _count: { id: true }
    });

    const incomeAgg = aggregates.find(a => a.type === 'income');
    const expenseAgg = aggregates.find(a => a.type === 'expense');

    const totalIncome = Number(incomeAgg?._sum.amount ?? 0);
    const totalExpenses = Number(expenseAgg?._sum.amount ?? 0);
    const totalTransactions = (incomeAgg?._count.id ?? 0) + (expenseAgg?._count.id ?? 0);

    const recentTransactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { transactionDate: 'desc' },
      take: 10
    });

    // Fetch transactions for the last 6 months in a single query with selected fields
    const sixMonthsAgo = new Date(Date.UTC(year, (month - 1) - 5, 1));
    const rangeTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        transactionDate: { gte: sixMonthsAgo }
      },
      select: {
        amount: true,
        type: true,
        transactionDate: true
      }
    });

    // Compute monthly overview in memory
    const monthlyOverview = Array.from({ length: 6 }, (_, i) => {
      const d = new Date(Date.UTC(year, (month - 1) - i, 1));
      return {
        m: d.getUTCMonth() + 1,
        y: d.getUTCFullYear(),
        label: d.toLocaleString('default', { month: 'short', year: '2-digit' })
      };
    }).reverse().map(({ m, y, label }) => {
      const { start: s, end: e } = monthRange(m, y);
      const txs = rangeTransactions.filter(t => t.transactionDate >= s && t.transactionDate < e);
      return {
        month: label,
        income: txs.filter(t => t.type === 'income').reduce((a, t) => a + Number(t.amount), 0),
        expense: txs.filter(t => t.type === 'expense').reduce((a, t) => a + Number(t.amount), 0),
      };
    });

    // Current month budget
    const budget = await prisma.budget.findFirst({
      where: { userId, month, year },
      include: { categories: true }
    });

    let budgetOverview = null;
    if (budget) {
      const spending = await prisma.transaction.groupBy({
        by: ['category'],
        where: { userId, type: 'expense', transactionDate: { gte: start, lt: end } },
        _sum: { amount: true }
      });
      const totalSpent = spending.reduce((s, g) => s + Number(g._sum.amount ?? 0), 0);
      const totalBudget = Number(budget.totalBudget);
      const percentageUsed = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;
      const status = percentageUsed > 100 ? 'over_budget' : percentageUsed >= 81 ? 'critical' : percentageUsed >= 51 ? 'warning' : 'safe';
      budgetOverview = {
        id: budget.id, month: budget.month, year: budget.year,
        totalBudget, totalSpent, totalRemaining: totalBudget - totalSpent,
        percentageUsed, status, categories: budget.categories,
        userId: budget.userId, createdAt: budget.createdAt.toISOString(), updatedAt: budget.updatedAt.toISOString()
      };
    }

    const savingsGoals = await prisma.savingsGoal.findMany({
      where: { userId, status: 'active' },
      orderBy: { targetDate: 'asc' },
      take: 5
    });

    const healthScore = Math.max(0, Math.min(100,
      Math.round(50
        + (totalIncome > totalExpenses ? 20 : -20)
        + (savingsGoals.length > 0 ? 15 : 0)
        + (budget ? 15 : 0)
      )
    ));

    return {
      currentBalance: totalIncome - totalExpenses,
      totalIncome,
      totalExpenses,
      totalTransactions,
      recentTransactions,
      monthlyOverview,
      budgetOverview,
      savingsGoals,
      healthScore
    };
  }
};
