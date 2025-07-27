export enum SubscriptionPlan {
  Free = 'free',
  Premium = 'premium',
  PremiumPlus = 'premiumPlus',
}

export const priceIdToPlan: Record<string, SubscriptionPlan> = {
  [process.env.STRIPE_PREMIUM_PLUS_MONTHLY_PRICE_ID!]:
    SubscriptionPlan.PremiumPlus,
  [process.env.STRIPE_PREMIUM_PLUS_YEARLY_PRICE_ID!]:
    SubscriptionPlan.PremiumPlus,
  [process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!]: SubscriptionPlan.Premium,
};

export const planToPriceId = {
  [SubscriptionPlan.Premium]: {
    year: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!,
  },
  [SubscriptionPlan.PremiumPlus]: {
    month: process.env.STRIPE_PREMIUM_PLUS_MONTHLY_PRICE_ID!,
    year: process.env.STRIPE_PREMIUM_PLUS_YEARLY_PRICE_ID!,
  },
};

export const priceIdToInterval = {
  [process.env.STRIPE_PREMIUM_PLUS_MONTHLY_PRICE_ID!]: 'month',
  [process.env.STRIPE_PREMIUM_PLUS_YEARLY_PRICE_ID!]: 'year',
  [process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID!]: 'year',
};

export const priceIdToCreditBundle: Record<string, '1' | '2' | '3'> = {
  [process.env.STRIPE_CREDITS_1_PRICE_ID!]: '1',
  [process.env.STRIPE_CREDITS_2_PRICE_ID!]: '2',
  [process.env.STRIPE_CREDITS_3_PRICE_ID!]: '3',
};

export const creditBundleToPriceId = {
  1: process.env.STRIPE_CREDITS_1_PRICE_ID!,
  2: process.env.STRIPE_CREDITS_2_PRICE_ID!,
  3: process.env.STRIPE_CREDITS_3_PRICE_ID!,
};

export const getPlanByPriceId = (priceId?: string | null) => {
  if (!priceId) return SubscriptionPlan.Free;

  return priceIdToPlan[priceId] ?? SubscriptionPlan.Free;
};

// Current period end + 1 day
export const getSubscriptionPeriodEnd = (stripeCurrentPeriodEnd: Date) => {
  return stripeCurrentPeriodEnd.getTime() + 86_400_000;
};

export const isUserSubscribed = ({
  stripeCurrentPeriodEnd,
  stripePriceId,
}: {
  stripeCurrentPeriodEnd?: any;
  stripePriceId?: string | null;
}) => {
  if (!stripeCurrentPeriodEnd) return false;

  stripeCurrentPeriodEnd = new Date(stripeCurrentPeriodEnd as any);

  const plan = getPlanByPriceId(stripePriceId);

  if (plan === SubscriptionPlan.Free) return false;

  return getSubscriptionPeriodEnd(stripeCurrentPeriodEnd) > Date.now();
};

export const isUserPremium = ({
  stripeCurrentPeriodEnd,
  stripePriceId,
}: {
  stripeCurrentPeriodEnd?: any;
  stripePriceId?: string | null;
}) => {
  return (
    isUserSubscribed({ stripeCurrentPeriodEnd, stripePriceId }) &&
    getPlanByPriceId(stripePriceId) === SubscriptionPlan.Premium
  );
};

export const isUserPremiumPlus = ({
  stripeCurrentPeriodEnd,
  stripePriceId,
}: {
  stripeCurrentPeriodEnd?: any;
  stripePriceId?: string | null;
}) => {
  return (
    isUserSubscribed({ stripeCurrentPeriodEnd, stripePriceId }) &&
    getPlanByPriceId(stripePriceId) === SubscriptionPlan.PremiumPlus
  );
};
