import { createUser } from '@convex/authHelpers';
import { z } from 'zod';
import { internal } from './_generated/api';
import { createInternalMutation } from './functions';
import { getEnv } from './helpers/getEnv';

/**
 * Initialize the database on startup. This function runs automatically when
 * starting the dev server with --run init It checks if the database needs
 * seeding and runs the seed function if needed.
 */
export default createInternalMutation({
  devOnly: true,
})({
  args: {},
  returns: z.null(),
  handler: async (ctx) => {
    // Initialize admin user if configured
    const env = getEnv();
    const adminEmails = env.ADMIN;

    if (!adminEmails || adminEmails.length === 0) {
      return null;
    }

    let isFirstInit = true;

    for (const adminEmail of adminEmails) {
      // Check if user exists in our app table by email
      const existingUser = await ctx.table('user').get('email', adminEmail);

      if (existingUser) {
        isFirstInit = false;
      } else {
        // Better Auth will link to this when they sign in
        const _userId = await createUser(ctx, {
          email: adminEmail,
          name: 'Admin',
          role: 'admin',
        });
      }
    }

    if (isFirstInit && getEnv().DEPLOY_ENV === 'development') {
      // Run the seed function
      await ctx.runMutation(internal.seed.seed, {});
    }

    return null;
  },
});
