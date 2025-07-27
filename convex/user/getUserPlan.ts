import { SubscriptionPlan } from './isUserSubscribed';

export const getUserPlan = ({
  isPremium,
  isPremiumPlus,
}: {
  isPremium?: boolean;
  isPremiumPlus?: boolean;
}) => {
  return isPremium
    ? SubscriptionPlan.Premium
    : isPremiumPlus
      ? SubscriptionPlan.PremiumPlus
      : SubscriptionPlan.Free;
};
