/* eslint-disable no-restricted-imports */
import type { SessionUser } from '@convex/user/mapSessionToUser';

import { entsTableFactory } from 'convex-ents';
import {
  customCtx,
  customMutation,
} from 'convex-helpers/server/customFunctions';
import {
  type CustomBuilder,
  zCustomAction,
  zCustomMutation,
  zCustomQuery,
} from 'convex-helpers/server/zod';
import { paginationOptsValidator } from 'convex/server';
import { ConvexError } from 'convex/values';

import type { Id } from './_generated/dataModel';
import type { MutationCtx, QueryCtx } from './_generated/server';

import { internal } from './_generated/api';
import {
  action,
  internalMutation as baseInternalMutation,
  mutation as baseMutation,
  internalAction,
  internalQuery,
  query,
} from './_generated/server';
import {
  betterAuthComponent,
  getSessionUser,
  getSessionUserWriter,
} from './auth';
import { rateLimitGuard } from './helpers/rateLimiter';
import { roleGuard } from './helpers/roleGuard';
import { entDefinitions } from './schema';
import { triggers } from './triggers';

type Overwrite<T, U> = Omit<T, keyof U> & U;
type CustomCtx<Builder> =
  Builder extends CustomBuilder<
    any,
    any,
    infer ModCtx,
    any,
    infer InputCtx,
    any
  >
    ? Overwrite<InputCtx, ModCtx>
    : never;

export type PublicMutationCtx = CustomCtx<
  ReturnType<typeof createPublicMutation>
>;

export type AuthMutationCtx = CustomCtx<ReturnType<typeof createAuthMutation>>;

export type PublicQueryCtx = CustomCtx<ReturnType<typeof createPublicQuery>>;

export type AuthQueryCtx = CustomCtx<ReturnType<typeof createAuthQuery>>;

// Wrap mutation with triggers
const mutation = customMutation(
  baseMutation,
  customCtx(async (ctx) => ({
    db: triggers.wrapDB(ctx).db,
  }))
);
const internalMutation = customMutation(
  baseInternalMutation,
  customCtx(async (ctx) => ({
    db: triggers.wrapDB(ctx).db,
  }))
);

// Helper function to check if function is dev-only
function checkDevOnly(devOnly?: boolean) {
  if (devOnly && process.env.NODE_ENV === 'production') {
    throw new ConvexError({
      code: 'FORBIDDEN',
      message: 'This function is only available in development',
    });
  }
}

export async function getAuthUserId(
  ctx: MutationCtx | QueryCtx
): Promise<{ userId: Id<'users'> }> {
  const userId = await betterAuthComponent.getAuthUserId(ctx);

  if (!userId) {
    throw new ConvexError({
      code: 'UNAUTHENTICATED',
      message: 'Not authenticated',
    });
  }

  return { userId: userId as Id<'users'> };
}

// Protected query that adds user and userId to context
export const createAuthQuery = ({
  devOnly,
  role,
}: { devOnly?: boolean; role?: 'ADMIN' | 'SUPERADMIN' } = {}) =>
  zCustomQuery(
    query,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      const user = await getSessionUser(ctx);

      if (!user) {
        throw new ConvexError({
          code: 'UNAUTHENTICATED',
          message: 'Not authenticated',
        });
      }
      if (role) {
        roleGuard(role, user);
      }

      return {
        table: entsTableFactory(ctx, entDefinitions),
        user,
        userId: user?.id ?? null,
      };
    })
  );

export const createAuthPaginatedQuery = ({
  devOnly,
  role,
}: { devOnly?: boolean; role?: 'ADMIN' | 'SUPERADMIN' } = {}) =>
  zCustomQuery(query, {
    args: { paginationOpts: paginationOptsValidator },
    input: async (ctx, args) => {
      checkDevOnly(devOnly);

      const user = await getSessionUser(ctx);

      if (!user) {
        throw new ConvexError({
          code: 'UNAUTHENTICATED',
          message: 'Not authenticated',
        });
      }
      if (role) {
        roleGuard(role, user);
      }

      return {
        args,
        ctx: {
          ...ctx,
          table: entsTableFactory(ctx, entDefinitions),
          user,
          userId: user?.id ?? null,
        },
      };
    },
  });

