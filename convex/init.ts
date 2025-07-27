import { ConvexError } from 'convex/values';
import { z } from 'zod';

import { internal } from './_generated/api';
import { createInternalMutation } from './functions';

/**
 * Initialize the database on startup. This function runs automatically when
 * starting the dev server with --run init It checks if the database needs
 * seeding and runs the seed function if needed.
 */
export default createInternalMutation()({
  args: {},
  returns: z.null(),
  handler: async (ctx) => {
    try {
      // Check if we have any users in the database
      const userCount = await ctx.table('users').take(1);

      if (userCount.length === 0) {
        console.info('📊 Database is empty, running seed...');

        // Run the seed function
        await ctx.scheduler.runAfter(0, internal.seed.seed, {});

        console.info('✅ Seed scheduled successfully');
      }
    } catch (error) {
      console.error('❌ Initialization error:', error);

      throw new ConvexError({
        code: 'INITIALIZATION_FAILED',
        message: 'Failed to initialize database',
      });
    }

    return null;
  },
});
