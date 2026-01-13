'use client';

/**
 * Unified Convex + Better Auth provider
 */

import type { AuthTokenFetcher } from 'convex/browser';
import type { ConvexReactClient } from 'convex/react';
import { ConvexProviderWithAuth } from 'convex/react';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo } from 'react';

import { CRPCClientError, defaultIsUnauthorized } from '../crpc/error';
import {
  AuthProvider,
  getPersistedToken,
  persistToken,
  useAuthStore,
  useAuthValue,
} from '../react/auth-store';

// Re-export AuthClient type
export type { AuthClient } from '@convex-dev/better-auth/react';

import type { AuthClient } from '@convex-dev/better-auth/react';

type IConvexReactClient = {
  setAuth(fetchToken: AuthTokenFetcher): void;
  clearAuth(): void;
};

export type ConvexAuthProviderProps = {
  children: ReactNode;
  /** Convex client instance */
  client: ConvexReactClient;
  /** Better Auth client instance */
  authClient: AuthClient;
  /** Initial session token (from SSR) */
  initialToken?: string;
  /** Callback when mutation called while unauthorized */
  onMutationUnauthorized?: () => void;
  /** Callback when query called while unauthorized */
  onQueryUnauthorized?: (info: { queryName: string }) => void;
  /** Custom function to detect UNAUTHORIZED errors. Default checks code property. */
  isUnauthorized?: (error: unknown) => boolean;
};

const defaultMutationHandler = () => {
  throw new CRPCClientError({
    code: 'UNAUTHORIZED',
    functionName: 'mutation',
  });
};

/**
 * Unified auth provider for Convex + Better Auth.
 * Handles token sync, HMR persistence, and auth callbacks.
 */
export function ConvexAuthProvider({
  children,
  client,
  authClient,
  initialToken,
  onMutationUnauthorized,
  onQueryUnauthorized,
  isUnauthorized,
}: ConvexAuthProviderProps) {
  // Use persisted token from globalThis when initialToken is undefined (HMR case)
  const effectiveToken = initialToken ?? getPersistedToken();

  // Persist token to globalThis for HMR survival
  if (effectiveToken) {
    persistToken(effectiveToken);
  }

  // Create useAuth hook for ConvexProviderWithAuth
  const useAuth = useCreateConvexAuth(authClient);

  // Handle cross-domain one-time token
  useOTTHandler(authClient);

  return (
    <ConvexProviderWithAuth
      client={client as IConvexReactClient}
      useAuth={useAuth}
    >
      <AuthProvider
        initialValues={{
          isLoading: true,
          token: effectiveToken ?? null,
        }}
        isUnauthorized={isUnauthorized ?? defaultIsUnauthorized}
        onMutationUnauthorized={
          onMutationUnauthorized ?? defaultMutationHandler
        }
        onQueryUnauthorized={onQueryUnauthorized ?? (() => {})}
      >
        <AuthSyncEffect authClient={authClient} />
        {children}
      </AuthProvider>
    </ConvexProviderWithAuth>
  );
}

/**
 * Syncs Better Auth session to auth-store.
 * Automatically handles login/logout token updates.
 */
function AuthSyncEffect({ authClient }: { authClient: AuthClient }) {
  const session = authClient.useSession();
  const authStore = useAuthStore();

  useEffect(() => {
    if (!session.isPending) {
      const token = session.data?.session.token ?? null;
      const currentToken = authStore.get('token');

      // Only update if token changed
      if (token !== currentToken) {
        authStore.set('token', token);
        // Always persist, including null on logout (fixes HMR bug)
        persistToken(token);
      }
    }
  }, [session.data, session.isPending, authStore]);

  return null;
}

/**
 * Creates useAuth hook for ConvexProviderWithAuth.
 * Uses auth-store token as single source of truth.
 */
function useCreateConvexAuth(authClient: AuthClient) {
  return useMemo(
    () =>
      function useConvexAuth() {
        const { data: session, isPending: isSessionPending } =
          authClient.useSession();
        const token = useAuthValue('token');
        const sessionId = session?.session?.id;

        const fetchAccessToken = useCallback(
          async ({
            forceRefreshToken = false,
          }: {
            forceRefreshToken?: boolean;
          } = {}) => {
            if (token && !forceRefreshToken) {
              return token;
            }

            try {
              // biome-ignore lint/suspicious/noExplicitAny: convex plugin type
              const { data } = await (authClient as any).convex.token();
              return data?.token || null;
            } catch {
              return null;
            }
          },
          // Rebuild when session changes to trigger setAuth()
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [sessionId, token]
        );

        return useMemo(
          () => ({
            isLoading: isSessionPending,
            isAuthenticated: session !== null,
            fetchAccessToken,
          }),
          // eslint-disable-next-line react-hooks/exhaustive-deps
          [isSessionPending, sessionId, fetchAccessToken]
        );
      },
    [authClient]
  );
}

/**
 * Handles cross-domain one-time token (OTT) verification.
 */
function useOTTHandler(authClient: AuthClient) {
  useEffect(() => {
    (async () => {
      const url = new URL(window.location?.href);
      const token = url.searchParams.get('ott');

      if (token) {
        // biome-ignore lint/suspicious/noExplicitAny: cross-domain plugin type
        const authClientWithCrossDomain = authClient as any;
        url.searchParams.delete('ott');
        const result =
          await authClientWithCrossDomain.crossDomain.oneTimeToken.verify({
            token,
          });
        const session = result.data?.session;

        if (session) {
          await authClient.getSession({
            fetchOptions: {
              headers: {
                Authorization: `Bearer ${session.token}`,
              },
            },
          });
          authClientWithCrossDomain.updateSession();
        }

        window.history.replaceState({}, '', url);
      }
    })();
  }, [authClient]);
}