// Public query that adds user and userId to context if authenticated
export const createPublicQuery = ({ devOnly }: { devOnly?: boolean } = {}) =>
  zCustomQuery(
    query,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      const user = await getSessionUser(ctx);

      return {
        table: entsTableFactory(ctx, entDefinitions),
        user,
        userId: user?.id ?? null,
      };
    })
  );

export const createPublicPaginatedQuery = ({
  devOnly,
}: { devOnly?: boolean } = {}) =>
  zCustomQuery(query, {
    args: { paginationOpts: paginationOptsValidator },
    input: async (ctx, args) => {
      checkDevOnly(devOnly);

      const user = await getSessionUser(ctx);

      return {
        args,
        ctx: {
          ...ctx,
          table: entsTableFactory(ctx, entDefinitions),
          user,
          userId: user?.id ?? null,
        },
      };
    },
  });

export const createInternalQuery = ({ devOnly }: { devOnly?: boolean } = {}) =>
  zCustomQuery(
    internalQuery,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      return {
        table: entsTableFactory(ctx, entDefinitions),
      };
    })
  );

export const createAuthAction = ({
  devOnly,
  rateLimit,
  role,
}: {
  devOnly?: boolean;
  rateLimit?: string | null;
  role?: 'ADMIN' | 'SUPERADMIN';
} = {}) =>
  zCustomAction(
    action,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      const user = (await ctx.runQuery(
        internal.authInternal.sessionUser,
        {}
      )) as SessionUser | null;

      if (!user) {
        throw new ConvexError({
          code: 'UNAUTHENTICATED',
          message: 'Not authenticated',
        });
      }
      if (role) {
        roleGuard(role, user);
      }
      if (rateLimit) {
        await rateLimitGuard({
          ...ctx,
          rateLimitKey: rateLimit,
          user,
        });
      }

      return {
        user,
        userId: user?.id ?? null,
      };
    })
  );

export const createPublicAction = ({ devOnly }: { devOnly?: boolean } = {}) =>
  zCustomAction(
    action,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      return {};
    })
  );

export const createInternalAction = ({ devOnly }: { devOnly?: boolean } = {}) =>
  zCustomAction(
    internalAction,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      return {};
    })
  );

export const createInternalMutation = ({
  devOnly,
}: { devOnly?: boolean } = {}) =>
  zCustomMutation(
    internalMutation,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      return {
        table: entsTableFactory(ctx, entDefinitions),
      };
    })
  );

// Protected mutation that adds user and userId to context
export const createAuthMutation = ({
  devOnly,
  rateLimit,
  role,
}: {
  devOnly?: boolean;
  rateLimit?: string | null;
  role?: 'ADMIN' | 'SUPERADMIN';
} = {}) =>
  zCustomMutation(
    mutation,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      const user = await getSessionUserWriter(ctx);

      if (!user) {
        throw new ConvexError({
          code: 'USER_NOT_FOUND',
          message: 'Not authenticated',
        });
      }
      if (role) {
        roleGuard(role, user);
      }
      if (rateLimit) {
        await rateLimitGuard({
          ...ctx,
          rateLimitKey: rateLimit,
          user,
        });
      }

      return {
        table: entsTableFactory(ctx, entDefinitions),
        user,
        userId: user.id,
      };
    })
  );

// Public mutation that adds user and userId to context if authenticated
export const createPublicMutation = ({
  devOnly,
  rateLimit,
}: { devOnly?: boolean; rateLimit?: string | null } = {}) =>
  zCustomMutation(
    mutation,
    customCtx(async (ctx) => {
      checkDevOnly(devOnly);

      const user = await getSessionUserWriter(ctx);

      if (rateLimit) {
        await rateLimitGuard({
          ...ctx,
          rateLimitKey: rateLimit,
          user,
        });
      }

      return {
        table: entsTableFactory(ctx, entDefinitions),
        user,
        userId: user?.id ?? null,
      };
    })
  );
