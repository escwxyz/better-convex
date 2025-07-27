import {
  type AuthFunctions,
  type PublicAuthFunctions,
  BetterAuth,
  convexAdapter,
} from '@convex-dev/better-auth';
import { convex } from '@convex-dev/better-auth/plugins';
import { betterAuth } from 'better-auth';
import { entsTableFactory } from 'convex-ents';
import { customCtx } from 'convex-helpers/server/customFunctions';
import { zCustomQuery } from 'convex-helpers/server/zod';

import type { DataModel, Id } from './_generated/dataModel';

import { api, components, internal } from './_generated/api';
import {
  type GenericCtx,
  type MutationCtx,
  type QueryCtx,
  query,
} from './_generated/server';
import {
  getAuthUserId,
} from './functions';
import { getEnv } from './helpers/getEnv';
import { entDefinitions } from './schema';
import {
  generateFromUsername,
  generateUsername,
} from './user/generateFromUsername';
import { mapSessionToUser } from './user/mapSessionToUser';

const authFunctions: AuthFunctions = internal.auth;
const publicAuthFunctions: PublicAuthFunctions = api.auth;

export const betterAuthComponent = new BetterAuth(components.betterAuth, {
  authFunctions,
  publicAuthFunctions,
  verbose: false,
});

export const createAuth = (ctx: GenericCtx) => {
  const baseURL = process.env.NEXT_PUBLIC_SITE_URL!;

  return betterAuth({
    account: {
      accountLinking: {
        enabled: true,
        trustedProviders: ['google', 'github'],
      },
    },
    baseURL,
    database: convexAdapter(ctx, betterAuthComponent),
    plugins: [convex()],
    session: {
      expiresIn: 60 * 60 * 24 * 30, // 30 days
      updateAge: 60 * 60 * 24 * 15, // 15 days
    },
    socialProviders: {
      github: {
        clientId: process.env.GITHUB_CLIENT_ID!,
        clientSecret: process.env.GITHUB_CLIENT_SECRET!,
        mapProfileToUser: async (profile) => {
          // Store the profile data temporarily so we can access it in onCreateUser
          // const profileData = {
          //   bio: profile.bio || undefined,
          //   firstName: profile.name?.split(' ')[0] || undefined,
          //   github: profile.login,
          //   lastName: profile.name?.split(' ').slice(1).join(' ') || undefined,
          //   location: profile.location || undefined,
          //   x: profile.twitter_username || undefined,
          // };

          // // Store in a temporary map keyed by email
          // githubProfileCache.set(profile.email, profileData);

          // Only return the fields that better-auth expects
          return {
            email: profile.email,
            image: profile.avatar_url,
            name: profile.name || profile.login,
          };
        },
      },
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID!,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
        mapProfileToUser: async (profile) => {
          // Store the profile data temporarily
          // const profileData = {
          //   firstName: profile.given_name || undefined,
          //   lastName: profile.family_name || undefined,
          // };

          // googleProfileCache.set(profile.email, profileData);

          // Only return the fields that better-auth expects
          return {
            email: profile.email,
            image: profile.picture,
            name: profile.name,
          };
        },
      },
    },
    user: {
      changeEmail: {
        enabled: false,
      },
      deleteUser: {
        enabled: false,
      },
    },
  });
};

