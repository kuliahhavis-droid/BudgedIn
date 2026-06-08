import { createRemoteJWKSet, jwtVerify } from 'jose';
import { env } from '../config/env.js';
import { HttpError } from '../utils/http-error.js';
import { prisma } from '../lib/prisma.js';
let jwks = null;
const getJwks = () => {
    if (jwks) {
        return jwks;
    }
    if (!env.SUPABASE_URL) {
        throw new HttpError(500, 'Supabase URL is not configured');
    }
    jwks = createRemoteJWKSet(new URL(`${env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`));
    return jwks;
};
export const requireAuth = async (req, _res, next) => {
    try {
        const header = req.headers.authorization;
        let token = '';
        if (header?.startsWith('Bearer ')) {
            token = header.slice('Bearer '.length);
        }
        else if (typeof req.query.token === 'string') {
            token = req.query.token;
        }
        if (!token) {
            throw new HttpError(401, 'Missing bearer token');
        }
        const { payload } = await jwtVerify(token, getJwks(), {
            audience: env.JWT_AUDIENCE,
            issuer: env.JWT_ISSUER ?? (env.SUPABASE_URL ? `${env.SUPABASE_URL.replace(/\/$/, '')}/auth/v1` : undefined)
        });
        req.user = {
            id: payload.sub ?? '',
            email: typeof payload.email === 'string' ? payload.email : undefined,
            role: typeof payload.role === 'string' ? payload.role : undefined
        };
        if (!req.user.id) {
            throw new HttpError(401, 'Invalid token payload');
        }
        // Auto-create profile if missing
        if (req.user.email) {
            const fullName = payload.user_metadata?.full_name || req.user.email.split('@')[0];
            await prisma.profile.upsert({
                where: { id: req.user.id },
                create: {
                    id: req.user.id,
                    email: req.user.email,
                    fullName
                },
                update: {}
            });
        }
        next();
    }
    catch (error) {
        next(error);
    }
};
