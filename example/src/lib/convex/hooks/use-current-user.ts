import type { Id } from '@convex/dataModel';
import { useQuery } from '@tanstack/react-query';
import { useCRPC } from '@/lib/convex/crpc';

export const useCurrentUser = () => {
  const crpc = useCRPC();

  const { data, ...rest } = useQuery(
    crpc.user.getCurrentUser.queryOptions(
      {},
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
    )
  );

  return {
    ...rest,
    ...data,
  };
};
