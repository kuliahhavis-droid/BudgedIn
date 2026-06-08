import { z } from 'zod';
export const paginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    limit: z.coerce.number().int().min(1).max(100).default(20),
    search: z.string().trim().optional(),
    sortBy: z.string().trim().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('desc')
});
export const idParamSchema = z.object({
    id: z.string().uuid()
});
export const validateBody = (schema) => (payload) => schema.parse(payload);
