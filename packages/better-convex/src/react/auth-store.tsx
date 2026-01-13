'use client';

/**
 * Auth Store - Generic auth state management with jotai-x
 *
 * Provides token storage and auth callback configuration.
 * App configures handlers, lib hooks consume state.
 */

import { useConvexAuth } from 'convex/react';
import { createAtomStore } from 'jotai-x';
import React from 'react';

import { CRPCClientError, defaultIsUnauthorized } from '../crpc/error';

export type AuthStoreState = {
  /** Callback when mutation/action called while unauthorized. Throws by default. */
  onMutationUnauthorized: () => void;
  /** Callback when query called while unauthorized. Noop by default. */
  onQueryUnauthorized: (info: { queryName: string }) => void;
  /** Custom function to detect UNAUTHORIZED errors. Default checks code or "auth" in message. */
  isUnauthorized: (error: unknown) => boolean;
  /** Current session token */
  token: string | null;
  /** Whether Convex auth is still loading (synced from useConvexAuth) */
  isLoading: boolean;
  /** Whether user is authenticated (synced from useConvexAuth + token) */
  isAuthenticated: boolean;
  /** Guard function - returns true if blocked, else runs callback */
  guard: (callback?: () => Promise<void> | void) => boolean | undefined;
};

// HMR persistence: globalThis survives module re-evaluation
// biome-ignore lint/suspicious/noExplicitAny: globalThis symbol keys
const globalStore = globalThis as any;
const AUTH_TOKEN_KEY = Symbol.for('convex.authToken');

/** Get persisted token from globalThis (survives HMR) */
export const getPersistedToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  return globalStore[AUTH_TOKEN_KEY] ?? null;
};

/** Persist token to globalThis (survives HMR) */
export const persistToken = (token: string | null) => {
  if (typeof window !== 'undefined') {
    globalStore[AUTH_TOKEN_KEY] = token;
  }
};

function AuthEffect() {
  const authStore = useAuthStore();
  const { isAuthenticated, isLoading } = useConvexAuth();
  const token = useAuthValue('token');
  const onMutationUnauthorized = useAuthValue('onMutationUnauthorized');

  // Sync auth state from useConvexAuth to store
  React.useEffect(() => {
    authStore.set('isLoading', isLoading);
    authStore.set('isAuthenticated', isAuthenticated && !!token);
    authStore.set('guard', (callback?: () => Promise<void> | void) => {
      if (!token) {
        onMutationUnauthorized();
        return true;
      }
      return callback ? void callback() : false;
    });
  }, [isLoading, isAuthenticated, token, onMutationUnauthorized, authStore]);

  return null;
}

export const {
  authStore,
  AuthProvider,
  useAuthStore,
  useAuthState,
  useAuthValue,
} = createAtomStore(
  {
    onMutationUnauthorized: () => {
      throw new CRPCClientError({
        code: 'UNAUTHORIZED',
        functionName: 'mutation',
      });
    },
    onQueryUnauthorized: () => {},
    isUnauthorized: defaultIsUnauthorized,
    token: getPersistedToken(),
    enabled: false,
    isLoading: false,
    isAuthenticated: false,
    guard: () => false,
  } as AuthStoreState,
  { effect: AuthEffect, name: 'auth' as const, suppressWarnings: true }
);

export type AuthStore = ReturnType<typeof useAuthStore>;

export const useAuth = () => {
  const authStore = useAuthStore();

  if (!authStore.store) {
    return {
      hasSession: false,
      isAuthenticated: false,
      isLoading: false,
    };
  }

  // During SSR/prerendering, read token from store for SSR auth-awareness
  if (typeof window === 'undefined') {
    const token = authStore.get('token');

    return {
      hasSession: !!token,
      isAuthenticated: false,
      isLoading: true,
    };
  }

  // Token is ready to be used only after convex client auth is loaded
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const { isAuthenticated, isLoading } = useConvexAuth();
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const token = useAuthValue('token');

  return {
    hasSession: !!token,
    isAuthenticated: isAuthenticated && !!token,
    isLoading,
  };
};

/** Check if user maybe has auth (optimistic, has token) */
export const useMaybeAuth = () => {
  const { hasSession } = useAuth();
  return hasSession;
};

/** Check if user is authenticated (server-verified) */
export const useIsAuth = () => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

export const useAuthGuard = () => {
  const isAuth = useIsAuth();
  const onMutationUnauthorized = useAuthValue('onMutationUnauthorized');

  return (callback?: () => Promise<void> | void) => {
    if (!isAuth) {
      onMutationUnauthorized();

      return true;
    }

    return callback ? void callback() : false;
  };
};

/** Render children only when maybe has auth (optimistic) */
export function MaybeAuthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useMaybeAuth();
  return isAuth ? children : null;
}

/** Render children only when authenticated (server-verified) */
export function Authenticated({ children }: { children: React.ReactNode }) {
  const isAuth = useIsAuth();
  return isAuth ? children : null;
}

/** Render children only when maybe not auth (optimistic) */
export function MaybeUnauthenticated({
  children,
}: {
  children: React.ReactNode;
}) {
  const isAuth = useMaybeAuth();
  return isAuth ? null : children;
}

/** Render children only when not authenticated (server-verified) */
export function Unauthenticated({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  // Wait for loading, then show if not authenticated
  return isLoading || isAuthenticated ? null : children;
}
