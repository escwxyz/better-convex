import { api } from '@convex/api';

import { useAuthStatus, usePublicQuery } from '@/lib/convex/hooks/convex-hooks';

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStatus();

  const { data, ...rest } = usePublicQuery(
    api.user.getCurrentUser,
    isAuthenticated ? {} : 'skip',
    {
      placeholderData: {
        id: '0' as any,
        activeOrganization: {
          id: '0' as any,
          logo: '',
          name: '',
          role: '',
          slug: '',
        },
        image: undefined,
        isAdmin: false,
        name: '',
        personalOrganizationId: undefined,
      },
    }
  );

  return {
    ...rest,
    ...data,
  };
};
