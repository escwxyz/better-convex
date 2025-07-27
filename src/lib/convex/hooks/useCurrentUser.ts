import { api } from '@convex/_generated/api';

import { useAuthQuery } from '@/lib/convex/hooks';

export const useCurrentUser = () => {
  const { data, isLoading } = useAuthQuery(
    api.user.getCurrentUser,
    {},
    {
      placeholderData: {
        id: '1' as any,
        credits: 0,
        email: 'user@example.com',
        isAdmin: false,
        isMonthlyPlan: false,
        isPremium: false,
        isPremiumPlus: false,
        isSubscribed: false,
        isSuperAdmin: false,
        monthlyCredits: 0,
        name: undefined,
        profileImageUrl: undefined,
        totalCredits: 0,
        username: 'user',
      },
    }
  );

  return { ...data, isLoading };
};
