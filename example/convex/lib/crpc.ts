import { getHeaders, getSession } from 'better-convex/auth';
import { CRPCError, initCRPC } from 'better-convex/server';
import type { Auth } from 'convex/server';
import {
  customCtx,
  customMutation,
} from 'convex-helpers/server/customFunctions';
import { api } from '../functions/_generated/api';
import type { DataModel, Id } from '../functions/_generated/dataModel';
import type { ActionCtx, MutationCtx, QueryCtx } from '../functions/_generated/server';
import {
  action,
  internalAction,
  internalMutation,
  internalQuery,
  mutation,
  query,
} from '../functions/_generated/server';
import { type CtxWithTable, getCtxWithTable } from './ents';
import { rateLimitGuard } from '../functions/helpers/rateLimiter';
import { registerTriggers } from '../functions/triggers';

// =============================================================================
// Types
// =============================================================================

export type GenericCtx = QueryCtx | MutationCtx | ActionCtx;

type SessionUser = {
  id: Id<'user'>;
  plan?: 'premium' | null;
  isAdmin?: boolean;
};

/** Context with optional auth - user/userId may be null */
export type MaybeAuthCtx<Ctx extends MutationCtx | QueryCtx = QueryCtx> =
  CtxWithTable<Ctx> & {
    auth: Auth & { headers?: Headers };
    user: SessionUser | null;
    userId: Id<'user'> | null;
  };

/** Context with required auth - user/userId guaranteed */
export type AuthCtx<Ctx extends MutationCtx | QueryCtx = QueryCtx> =
  CtxWithTable<Ctx> & {
    auth: Auth & { headers: Headers };
    user: SessionUser;
    userId: Id<'user'>;
  };

/** Context type for authenticated actions */
export type AuthActionCtx = ActionCtx & {
  user: SessionUser;
  userId: Id<'user'>;
};

// =============================================================================
// Setup
// =============================================================================

const triggers = registerTriggers();

type Meta = {
  auth?: 'optional' | 'required';
  role?: 'admin';
  rateLimit?: string;
  dev?: boolean;
};

// biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
const c = initCRPC
  .dataModel<DataModel>()
  .context({
    query: (ctx: any) => getCtxWithTable(ctx),
    mutation: (ctx: any) => getCtxWithTable(ctx),
  })
  .meta<Meta>()
  .create({
    query,
    internalQuery,
    mutation: (handler: any) =>
      mutation({
        ...handler,
        handler: async (ctx: MutationCtx, args: unknown) => {
          const wrappedCtx = triggers.wrapDB(ctx);
          return handler.handler(wrappedCtx, args);
        },
      }),
    internalMutation: (handler: any) =>
      internalMutation({
        ...handler,
        handler: async (ctx: MutationCtx, args: unknown) => {
          const wrappedCtx = triggers.wrapDB(ctx);
          return handler.handler(wrappedCtx, args);
        },
      }),
    action,
    internalAction,
  });

// =============================================================================
// Middleware
// =============================================================================

/** Dev mode middleware - throws in production if meta.dev: true */
const devMiddleware = c.middleware<object>(({ meta, next, ctx }) => {
  if (meta.dev && process.env.DEPLOY_ENV === 'production') {
    throw new CRPCError({
      code: 'FORBIDDEN',
      message: 'This function is only available in development',
    });
  }
  return next({ ctx });
});

/** Rate limit middleware - applies rate limiting based on meta.rateLimit and user tier */
// biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
const rateLimitMiddleware = c.middleware<any>(async ({ ctx, meta, next }: any) => {
  await rateLimitGuard({
    ...ctx,
    rateLimitKey: meta.rateLimit ?? 'default',
    user: ctx.user ?? null,
  });
  return next({ ctx });
});

/** Role middleware - checks admin role from meta after auth middleware */
// biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
const roleMiddleware = c.middleware<any>(({ ctx, meta, next }: any) => {
  if (meta.role === 'admin' && !ctx.user?.isAdmin) {
    throw new CRPCError({ code: 'FORBIDDEN', message: 'Admin access required' });
  }
  return next({ ctx });
});

// =============================================================================
// Query Procedures
// =============================================================================

