import { z } from 'zod';

export const savingsGoalSchema = z.object({
  goalName: z.string().trim().min(2).max(120),
  description: z.string().trim().max(500).optional().nullable(),
  targetAmount: z.coerce.number().positive(),
  currentAmount: z.coerce.number().nonnegative().default(0),
  targetDate: z.coerce.date(),
  icon: z.string().trim().min(1).max(32).default('piggy-bank')
});

export const updateSavingsGoalSchema = savingsGoalSchema.partial().extend({
  status: z.enum(['active', 'completed']).optional()
});

export const contributionSchema = z.object({
  amount: z.coerce.number().positive(),
  notes: z.string().trim().max(500).optional().nullable()
});
