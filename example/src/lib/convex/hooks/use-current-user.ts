import { api } from '@convex/api';
import type { Id } from '@convex/dataModel';
import { useAuthStatus, usePublicQuery } from '@/lib/convex/hooks/convex-hooks';

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStatus();

  const { data, ...rest } = usePublicQuery(
    api.user.getCurrentUser,
    isAuthenticated ? {} : 'skip',
    {
      placeholderData: {
        id: '0' as Id<'user'>,
        activeOrganization: {
          id: '0' as Id<'organization'>,
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
