import { z } from 'zod';
import { paginationQuerySchema } from './common.validator';

export const transactionSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().optional(),
  notes: z.string().optional(),
  amount: z.coerce.number().positive(),
  type: z.enum(['income', 'expense']),
  category: z.string().min(1, 'Category is required'),
  transactionDate: z.coerce.date()
});

export const updateTransactionSchema = transactionSchema.partial();

export const transactionQuerySchema = paginationQuerySchema.extend({
  type: z.enum(['income', 'expense']).optional(),
  category: z.string().optional(),
  from: z.coerce.date().optional(),
  to: z.coerce.date().optional()
});
