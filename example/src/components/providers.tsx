import { NuqsAdapter } from 'nuqs/adapters/next/app';
import type { ReactNode } from 'react';
import { BetterConvexProvider } from '@/lib/convex/convex-provider';
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
