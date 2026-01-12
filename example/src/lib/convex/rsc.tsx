import 'server-only';

import { api } from '@convex/api';
import { meta } from '@convex/meta';
import type { FetchQueryOptions } from '@tanstack/react-query';
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from '@tanstack/react-query';
import {
  createServerCRPCProxy,
  getServerQueryClientOptions,
} from 'better-convex/rsc';
import type { Route } from 'next';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import type * as React from 'react';
import { cache } from 'react';

import { hydrationConfig } from './query-client';
import { createCaller, createContext } from './server';

// CRPC proxy for RSC
export const crpc = createServerCRPCProxy(api, meta);

// RSC context factory
const createRSCContext = cache(async () =>
  createContext({ headers: await headers() })
);

/** RSC caller for server-side data fetching */
export const caller = createCaller(createRSCContext);

/** Create server-side QueryClient */
function createServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      ...hydrationConfig,
      ...getServerQueryClientOptions({
        getToken: caller.getToken,
      }),
    },
  });
}

/** Get stable QueryClient per request */
export const getQueryClient = cache(createServerQueryClient);

/** Prefetch query for client hydration (fire-and-forget) */
export function prefetch<T extends { queryKey: readonly unknown[] }>(
  queryOptions: T
): void {
  void getQueryClient().prefetchQuery(queryOptions);
}

/** Preload query - returns data + hydrates for client */
export function preloadQuery<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends readonly unknown[] = readonly unknown[],
>(
  options: FetchQueryOptions<TQueryFnData, TError, TData, TQueryKey>
): Promise<TData> {
  return getQueryClient().fetchQuery(options);
}

/** Hydration wrapper for client components */
export function HydrateClient({ children }: { children: React.ReactNode }) {
  const queryClient = getQueryClient();
  const dehydratedState = dehydrate(queryClient);

  return (
    <HydrationBoundary state={dehydratedState}>{children}</HydrationBoundary>
  );
}

/** Check if user is authenticated */
export const isAuth = async () => {
  const token = await caller.getToken();
  return !!token;
};

/** Check if user is unauthenticated */
export const isUnauth = async () => !(await isAuth());

export const authGuard = async () => {
  if (await isUnauth()) {
    redirect('/login');
  }
};

export const authRedirect = async ({
  pathname,
  searchParams,
}: {
  pathname?: string;
  searchParams?: Record<string, string>;
}) => {
  if (await isUnauth()) {
    let callbackUrl = '/login';

    if (pathname) {
      if (searchParams) {
        const params = new URLSearchParams(searchParams);
        callbackUrl += `?callbackUrl=${encodeURIComponent(pathname + params.toString())}`;
      } else {
        callbackUrl += `?callbackUrl=${pathname}`;
      }
    }

    redirect(callbackUrl as Route);
  }
};

export async function AuthRedirect({
  children,
  pathname,
  searchParams,
}: {
  children: React.ReactNode;
  pathname?: string;
  searchParams?: Record<string, string>;
}) {
  await authRedirect({ pathname, searchParams });

  return <>{children}</>;
}
