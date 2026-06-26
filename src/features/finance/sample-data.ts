export type Transaction = {
  id: string;
  title: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  date: string;
};

export const transactions: Transaction[] = [
  { id: '1', title: 'Scholarship payout', description: 'Spring semester stipend', amount: 1200, type: 'income', category: 'Scholarship', date: '2026-06-01' },
  { id: '2', title: 'Campus cafeteria', description: 'Lunch and coffee', amount: 12.8, type: 'expense', category: 'Food', date: '2026-06-02' },
  { id: '3', title: 'Bus pass', description: 'Monthly student pass', amount: 38, type: 'expense', category: 'Transportation', date: '2026-06-01' },
  { id: '4', title: 'Freelance landing page', description: 'Client milestone', amount: 260, type: 'income', category: 'Freelance', date: '2026-05-29' },
  { id: '5', title: 'Textbooks', description: 'Used economics books', amount: 74.5, type: 'expense', category: 'Education', date: '2026-05-28' },
  { id: '6', title: 'Shared rent', description: 'June room payment', amount: 420, type: 'expense', category: 'Rent', date: '2026-06-01' },
  { id: '7', title: 'Family support', description: 'Monthly support', amount: 350, type: 'income', category: 'Family Support', date: '2026-05-25' },
  { id: '8', title: 'Internet bill', description: 'Dorm connection', amount: 24, type: 'expense', category: 'Internet', date: '2026-05-24' }
];

export const budgets = [
  { category: 'Food', allocated: 260, used: 184 },
  { category: 'Transportation', allocated: 90, used: 78 },
  { category: 'Rent', allocated: 450, used: 420 },
  { category: 'Education', allocated: 180, used: 74.5 },
  { category: 'Entertainment', allocated: 100, used: 42 },
  { category: 'Shopping', allocated: 140, used: 118 },
  { category: 'Internet', allocated: 40, used: 24 }
];

export const savingsGoals = [
  { id: 'g1', name: 'Emergency fund', description: 'Three months of basic expenses', target: 1500, current: 1020, targetDate: '2026-12-01', icon: 'shield' },
  { id: 'g2', name: 'Laptop upgrade', description: 'Reliable machine for design classes', target: 1200, current: 520, targetDate: '2026-09-15', icon: 'laptop' },
  { id: 'g3', name: 'Study trip', description: 'Conference and travel costs', target: 900, current: 225, targetDate: '2027-02-01', icon: 'plane' }
];

export const money = (value: number) =>
  new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(value);

export const budgetStatus = (percentage: number) => {
  if (percentage > 100) return { label: 'Over Budget', variant: 'danger' as const };
  if (percentage >= 81) return { label: 'Critical', variant: 'danger' as const };
  if (percentage >= 51) return { label: 'Warning', variant: 'warning' as const };
  return { label: 'Safe', variant: 'success' as const };
};

