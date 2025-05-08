import dotenv from 'dotenv';
import { z } from 'zod';

dotenv.config();

const envSchema = z.object({
  PORT: z.string().default('3000'),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),

  ANTHROPIC_API_KEY: z.string(),
  ANTHROPIC_MODEL: z.string().default('claude-3-opus-20240229'),

  RATE_LIMIT_WINDOW_MS: z.string().transform(Number).default('60000'),
  RATE_LIMIT_MAX_REQUESTS: z.string().transform(Number).default('10'),

  LOG_LEVEL: z
    .enum(['fatal', 'error', 'warn', 'info', 'debug', 'trace'])
    .default('info'),
});

const env = envSchema.safeParse(process.env);

if (!env.success) {
  throw new Error('Invalid environment variables');
}

export const config = {
  server: {
    port: parseInt(env.data.PORT, 10),
    nodeEnv: env.data.NODE_ENV,
  },
  anthropic: {
    apiKey: env.data.ANTHROPIC_API_KEY,
    model: env.data.ANTHROPIC_MODEL,
  },
  rateLimit: {
    windowMs: env.data.RATE_LIMIT_WINDOW_MS,
    maxRequests: env.data.RATE_LIMIT_MAX_REQUESTS,
  },
  logging: {
    level: env.data.LOG_LEVEL,
  },
};
