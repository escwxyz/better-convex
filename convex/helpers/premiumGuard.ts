import { ConvexError } from 'convex/values';

// Helper function to check premium subscription authorization
export function premiumGuard(user: {
  isPremium?: boolean;
  isPremiumPlus?: boolean;
  isSubscribed?: boolean;
}) {
  if (!user.isSubscribed || (!user.isPremium && !user.isPremiumPlus)) {
    throw new ConvexError({
      code: 'PREMIUM_REQUIRED',
      message: 'Premium subscription required',
    });
  }
}

// Helper function to check premium plus subscription authorization
export function premiumPlusGuard(user: { isPremiumPlus?: boolean }) {
  if (!user.isPremiumPlus) {
    throw new ConvexError({
      code: 'PREMIUM_PLUS_REQUIRED',
      message: 'Premium Plus subscription required',
    });
  }
}
