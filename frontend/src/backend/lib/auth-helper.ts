import { createRemoteJWKSet, jwtVerify } from 'jose';
import { prisma } from './prisma';

let jwks: ReturnType<typeof createRemoteJWKSet> | null = null;

const getJwks = () => {
  if (jwks) {
    return jwks;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!supabaseUrl) {
    throw new Error('Supabase URL is not configured. Set SUPABASE_URL or NEXT_PUBLIC_SUPABASE_URL.');
  }

  jwks = createRemoteJWKSet(new URL(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/.well-known/jwks.json`));
  return jwks;
};

export interface UserClaims {
  id: string;
  email?: string;
  role?: string;
}

export async function verifyAuth(req: Request): Promise<UserClaims> {
  try {
    const authHeader = req.headers.get('authorization');
    let token = '';

    if (authHeader?.startsWith('Bearer ')) {
      token = authHeader.slice('Bearer '.length);
    } else {
      // Try from URL query string (for Server-Sent Events)
      const { searchParams } = new URL(req.url);
      token = searchParams.get('token') || '';
    }

    if (!token) {
      throw new Error('Missing bearer token');
    }

    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
    const audience = process.env.JWT_AUDIENCE || 'authenticated';
    const issuer = process.env.JWT_ISSUER || (supabaseUrl ? `${supabaseUrl.replace(/\/$/, '')}/auth/v1` : undefined);

    const { payload } = await jwtVerify(token, getJwks(), {
      audience,
      issuer
    });

    const user: UserClaims = {
      id: payload.sub ?? '',
      email: typeof payload.email === 'string' ? payload.email : undefined,
      role: typeof payload.role === 'string' ? payload.role : undefined
    };

    if (!user.id) {
      throw new Error('Invalid token payload: missing sub (user ID)');
    }

    // Auto-create profile if missing in our local database schema
    if (user.email) {
      const fullName = (payload.user_metadata as any)?.full_name || user.email.split('@')[0];
      await prisma.profile.upsert({
        where: { id: user.id },
        create: {
          id: user.id,
          email: user.email,
          fullName
        },
        update: {}
      });
    }

    return user;
  } catch (error: any) {
    console.error('Authentication Error:', error.message || error);
    throw new Error('Unauthorized');
  }
}
