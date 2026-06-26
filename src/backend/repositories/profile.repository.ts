import { prisma } from '../lib/prisma';
import type { z } from 'zod';
import type { updateProfileSchema, upsertProfileSchema } from '../validators/profile.validator';

export type ProfileInput = z.infer<typeof upsertProfileSchema>;
export type ProfileUpdateInput = z.infer<typeof updateProfileSchema>;

export const profileRepository = {
  get: (id: string) => prisma.profile.findUnique({ where: { id } }),
  upsert: (id: string, input: ProfileInput) =>
    prisma.profile.upsert({ where: { id }, create: { id, email: input.email, fullName: input.fullName, avatarUrl: input.avatarUrl }, update: input }),
  update: (id: string, input: ProfileUpdateInput) => prisma.profile.update({ where: { id }, data: input }),
  resetData: (userId: string) => prisma.$transaction([
    prisma.transaction.deleteMany({ where: { userId } }),
    prisma.budget.deleteMany({ where: { userId } }),
    prisma.savingsGoal.deleteMany({ where: { userId } }),
    prisma.notification.deleteMany({ where: { userId } })
  ])
};
