import { prisma } from '../lib/prisma.js';
export const profileRepository = {
    get: (id) => prisma.profile.findUnique({ where: { id } }),
    upsert: (id, input) => prisma.profile.upsert({ where: { id }, create: { id, email: input.email, fullName: input.fullName, avatarUrl: input.avatarUrl }, update: input }),
    update: (id, input) => prisma.profile.update({ where: { id }, data: input })
};
