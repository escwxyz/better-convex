import type { MutationCtx, QueryCtx } from '@convex/_generated/server';
import type { CtxWithTable, Ent } from '@convex/shared/types';
import { getAuthUserId, getSession } from 'better-auth-convex';
import { getProduct, productToPlan } from '@convex/polar/product';
import { Doc, Id } from '@convex/_generated/dataModel';

import type { InternalMutationCtx } from '@convex/functions';

export type SessionUser = Omit<Doc<'user'>, '_id' | '_creationTime'> & {
  id: Id<'user'>;
  activeOrganization:
    | (Omit<Doc<'organization'>, '_id'> & {
        id: Id<'organization'>;
        role: Doc<'member'>['role'];
      })
    | null;
  isAdmin: boolean;
  plan?: 'premium';
};

const getSessionData = async (ctx: CtxWithTable<MutationCtx>) => {
  const userId = await getAuthUserId(ctx);

  if (!userId) {
    return null;
  }

  console.time('getSession');
  const sessionResult = await getSession(ctx);
  console.timeEnd('getSession');

  if (!sessionResult) {
    return null;
  }

  const activeOrganizationId =
    sessionResult.activeOrganizationId as Id<'organization'> | null;

  console.time('table.users.get');
  const [user, subscription] = await Promise.all([
    ctx.table('user').get(userId),
    (async () => {
      if (!activeOrganizationId) {
        return null;
      }

      // Get active subscription for the organization
      const subscription = await ctx
        .table('subscriptions')
        .get('organizationId_status', activeOrganizationId, 'active');

      if (!subscription) {
        return null;
      }

      const product = getProduct(subscription.productId);

      return {
        ...subscription.doc(),
        product: product ?? null,
      };
    })(),
  ]);

  console.timeEnd('table.users.get');

  if (!user) {
    return null;
  }

  const activeOrganization = await (async () => {
    if (!activeOrganizationId) {
      return null;
    }

    const [activeOrg, currentMember] = await Promise.all([
      ctx.table('organization').getX(activeOrganizationId),
      ctx
        .table('member')
        .get('organizationId_userId', activeOrganizationId, userId),
    ]);

    return {
      ...activeOrg.doc(),
      id: activeOrg._id,
      role: currentMember?.role || 'member',
    };
  })();

  return {
    user,
    activeOrganization,
    plan: productToPlan(subscription?.productId) as 'premium' | undefined,
    isAdmin: user.role === 'admin',
  };
};

// Query to fetch user data for session/auth checks
export const getSessionUser = async (
  ctx: CtxWithTable<QueryCtx>
): Promise<(Ent<'user'> & SessionUser) | null> => {
  const { user, activeOrganization, plan, isAdmin } =
    (await getSessionData(ctx as any)) ?? ({} as never);

  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user._id,
    activeOrganization,
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
    isAdmin,
    plan,
  };
};

export const getSessionUserWriter = async (
  ctx: CtxWithTable<MutationCtx>
): Promise<any> => {
  const { user, activeOrganization, plan, isAdmin } =
    (await getSessionData(ctx)) ?? ({} as never);

  if (!user) {
    return null;
  }

  return {
    ...user,
    id: user._id,
    activeOrganization,
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
    isAdmin,
    plan,
    delete: user.delete,
    patch: user.patch,
    replace: user.replace,
  };
};

export const createUser = async (
  ctx: InternalMutationCtx,
  args: {
    email: string;
    name: string;
    bio?: string | null;
    github?: string | null;
    image?: string | null;
    location?: string | null;
    role?: 'admin' | 'user';
  }
) => {
  const newUserId = await ctx.table('user').insert({
    bio: args.bio,
    createdAt: Date.now(),
    email: args.email,
    emailVerified: true,
    image: args.image,
    name: args.name,
    role: args.role || 'user',
    updatedAt: Date.now(),
  });

  return newUserId;
};
