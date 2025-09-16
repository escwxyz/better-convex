import { z } from 'zod';

import { components, internal } from './_generated/api';
import { createInternalMutation, createAuthMutation } from './functions';

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
          const result: any = await ctx.runMutation(
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

/** Reset all app data (except users and auth tables) */
export const resetAppData = createAuthMutation()({
  args: {},
  returns: z.object({
    deletedCounts: z.record(z.string(), z.number()),
    totalDeleted: z.number(),
  }),
  handler: async (ctx) => {
    console.info('🗑️ Resetting app data...');

    const deletedCounts: Record<string, number> = {};
    let totalDeleted = 0;

    // IMPORTANT: Delete order matters with Convex Ents cascade deletes!
    // We delete parent entities first, which cascade delete their children

    // 1. Delete projects - this cascades to delete all todos and their comments
    const projects = await ctx.table('projects').take(20);
    for (const project of projects) {
      await ctx.table('projects').getX(project._id).delete();
      deletedCounts.projects = (deletedCounts.projects || 0) + 1;
      totalDeleted++;
    }

    // Continue deleting projects in batches
    let hasMoreProjects = projects.length === 20;
    while (hasMoreProjects) {
      const moreProjects = await ctx.table('projects').take(20);
      for (const project of moreProjects) {
        await ctx.table('projects').getX(project._id).delete();
        deletedCounts.projects = (deletedCounts.projects || 0) + 1;
        totalDeleted++;
      }
      hasMoreProjects = moreProjects.length === 20;
    }

    // 2. Delete orphaned todos (those without projects)
    // Note: Todos use soft deletion, so they'll be marked as deleted
    const orphanTodos = await ctx
      .table('todos')
      .filter((q) => q.eq(q.field('projectId'), undefined))
      .take(20);

    for (const todo of orphanTodos) {
      await ctx.table('todos').getX(todo._id).delete();
      deletedCounts.todos = (deletedCounts.todos || 0) + 1;
      totalDeleted++;
    }

    // Continue with orphan todos
    let hasMoreTodos = orphanTodos.length === 20;
    while (hasMoreTodos) {
      const moreTodos = await ctx
        .table('todos')
        .filter((q) => q.eq(q.field('projectId'), undefined))
        .take(20);

      for (const todo of moreTodos) {
        await ctx.table('todos').getX(todo._id).delete();
        deletedCounts.todos = (deletedCounts.todos || 0) + 1;
        totalDeleted++;
      }
      hasMoreTodos = moreTodos.length === 20;
    }

    // 3. Delete tags (independent entities)
    const tags = await ctx.table('tags').take(50);
    for (const tag of tags) {
      await ctx.table('tags').getX(tag._id).delete();
      deletedCounts.tags = (deletedCounts.tags || 0) + 1;
      totalDeleted++;
    }

    let hasMoreTags = tags.length === 50;
    while (hasMoreTags) {
      const moreTags = await ctx.table('tags').take(50);
      for (const tag of moreTags) {
        await ctx.table('tags').getX(tag._id).delete();
        deletedCounts.tags = (deletedCounts.tags || 0) + 1;
        totalDeleted++;
      }
      hasMoreTags = moreTags.length === 50;
    }

    // 4. Clean up orphaned join tables (these don't cascade)
    // Use internal mutation for these to bypass triggers
    const joinTablesResult = await ctx.runMutation(
      internal.reset.cleanupJoinTables,
      {}
    );

    Object.entries(joinTablesResult.deletedCounts).forEach(([table, count]) => {
      deletedCounts[table] = count as number;
      totalDeleted += count as number;
    });

    console.info('');
    console.info(`🎯 App data reset complete!`);
    console.info(`   Total documents deleted: ${totalDeleted}`);
    console.info(`   Tables affected: ${Object.keys(deletedCounts).length}`);

    return {
      deletedCounts,
      totalDeleted,
    };
  },
});

/** Internal mutation to clean up join tables without triggers */
export const cleanupJoinTables = createInternalMutation()({
  args: {},
  returns: z.object({
    deletedCounts: z.record(z.string(), z.number()),
  }),
  handler: async (ctx) => {
    const deletedCounts: Record<string, number> = {};

    // Clean up join tables using raw db to bypass triggers
    const joinTables = [
      'todoTags',
      'projectMembers',
      'commentReplies',
    ] as const;

    for (const tableName of joinTables) {
      let count = 0;
      let hasMore = true;

      while (hasMore) {
        const items = await ctx.db.query(tableName).take(100);

        if (items.length === 0) {
          hasMore = false;
          break;
        }

        for (const item of items) {
          await ctx.db.delete(item._id);
          count++;
        }

        hasMore = items.length === 100;
      }

      if (count > 0) {
        deletedCounts[tableName] = count;
        console.info(`  ✅ Deleted ${count} ${tableName} (join table)`);
      }
    }

    return { deletedCounts };
  },
});
