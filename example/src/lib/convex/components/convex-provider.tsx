'use client';

import {
  QueryClientProvider as TanstackQueryClientProvider,
  useQuery,
} from '@tanstack/react-query';
import { ConvexAuthProvider } from 'better-convex/auth-client';
import {
  ConvexReactClient,
  getConvexQueryClientSingleton,
  getQueryClientSingleton,
  useAuthStatus,
  useAuthStore,
  useSyncSession,
} from 'better-convex/react';
import { useRouter } from 'next/navigation';
import type { ReactNode } from 'react';
import { toast } from 'sonner';

import { authClient, useSession } from '@/lib/convex/auth-client';
import { CRPCProvider, useCRPC } from '@/lib/convex/crpc';
import { createQueryClient } from '@/lib/convex/query-client';

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export function BetterConvexProvider({
  children,
  token,
}: {
  children: ReactNode;
  token?: string;
}) {
  const router = useRouter();

  return (
    <ConvexAuthProvider
      authClient={authClient}
      client={convex}
      initialToken={token}
      onMutationUnauthorized={() => {
        router.push('/login');
      }}
      onQueryUnauthorized={({ queryName }) => {
        if (process.env.NODE_ENV === 'development') {
          toast.error(`${queryName} requires authentication`);
        } else {
          router.push('/login');
        }
      }}
    >
      <QueryClientProvider>{children}</QueryClientProvider>
    </ConvexAuthProvider>
  );
}

function QueryClientProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();

  const queryClient = getQueryClientSingleton(createQueryClient);
  const convexQueryClient = getConvexQueryClientSingleton({
    authStore,
    convex,
    queryClient,
  });

  return (
    <TanstackQueryClientProvider client={queryClient}>
      <CRPCProvider convexClient={convex} convexQueryClient={convexQueryClient}>
        <AuthSync />
        {children}
      </CRPCProvider>
    </TanstackQueryClientProvider>
  );
}

/** Subscribe to user query when authenticated */
function AuthSync() {
  const { isAuthenticated } = useAuthStatus();
  const crpc = useCRPC();
  const session = useSession();

  useSyncSession(session);

  useQuery(
    crpc.user.getSessionUser.queryOptions({}, { enabled: isAuthenticated })
  );

  return null;
}
