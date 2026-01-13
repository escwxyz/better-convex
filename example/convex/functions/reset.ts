/** biome-ignore-all lint/suspicious/noExplicitAny: dev */
import { CRPCError } from 'better-convex/server';
import { z } from 'zod';
import { privateAction, privateMutation, privateQuery } from '../lib/crpc';
import type { Ent } from '../lib/ents';
import { getEnv } from '../lib/get-env';
import { deletePolarCustomers } from '../lib/polar-helpers';
import { internal } from './_generated/api';
import type { TableNames } from './_generated/dataModel';
import schema from './schema';

const DELETE_BATCH_SIZE = 64;

// Clear all of the tables except...
const excludedTables = new Set<TableNames>();

/** Dev-only check helper */
const assertDevOnly = () => {
  if (getEnv().DEPLOY_ENV === 'production') {
    throw new CRPCError({
      code: 'FORBIDDEN',
      message: 'This function is only available in development',
    });
  }
};

export const reset = privateAction.output(z.null()).action(async ({ ctx }) => {
  assertDevOnly();
  // Delete all Polar customers first (comprehensive cleanup)
  await deletePolarCustomers();

  for (const tableName of Object.keys(schema.tables)) {
    if (excludedTables.has(tableName as TableNames)) {
      continue;
    }

    await ctx.scheduler.runAfter(0, internal.reset.deletePage, {
      cursor: null,
      tableName,
    });
  }

  return null;
});

export const deletePage = privateMutation
  .input(
    z.object({
      cursor: z.union([z.string(), z.null()]),
      tableName: z.string(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    assertDevOnly();
    // Use ctx.table for proper trigger handling
    const results = await ctx
      .table(input.tableName as any)
      .paginate({ cursor: input.cursor, numItems: DELETE_BATCH_SIZE });

    for (const row of results.page) {
      try {
        // Use ctx.table to delete, which will properly trigger aggregates
        await ctx
          .table(input.tableName as any)
          .getX(row._id)
          .delete();
      } catch {
        // Document might have been deleted by a trigger or concurrent process
      }
    }

    if (!results.isDone) {
      await ctx.scheduler.runAfter(0, internal.reset.deletePage, {
        cursor: results.continueCursor,
        tableName: input.tableName,
      });
    }

    return null;
  });

export const getAdminUsers = privateQuery
  .output(
    z.array(
      z.object({
        customerId: z.string().optional().nullable(),
      })
    )
  )
  .query(async ({ ctx }) => {
    assertDevOnly();
    const adminEmails = getEnv().ADMIN;

    // Get all admin users by their emails
    const adminUsers: Ent<'user'>[] = [];

    for (const email of adminEmails) {
      const user = await ctx.table('user').get('email', email);

      if (user) {
        adminUsers.push(user);
      }
    }

    // Filter and return only users with customer IDs
    return adminUsers
      .filter((user) => user.customerId)
      .map((user) => ({ customerId: user.customerId! }));
  });
