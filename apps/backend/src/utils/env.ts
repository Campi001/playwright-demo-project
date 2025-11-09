import { config } from 'dotenv';
import { z } from 'zod';

config();

const DEV_FALLBACK_SECRET = 'dev-jwt-secret-should-be-very-long-1234567890';
const isProduction = process.env.NODE_ENV === 'production';
const isCI = process.env.CI === 'true';

if (!process.env.JWT_SECRET) {
  if (isProduction || isCI) {
    throw new Error('JWT_SECRET must be configured in production and CI environments.');
  }

  process.env.JWT_SECRET = DEV_FALLBACK_SECRET;
}

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().positive().int().default(4000),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
});

export const env = envSchema.parse(process.env);
