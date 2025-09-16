import { z } from 'zod';

// Define the environment schema
const envSchema = z.object({
  // Public environment variables
  NEXT_PUBLIC_ENVIRONMENT: z.string().default('production'),
  NEXT_PUBLIC_SITE_URL: z.string().default('http://localhost:3000'),

  // Auth
  BETTER_AUTH_SECRET: z.string(),
  GITHUB_CLIENT_ID: z.string(),
  GITHUB_CLIENT_SECRET: z.string(),
  GOOGLE_CLIENT_ID: z.string(),
  GOOGLE_CLIENT_SECRET: z.string(),

  // Superadmin emails
  SUPERADMIN: z
    .string()
    .transform((s) => (s ? s.split(',') : []))
    .pipe(z.array(z.string())),
});

export const getEnv = () => {
  // Parse and validate environment variables
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error(
      'L Invalid environment variables:',
      parsed.error.flatten().fieldErrors
    );

    throw new Error('Invalid environment variables');
  }

  return parsed.data;
};

// Type-safe environment variable access
export type EnvConvex = z.infer<typeof envSchema>;
