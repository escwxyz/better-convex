import { CRPCError } from 'better-convex/server';
import type { SessionUser } from './auth-helpers';

export function premiumGuard(user: { plan?: SessionUser['plan'] }) {
  if (!user.plan) {
    throw new CRPCError({
      code: 'PAYMENT_REQUIRED',
      message: 'Premium subscription required',
    });
  }
}
