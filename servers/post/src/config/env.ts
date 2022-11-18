import * as dotenv from 'dotenv';
dotenv.config();
import { z } from 'zod';

const envSchema = z.object({
  PORT: z.string(),
  NODE_ENV: z.enum(['production', 'development']).default('development'),
});

const formatZodError = (error: z.ZodError) => {
  return error.issues
    .map((issue) => {
      // add emoji to error message
      return `❌ ${issue.path.join('.')} - ${issue.message}`;
    })
    .join('\n');
};

const initEnv = () => {
  console.log('🏁 Initializing environment variables');

  const env = envSchema.safeParse(process.env);
  if (!env.success) {
    console.log(
      `⛔️ Environment variables are not valid:\n${formatZodError(env.error)}`
    );
    throw new Error('Invalid env variables');
  }
  return env;
};

export const env = initEnv().data;
