import { ConvexError } from 'convex/values';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import { authMutation, authQuery } from '../lib/crpc';
import { aggregateUsers } from './aggregates';

// Admin operations that work with our application's user role system
// Better Auth's admin plugin handles banning, sessions, etc. through the client

// Check if a user has admin privileges in our system
export const checkUserAdminStatus = authQuery
  .meta({ role: 'admin' })
  .input(z.object({ userId: zid('user') }))
  .output(
    z.object({
      isAdmin: z.boolean(),
      role: z.string().nullish(),
    })
  )
  .query(async ({ ctx, input }) => {
    const user = await ctx.table('user').getX(input.userId);

    return {
      isAdmin: user.role === 'admin',
      role: user.role,
    };
  });

// Update user role
export const updateUserRole = authMutation
  .meta({ role: 'admin' })
  .input(
    z.object({
      role: z.enum(['user', 'admin']),
      userId: zid('user'),
    })
  )
  .output(z.boolean())
  .mutation(async ({ ctx, input }) => {
    // Only admin can promote to admin
    if (input.role === 'admin' && !ctx.user.isAdmin) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only admin can promote users to admin',
      });
    }

    const targetUser = await ctx.table('user').getX(input.userId);

    // Can't demote admin unless you are admin
    if (targetUser.role === 'admin' && !ctx.user.isAdmin) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Cannot modify admin users',
      });
    }

    await targetUser.patch({
      role: input.role.toLowerCase(),
    });

    return true;
  });

// Grant admin access to a user based on their email (for admin setup)
export const grantAdminByEmail = authMutation
  .meta({ role: 'admin' })
  .input(
    z.object({
      email: z.string().email(),
      role: z.enum(['admin']),
    })
  )
  .output(
    z.object({
      success: z.boolean(),
      userId: zid('user').optional(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const user = await ctx.table('user').get('email', input.email);

    if (!user) {
      return {
        success: false,
      };
    }

    await user.patch({
      role: input.role.toLowerCase(),
    });

    return {
      success: true,
      userId: user._id,
    };
  });

// Schema for user list items
const UserListItemSchema = z.object({
  _id: zid('user'),
  _creationTime: z.number(),
  name: z.string().optional(),
  email: z.string(),
  image: z.string().nullish(),
  role: z.string(),
  isBanned: z.boolean().optional(),
  banReason: z.string().nullish(),
  banExpiresAt: z.number().nullish(),
});

// Get all users with pagination for admin dashboard
export const getAllUsers = authQuery
  .input(
    z.object({
      role: z.enum(['all', 'user', 'admin']).optional(),
      search: z.string().optional(),
    })
  )
  .paginated({ limit: 20, item: UserListItemSchema.nullable() })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };
    // Build query
    const query = ctx.table('user');

    // Filter by search term if provided
    if (input.search) {
      const searchLower = input.search.toLowerCase();

      // For now, just paginate and filter in memory
      // You can add a search index later for better performance
      const result = await query.paginate(paginationOpts);

      const enrichedPage = await Promise.all(
        result.page.map(async (user) => {
          const email = user?.email || '';

          // Check if any field matches search
          if (
            !(
              user.name?.toLowerCase().includes(searchLower) ||
              email.toLowerCase().includes(searchLower)
            )
          ) {
            return null;
          }

          return {
            ...user.doc(),
            banExpiresAt: user?.banExpires,
            banReason: user?.banReason,
            email,
            isBanned: user?.banned,
            role: user?.role || 'user',
          };
        })
      );

      return {
        ...result,
        page: enrichedPage.filter(Boolean),
      };
    }

    // Regular pagination without search
    const result = await query.paginate(paginationOpts);

    const enrichedPage = await Promise.all(
      result.page.map(async (user) => {
        const userData = {
          ...user.doc(),
          banExpiresAt: user?.banExpires,
          banReason: user?.banReason,
          email: user?.email || '',
          isBanned: user?.banned,
          role: user?.role || 'user',
        };

        // Filter by role if specified
        if (
          input.role &&
          input.role !== 'all' &&
          userData.role !== input.role
        ) {
          return null;
        }

        return userData;
      })
    );

    return {
      ...result,
      page: enrichedPage.filter(Boolean),
    };
  });

// Get admin dashboard statistics
export const getDashboardStats = authQuery
  .meta({ role: 'admin' })
  .output(
    z.object({
      recentUsers: z.array(
        z.object({
          _id: zid('user'),
          _creationTime: z.number(),
          image: z.string().nullish(),
          name: z.string().optional(),
        })
      ),
      totalAdmins: z.number(),
      totalUsers: z.number(),
      userGrowth: z.array(
        z.object({
          count: z.number(),
          date: z.string(),
        })
      ),
    })
  )
  .query(async ({ ctx }) => {
    // Get recent users
    const recentUsers = await ctx
      .table('user')
      .order('desc')
      .take(5)
      .map(async (user) => ({
        _id: user._id,
        _creationTime: user._creationTime,
        image: user.image,
        name: user.name,
      }));

    // Get users from last 7 days for growth calculation
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    const usersLast7Days = await ctx
      .table('user')
      .filter((q) => q.gte(q.field('_creationTime'), sevenDaysAgo))
      .take(1000); // Reasonable limit for 7 days of users

    // Calculate user growth for last 7 days
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;
    const userGrowth: { count: number; date: string }[] = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * oneDay);
      const startOfDay = new Date(date.setHours(0, 0, 0, 0)).getTime();
      const endOfDay = new Date(date.setHours(23, 59, 59, 999)).getTime();

      const count = usersLast7Days.filter(
        (user) =>
          user._creationTime >= startOfDay && user._creationTime <= endOfDay
      ).length;

      userGrowth.push({
        count,
        date: new Date(startOfDay).toISOString().split('T')[0],
      });
    }

    // Count admins from last 100 users (representative sample)
    const sampleUsers = await ctx.table('user').take(100);
    let adminCount = 0;

    for (const user of sampleUsers) {
      if (user.role === 'admin') {
        adminCount++;
      }
    }

    // Get exact user count using aggregate - O(log n) performance!
    const totalUsers = await aggregateUsers.count(ctx, {
      bounds: {},
      namespace: 'global',
    });

    // Estimate total admins based on sample
    const estimatedAdmins = Math.round(
      (adminCount / sampleUsers.length) * totalUsers
    );

    return {
      recentUsers,
      totalAdmins: estimatedAdmins,
      totalUsers,
      userGrowth,
    };
  });
