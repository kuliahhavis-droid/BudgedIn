import { z } from 'zod';

export const budgetCategorySchema = z.object({
  category: z.string().min(1, 'Category name is required'),
  allocatedAmount: z.coerce.number().min(0)
});

export const budgetSchema = z.object({
  month: z.coerce.number().min(1).max(12),
  year: z.coerce.number().min(2000),
  totalBudget: z.coerce.number().min(0),
  categories: z.array(budgetCategorySchema).default([]).refine((cats) => {
    const categoriesSet = new Set(cats.map(c => c.category));
    return categoriesSet.size === cats.length;
  }, { message: 'Duplicate categories are not allowed' })
});

export const updateBudgetSchema = budgetSchema.partial();

export const budgetQuerySchema = z.object({
  month: z.coerce.number().min(1).max(12).optional(),
  year: z.coerce.number().min(2000).optional()
});
