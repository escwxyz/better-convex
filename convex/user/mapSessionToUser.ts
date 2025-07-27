import type { Ent } from '@convex/shared/types';

import type { Doc, Id } from '../_generated/dataModel';

import { getEnv } from '../helpers/getEnv';
import {
  isUserPremium,
  isUserPremiumPlus,
  isUserSubscribed,
  priceIdToInterval,
  SubscriptionPlan,
} from './isUserSubscribed';

export type SessionUser = Doc<'users'> & {
  id: Id<'users'>;
  isAdmin: boolean;
  isMonthlyPlan: boolean;
  isPremium: boolean;
  isPremiumPlus: boolean;
  isSubscribed: boolean;
  isSuperAdmin: boolean;
};

export const mapSessionToUser = (
  user: Ent<'users'>,
  devSettings?: {
    plan: string;
    role: string;
  } | null
): Ent<'users'> & SessionUser => {
  return {
    ...user,
    id: user._id,
    doc: user.doc,
    edge: user.edge,
    edgeX: user.edgeX,
    isAdmin: isAdmin(user.role),
    isMonthlyPlan: user.stripePriceId
      ? priceIdToInterval[user.stripePriceId] === 'month'
      : false,
    isPremium: isUserPremium(user),
    isPremiumPlus: isUserPremiumPlus(user),
    isSubscribed: isUserSubscribed(user),
    isSuperAdmin: isSuperAdmin(user.role),
    ...mapDevSettings(devSettings),
  };
};

const mapDevSettings = (
  devSettings?: {
    plan: string;
    role: string;
  } | null
) => {
  if (getEnv().NEXT_PUBLIC_ENVIRONMENT === 'production' || !devSettings)
    return null;

  const res: {
    isAdmin?: boolean;
    isPremium?: boolean;
    isPremiumPlus?: boolean;
    isSubscribed?: boolean;
    isSuperAdmin?: boolean;
  } = {};

  if (devSettings.role && devSettings.role !== 'default') {
    res.isAdmin = devSettings.role === 'ADMIN';
    res.isSuperAdmin = devSettings.role === 'SUPERADMIN';
  }
  if (devSettings.plan && devSettings.plan !== 'default') {
    res.isPremium = devSettings.plan === SubscriptionPlan.Premium;
    res.isPremiumPlus = devSettings.plan === SubscriptionPlan.PremiumPlus;
    res.isSubscribed = devSettings.plan !== SubscriptionPlan.Free;
  }

  return res;
};

export const isAdmin = (role?: string) => {
  return isSuperAdmin(role) || role === 'ADMIN';
};

export const isSuperAdmin = (role?: string) => {
  return role === 'SUPERADMIN';
};
