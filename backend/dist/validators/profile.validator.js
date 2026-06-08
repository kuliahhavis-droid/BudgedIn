import { z } from 'zod';
export const upsertProfileSchema = z.object({
    email: z.string().email(),
    fullName: z.string().trim().min(2).max(120),
    avatarUrl: z.string().url().optional().nullable()
});
export const updateProfileSchema = z.object({
    fullName: z.string().trim().min(2).max(120).optional(),
    avatarUrl: z.string().url().optional().nullable()
});
