import { zid } from 'convex-helpers/server/zod';
import { z } from 'zod';

import { createAuthMutation, createPublicQuery } from './functions';
import { updateSettingsSchema } from './userShared';

// Check if user is authenticated
export const getIsAuthenticated = createPublicQuery({
  publicOnly: true,
})({
  returns: z.boolean(),
  handler: async (ctx) => {
    return !!(await ctx.auth.getUserIdentity());
  },
});

// Get session user (minimal data)
export const getSessionUser = createPublicQuery()({
  returns: z.union([
    z.object({
      id: zid('user'),
      _id: zid('user'),
      _creationTime: z.number(),
      activeOrganization: z.object({
        id: zid('organization'),
        createdAt: z.number(),
        logo: z.string().nullish(),
        monthlyCredits: z.number(),
        name: z.string(),
        role: z.string(),
        slug: z.string(),
      }),
      bio: z.string().nullish(),
      createdAt: z.number(),
      email: z.string(),
      emailVerified: z.boolean(),
      firstName: z.string().nullish(),
      github: z.string().nullish(),
      image: z.string().nullish(),
      isAdmin: z.boolean(),
      lastName: z.string().nullish(),
      lastActiveOrganizationId: zid('organization').nullish(),
      linkedin: z.string().nullish(),
      location: z.string().nullish(),
      name: z.string(),
      personalOrganizationId: zid('organization').nullish(),
      plan: z.enum(['premium', 'team']).optional(),
      role: z.string().nullish(),
      banned: z.boolean().nullish(),
      banReason: z.string().nullish(),
      banExpires: z.number().nullish(),
      session: z.object({
        id: zid('session'),
        activeOrganizationId: zid('organization').nullish(),
        createdAt: z.number(),
        expiresAt: z.number(),
        impersonatedBy: z.string().nullish(),
        ipAddress: z.string().nullish(),
        token: z.string(),
        updatedAt: z.number(),
        userAgent: z.string().nullish(),
        userId: zid('user'),
      }),
      updatedAt: z.number(),
      username: z.string().nullish(),
      website: z.string().nullish(),
      x: z.string().nullish(),
    }),
    z.null(),
  ]),
  handler: async ({ user: userEnt }) => {
    if (!userEnt) {
      return null;
    }

    const { doc, edge, edgeX, ...user } = userEnt;

    return user;
  },
});

// Get full user data for the authenticated user
export const getCurrentUser = createPublicQuery()({
  returns: z.union([
    z.object({
      id: zid('user'),
      activeOrganization: z.object({
        id: z.string(),
        createdAt: z.any(),
        logo: z.string().nullish(),
        name: z.string(),
        role: z.string(),
        slug: z.string(),
      }),
      image: z.string().nullish(),
      isAdmin: z.boolean(),
      name: z.string().optional(),
      personalOrganizationId: z.string().optional(),
      session: z.object({
        activeOrganizationId: z.string().nullable().optional(),
        impersonatedBy: z.string().nullable().optional(),
        token: z.string(),
        userId: z.string(),
      }),
    }),
    z.null(),
  ]),
  handler: async (ctx) => {
    const { user: userEnt } = ctx;

    if (!userEnt) {
      return null;
    }

    const {
      id,
      activeOrganization,
      image,
      isAdmin,
      name,
      personalOrganizationId,
      session,
    } = userEnt;

    return {
      id,
      activeOrganization,
      image,
      isAdmin,
      name,
      personalOrganizationId,
      session: {
        activeOrganizationId: session.activeOrganizationId,
        impersonatedBy: session.impersonatedBy,
        token: session.token,
        userId: session.userId,
      },
    };
  },
});

// Update user settings
export const updateSettings = createAuthMutation()({
  args: updateSettingsSchema,
  returns: z.object({ success: z.boolean() }),
  handler: async (ctx, args) => {
    const { user } = ctx;
    const { bio, name } = args;

    // Build update object
    const updateData: Record<string, any> = {};

    if (bio !== undefined) updateData.bio = bio;
    if (name !== undefined) updateData.name = name;

    await user.patch(updateData);

    return { success: true };
  },
});
