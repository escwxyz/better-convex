import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';
import { authMutation, optionalAuthQuery, publicQuery } from '../lib/crpc';

/** Get session user - used by AuthSync and authAction */
export const getSessionUser = optionalAuthQuery
  .output(
    z.union([
      z.object({
        id: zid('user'),
        activeOrganization: z
          .object({
            id: zid('organization'),
            logo: z.string().nullish(),
            name: z.string(),
            role: z.string(),
            slug: z.string(),
          })
          .nullable(),
        image: z.string().nullish(),
        isAdmin: z.boolean(),
        name: z.string().optional(),
        personalOrganizationId: zid('organization').optional(),
        plan: z.string().optional(),
      }),
      z.null(),
    ])
  )
  .query(async ({ ctx }) => {
    const { user } = ctx;
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      activeOrganization: user.activeOrganization ?? null,
      image: user.image,
      isAdmin: user.isAdmin ?? false,
      name: user.name,
      personalOrganizationId: user.personalOrganizationId,
      plan: user.plan,
    };
  });

/** Check if user is authenticated */
export const getIsAuthenticated = publicQuery
  .output(z.boolean())
  .query(async ({ ctx }) => !!(await ctx.auth.getUserIdentity()));

/** Get full user data for the authenticated user */
export const getCurrentUser = optionalAuthQuery
  .output(
    z.union([
      z.object({
        id: zid('user'),
        activeOrganization: z
          .object({
            id: zid('organization'),
            logo: z.string().nullish(),
            name: z.string(),
            role: z.string(),
            slug: z.string(),
          })
          .nullable(),
        image: z.string().nullish(),
        isAdmin: z.boolean(),
        name: z.string().optional(),
        personalOrganizationId: zid('organization').optional(),
        plan: z.string().optional(),
      }),
      z.null(),
    ])
  )
  .query(async ({ ctx }) => {
    const { user } = ctx;
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      activeOrganization: user.activeOrganization ?? null,
      image: user.image,
      isAdmin: user.isAdmin ?? false,
      name: user.name,
      personalOrganizationId: user.personalOrganizationId,
      plan: user.plan,
    };
  });

/** Update user settings */
export const updateSettings = authMutation
  .input(
    z.object({
      bio: z.string().optional(),
      name: z.string().optional(),
    })
  )
  .output(z.object({ success: z.boolean() }))
  .mutation(async ({ ctx, input }) => {
    const { userId } = ctx;
    const { bio, name } = input;

    const updateData: Record<string, string> = {};

    if (bio !== undefined) {
      updateData.bio = bio;
    }
    if (name !== undefined) {
      updateData.name = name;
    }

    await ctx.db.patch(userId, updateData);

    return { success: true };
  });
