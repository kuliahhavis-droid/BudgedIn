import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().int().positive().default(4000),
  CORS_ORIGIN: z.string().default('http://localhost:3000'),
  SUPABASE_URL: z.string().url().optional(),
  SUPABASE_ANON_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),
  SUPABASE_JWT_SECRET: z.string().optional(),
  DATABASE_URL: z.string().min(1).optional(),
  DIRECT_URL: z.string().optional(),
  JWT_AUDIENCE: z.string().default('authenticated'),
  JWT_ISSUER: z.string().optional(),
  GEMINI_API_KEY: z.string().optional()
});

export const env = envSchema.parse(process.env);
