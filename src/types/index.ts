export type TransactionType = 'income' | 'expense';
export type SavingsGoalStatus = 'active' | 'completed';
export type NotificationType = 'budget_warning' | 'budget_critical' | 'overspending' | 'goal_achievement' | 'general';
export type BudgetStatus = 'safe' | 'warning' | 'critical' | 'over_budget';

export const INCOME_CATEGORIES = ['Gaji', 'Beasiswa', 'Pekerjaan Lepas', 'Dukungan Keluarga', 'Lainnya'] as const;
export const EXPENSE_CATEGORIES = ['Makanan', 'Transportasi', 'Sewa', 'Pendidikan', 'Hiburan', 'Belanja', 'Internet', 'Lainnya'] as const;
export const BUDGET_CATEGORIES = ['Makanan', 'Transportasi', 'Sewa', 'Pendidikan', 'Hiburan', 'Belanja', 'Internet'] as const;

export interface Profile {
  id: string;
  email: string;
  fullName: string;
  avatarUrl: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  title: string;
  description: string | null;
  amount: number;
  type: TransactionType;
  category: string;
  transactionDate: string;
  notes?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Budget {
  id: string;
  userId: string;
  month: number;
  year: number;
  totalBudget: number;
  categories: BudgetCategory[];
  createdAt: string;
  updatedAt: string;
}

export interface BudgetCategory {
  id: string;
  budgetId: string;
  category: string;
  allocatedAmount: number;
  spentAmount?: number;
  createdAt: string;
}

export interface BudgetWithSpending extends Budget {
  totalSpent: number;
  totalRemaining: number;
  percentageUsed: number;
  status: BudgetStatus;
}

export interface SavingsGoal {
  id: string;
  userId: string;
  goalName: string;
  description: string | null;
  targetAmount: number;
  currentAmount: number;
  targetDate: string;
  status: SavingsGoalStatus;
  icon: string;
  contributions?: SavingsTransaction[];
  createdAt: string;
  updatedAt: string;
}

export interface SavingsTransaction {
  id: string;
  goalId: string;
  amount: number;
  notes: string | null;
  createdAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: string;
}

// API types
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// Form input types
export interface CreateTransactionInput {
  title: string;
  description?: string;
  amount: number;
  type: TransactionType;
  category: string;
  transactionDate: string;
  notes?: string;
}

export interface UpdateTransactionInput extends Partial<CreateTransactionInput> {}

export interface CreateBudgetInput {
  month: number;
  year: number;
  totalBudget: number;
  categories: { category: string; allocatedAmount: number }[];
}

export interface UpdateBudgetInput extends Partial<CreateBudgetInput> {}

export interface CreateGoalInput {
  goalName: string;
  description?: string;
  targetAmount: number;
  targetDate: string;
  icon: string;
}

export interface UpdateGoalInput extends Partial<CreateGoalInput> {}

export interface ContributeInput {
  amount: number;
  notes?: string;
}

export interface UpdateProfileInput {
  fullName?: string;
  avatarUrl?: string;
}

export interface TransactionFilters {
  page?: number;
  limit?: number;
  search?: string;
  type?: TransactionType;
  category?: string;
  from?: string;
  to?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface DashboardData {
  currentBalance: number;
  totalIncome: number;
  totalExpenses: number;
  totalTransactions: number;
  recentTransactions: Transaction[];
  monthlyOverview: { month: string; income: number; expense: number }[];
  budgetOverview: BudgetWithSpending | null;
  savingsGoals: SavingsGoal[];
  healthScore: number;
}

export interface MonthlyReport {
  month: number;
  year: number;
  totalIncome: number;
  totalExpense: number;
  savings: number;
  budgetPerformance: number;
  byCategory: { category: string; income: number; expense: number }[];
  transactions: any[];
}
