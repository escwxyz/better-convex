import { z } from 'zod';

import { createAuthMutation, createPublicQuery } from './functions';
import { updateSettingsSchema } from './userShared';

// Get full user data for the authenticated user
export const getCurrentUser = createPublicQuery()({
  handler: async ({ user }) => {
    if (!user) {
      return null;
    }

    return {
      ...user.doc(),
      id: user._id,
      credits: user.credits ?? 0,
      monthlyCredits: user.monthlyCredits ?? 0,
      isAdmin: user.isAdmin,
      isPremium: user.isPremium,
      isPremiumPlus: user.isPremiumPlus,
      isSubscribed: user.isSubscribed,
      isSuperAdmin: user.isSuperAdmin,
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
