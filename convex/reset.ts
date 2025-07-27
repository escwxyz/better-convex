import { z } from 'zod';

import { components } from './_generated/api';
import { createInternalMutation } from './functions';

/** Reset only better-auth tables Usage: npx convex run reset:betterAuth */
export const resetAuth = createInternalMutation()({
  args: {},
  returns: z.object({
    deletedCounts: z.record(z.string(), z.number()),
    totalDeleted: z.number(),
  }),
  handler: async (ctx) => {
    console.info('🗑️ Resetting better-auth tables...');

    const deletedCounts: Record<string, number> = {};
    let totalDeleted = 0;

    const betterAuthTables = [
      'account',
      'apikey',
      'invitation',
      'jwks',
      'member',
      'oauthAccessToken',
      'oauthApplication',
      'oauthConsent',
      'organization',
      'passkey',
      'rateLimit',
      'session',
      'ssoProvider',
      'subscription',
      'team',
      'twoFactor',
      'user',
      'verification',
    ] as const;

    for (const tableName of betterAuthTables) {
      try {
        let count = 0;
        let hasMore = true;
        let cursor: string | null = null;

        // Delete all documents using pagination
        while (hasMore) {
          const result = await ctx.runMutation(
            components.betterAuth.lib.deleteMany,
            {
              model: tableName,
              paginationOpts: {
                cursor,
                numItems: 100,
              },
            }
          );

          count += result.count || 0;
          hasMore = !result.isDone;
          cursor = result.continueCursor || null;
        }

        if (count > 0) {
          deletedCounts[tableName] = count;
          totalDeleted += count;
          console.info(`  ✅ Deleted ${count} documents from ${tableName}`);
        }
      } catch (error) {
        console.info(
          `  ⏭️  Skipped ${tableName} (table not found or error: ${error})`
        );
      }
    }

    console.info('');
    console.info(`🎯 Better-auth reset complete!`);
    console.info(`   Total documents deleted: ${totalDeleted}`);
    console.info(`   Tables affected: ${Object.keys(deletedCounts).length}`);

    return {
      deletedCounts,
      totalDeleted,
    };
  },
});
