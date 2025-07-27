import { convexClient } from '@convex-dev/better-auth/client/plugins';
import { createAuthClient } from 'better-auth/react';

export const authClient = createAuthClient({
  plugins: [convexClient()],
});

// Export hooks from the auth client
export const { signIn, signOut, signUp, useSession } = authClient;