export const {
  createSession,
  createUser,
  deleteUser,
  isAuthenticated,
  updateUser,
} = betterAuthComponent.createAuthFunctions<DataModel>({
  onCreateUser: async (ctx, user) => {
    // Check if user already exists by email
    const table = entsTableFactory(ctx, entDefinitions);
    const existingUserByEmail = await table('users').get('email', user.email);

    if (existingUserByEmail) {
      // User already exists, return their ID instead of creating a new one
      return existingUserByEmail._id;
    }

    // Check if user is a superadmin
    const isSuperAdmin = getEnv().SUPERADMIN.includes(user.email);

    // Generate unique username
    let username = generateFromUsername(user.name || generateUsername());
    let usernameIdSize = 3;
    let retry = 10;

    // Check for existing username and generate a unique one
    while (retry > 0) {
      const existingUser = await table('users').get('username', username);

      if (!existingUser) {
        break;
      }

      retry -= 1;
      usernameIdSize += 1;
      username = generateFromUsername(
        user.name || generateUsername(),
        usernameIdSize
      );
    }

    // Create user in application users table
    const userId = await table('users').insert({
      // bio: profileData.bio || undefined,
      credits: 0,
      deletedAt: undefined,
      email: user.email,
      emailVerified: user.emailVerified || false,
      // firstName: profileData.firstName || user.name?.split(' ')[0] || undefined,
      // github: profileData.github || undefined,
      image: user.image || undefined,
      // lastName:
      //   profileData.lastName ||
      //   user.name?.split(' ').slice(1).join(' ') ||
      //   undefined,
      // linkedin: profileData.linkedin || undefined,
      // location: profileData.location || undefined,
      monthlyCredits: 0,
      monthlyCreditsPeriodCount: 0,
      monthlyCreditsPeriodStart: undefined,
      name: user.name || undefined,
      profileImageUrl: user.image || undefined,
      role: isSuperAdmin ? 'SUPERADMIN' : 'USER',
      stripeCancelAtPeriodEnd: undefined,
      stripeCurrentPeriodEnd: undefined,
      stripeCurrentPeriodStart: undefined,
      stripeCustomerId: undefined,
      stripePriceId: undefined,
      stripeSubscriptionId: undefined,
      stripeSubscriptionStatus: undefined,
      username,
      usernameUpdatedAt: undefined,
      // website: profileData.website || undefined,
      // x: profileData.x || undefined,
    });

    // Automatically create a character for the new user
    try {
      const characterName = user.name || username;
      const characterId = await ctx.db.insert('characters', {
        private: false, // Public by default
        userId: userId,

        // Basic info
        image: user.image || undefined,
        name: characterName,

        // Arrays & metadata
        categories: [],

        // Hide flags
        awardsHide: false,
        certificatesHide: false,
        educationHide: false,
        interestsHide: false,
        languagesHide: false,
        projectsHide: false,
        publicationsHide: false,
        referencesHide: false,
        skillsHide: false,
        volunteerHide: false,
        workHide: false,
      });

      // Set as main character
      await ctx.db.patch(userId, { mainCharacterId: characterId });
    } catch (error) {
      // Don't fail user creation if character creation fails
      console.error('Failed to create character for new user:', error);
    }

    return userId;
  },
  onDeleteUser: async (ctx, userId) => {
    // Delete user from database
    const table = entsTableFactory(ctx, entDefinitions);
    await table('users')
      .getX(userId as Id<'users'>)
      .delete();
  },
  onUpdateUser: async (ctx, user) => {
    const userId = user.userId as Id<'users'>;
    const updates: any = {
      email: user.email,
    };

    // Update additional fields if provided
    if (user.name !== undefined) {
      updates.name = user.name;
      updates.firstName = user.name.split(' ')[0] || undefined;
      updates.lastName = user.name.split(' ').slice(1).join(' ') || undefined;
    }
    if (user.image !== undefined) {
      updates.image = user.image;
      updates.profileImageUrl = user.image;
    }
    if (user.emailVerified !== undefined) {
      updates.emailVerified = user.emailVerified;
    }

    const table = entsTableFactory(ctx, entDefinitions);
    await table('users').getX(userId).patch(updates);
  },
});

// Query to fetch user id for auth checks. Needs to stay in this file for cyclic dependency.
export const userIdQuery = zCustomQuery(
  query,
  customCtx(async (ctx) => {
    const authData = await getAuthUserId(ctx);

    return authData;
  })
);

// Query to fetch user data for session/auth checks
export const getSessionUser = async (ctx: QueryCtx) => {
  const userId = await betterAuthComponent.getAuthUserId(ctx);

  if (!userId) {
    return null;
  }

  const table = entsTableFactory(ctx, entDefinitions);
  const user = await table('users').get(userId as Id<'users'>);

  if (!user) {
    return null;
  }

  // Get dev settings if in development
  let devSettings: any = null;

  if (getEnv().NEXT_PUBLIC_ENVIRONMENT === 'development') {
    devSettings = await table('devSettings').get(
      'userId',
      userId as Id<'users'>
    );
  }

  return mapSessionToUser(user, devSettings);
};

export const getSessionUserWriter = async (ctx: MutationCtx) => {
  const userId = await betterAuthComponent.getAuthUserId(ctx);

  if (!userId) {
    return null;
  }

  const table = entsTableFactory(ctx, entDefinitions);
  const user = await table('users').get(userId as Id<'users'>);

  if (!user) {
    return null;
  }

  // Get dev settings if in development
  let devSettings: any = null;

  if (getEnv().NEXT_PUBLIC_ENVIRONMENT === 'development') {
    devSettings = await table('devSettings').get(
      'userId',
      userId as Id<'users'>
    );
  }

  return {
    ...mapSessionToUser(user, devSettings),
    delete: user.delete,
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
    patch: user.patch,
    replace: user.replace,
  };
};
