import type { ReactNode } from 'react';
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { BetterConvexProvider } from '@/lib/convex/components/convex-provider';
import { caller, HydrateClient } from '@/lib/convex/rsc';

export async function Providers({ children }: { children: ReactNode }) {
  const token = await caller.getToken();

  return (
    <BetterConvexProvider token={token}>
      <HydrateClient>
        <NuqsAdapter>{children}</NuqsAdapter>
      </HydrateClient>
    </BetterConvexProvider>
  );
}
