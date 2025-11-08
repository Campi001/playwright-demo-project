import { config } from 'dotenv';
import { z } from 'zod';

config();

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  PORT: z.coerce.number().positive().int().default(3001),
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters long'),
});

export const env = envSchema.parse(process.env);