/** Public query - no auth required, supports dev: true in meta */
export const publicQuery = c.query.use(devMiddleware);

/** Private query - only callable from other Convex functions */
export const privateQuery = c.query.internal();

/** Optional auth query - ctx.user may be null, supports dev: true in meta */
export const optionalAuthQuery = c.query
  .meta({ auth: 'optional' })
  .use(devMiddleware)
  // biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
  .use(async ({ ctx, next }: any) => {
    const session = await getSession(ctx);
    if (!session) {
      return next({ ctx: { ...ctx, user: null, userId: null } });
    }

    const user = await ctx.table('user').getX(session.userId);

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          headers: await getHeaders(ctx, session),
        },
        user: { id: user._id, session, ...user.doc() },
        userId: user._id,
      },
    });
  });

/** Auth query - ctx.user required, supports role: 'admin' and dev: true in meta */
export const authQuery = c.query
  .meta({ auth: 'required' })
  .use(devMiddleware)
  // biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
  .use(async ({ ctx, next }: any) => {
    const session = await getSession(ctx);
    if (!session) {
      throw new CRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }

    const user = await ctx.table('user').getX(session.userId);

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          headers: await getHeaders(ctx, session),
        },
        user: { id: user._id, session, ...user.doc() },
        userId: user._id,
      },
    });
  })
  .use(roleMiddleware);

// =============================================================================
// Mutation Procedures
// =============================================================================

/** Public mutation - no auth required, rate limited, supports dev: true in meta */
export const publicMutation = c.mutation
  .use(devMiddleware)
  .use(rateLimitMiddleware);

/** Private mutation - only callable from other Convex functions */
export const privateMutation = c.mutation.internal();

/** Optional auth mutation - ctx.user may be null, rate limited, supports dev: true */
export const optionalAuthMutation = c.mutation
  .meta({ auth: 'optional' })
  .use(devMiddleware)
  // biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
  .use(async ({ ctx, next }: any) => {
    const session = await getSession(ctx);
    if (!session) {
      return next({ ctx: { ...ctx, user: null, userId: null } });
    }

    const user = await ctx.table('user').getX(session.userId);

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          headers: await getHeaders(ctx, session),
        },
        user: { id: user._id, session, ...user.doc() },
        userId: user._id,
      },
    });
  })
  .use(rateLimitMiddleware);

/** Auth mutation - ctx.user required, rate limited, supports role: 'admin' and dev: true */
export const authMutation = c.mutation
  .meta({ auth: 'required' })
  .use(devMiddleware)
  // biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
  .use(async ({ ctx, next }: any) => {
    const session = await getSession(ctx);
    if (!session) {
      throw new CRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }

    const user = await ctx.table('user').getX(session.userId);

    return next({
      ctx: {
        ...ctx,
        auth: {
          ...ctx.auth,
          headers: await getHeaders(ctx, session),
        },
        user: { id: user._id, session, ...user.doc() },
        userId: user._id,
      },
    });
  })
  .use(roleMiddleware)
  .use(rateLimitMiddleware);

// =============================================================================
// Action Procedures
// =============================================================================

/** Public action - no auth required, supports dev: true in meta */
export const publicAction = c.action.use(devMiddleware);

/** Private action - only callable from other Convex functions */
export const privateAction = c.action.internal();

/** Auth action - ctx.user required, supports dev: true in meta */
export const authAction = c.action
  .meta({ auth: 'required' })
  .use(devMiddleware)
  // biome-ignore lint/suspicious/noExplicitAny: convex type incompatibilities
  .use(async ({ ctx, next }: any) => {
    const rawUser = await ctx.runQuery(api.user.getSessionUser, {});
    if (!rawUser) {
      throw new CRPCError({ code: 'UNAUTHORIZED', message: 'Not authenticated' });
    }
    return next({ ctx: { ...ctx, user: rawUser as SessionUser, userId: rawUser.id } });
  });

// =============================================================================
// Exports for Better Auth
// =============================================================================

/** Trigger-wrapped internalMutation for better-auth hooks */
export const internalMutationWithTriggers = customMutation(
  internalMutation,
  customCtx(async (ctx) => ({
    db: triggers.wrapDB(ctx).db,
  }))
);
