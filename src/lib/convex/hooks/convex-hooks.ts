import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

import type {
  FunctionArgs,
  FunctionReference,
  FunctionReturnType,
} from 'convex/server';
import type { DeepPartial } from 'ts-essentials';

import { useConvexAction, useConvexMutation } from '@convex-dev/react-query';
import {
  type DefaultError,
  type QueryClient,
  type UseMutationOptions,
  useMutation,
} from '@tanstack/react-query';
import { makeUseQueryWithStatus } from 'convex-helpers/react';
import {
  type OptionalRestArgsOrSkip,
  type PaginatedQueryArgs,
  type PaginatedQueryItem,
  type PaginatedQueryReference,
  usePaginatedQuery,
  useQueries,
  useQuery,
} from 'convex/react';
import { useAuth } from 'node_modules/@convex-dev/better-auth/dist/esm/react/client';

import { pushModal } from '@/components/modals';
import { useAuthValue } from '@/components/providers/convex-provider';

export const useIsAuth = () => {
  return useAuthValue('isAuthenticated');
};

export function useStableQuery<Query extends FunctionReference<'query'>>(
  query: Query,
  ...args: OptionalRestArgsOrSkip<Query>
): { data: FunctionReturnType<Query> | undefined; isLoading: boolean } {
  const result = useQuery(query, ...args);
  const stored = useRef<FunctionReturnType<Query> | undefined>(result);

  if (result !== undefined) {
    stored.current = result;
  }

  return { data: stored.current, isLoading: result === undefined };
}

export const useAuthGuard = () => {
  const isAuth = useIsAuth();

  return useCallback(
    (callback?: () => Promise<void> | void) => {
      if (!isAuth) {
        pushModal('Login');

        return true;
      }

      return callback ? void callback() : false;
    },
    [isAuth]
  );
};

const useQueryWithStatus = makeUseQueryWithStatus(useQueries);

// Query for public users with optional placeholder data
export const usePublicQuery = <Query extends FunctionReference<'query'>>(
  query: Query,
  args: OptionalRestArgsOrSkip<Query>[0],
  options?: {
    placeholderData?: DeepPartial<FunctionReturnType<Query>>;
  }
):
  | {
      data: FunctionReturnType<Query>;
      error: undefined;
      isError: false;
      isLoading: false;
      isPending: false;
      isSuccess: true;
      status: 'success';
    }
  | {
      data: undefined;
      error: Error;
      isError: true;
      isLoading: false;
      isPending: false;
      isSuccess: false;
      status: 'error';
    }
  | {
      data: undefined;
      error: undefined;
      isError: false;
      isLoading: true;
      isPending: true;
      isSuccess: false;
      status: 'pending';
    } => {
  // Some public queries have auth logic, so we need to skip when auth is loading
  const auth = useAuth();
  const mounted = useMounted();
  const adjustedArgs = auth.isLoading ? 'skip' : args;

  const result = useQueryWithStatus(query, adjustedArgs as any);

  const isPending =
    (options?.placeholderData && !mounted) ||
    auth.isLoading ||
    (adjustedArgs !== 'skip' && (result.isPending as any));

  // Apply placeholder data logic if option is provided
  if (options?.placeholderData && isPending) {
    return {
      data: options.placeholderData as FunctionReturnType<Query>,
      error: undefined,
      isError: false,
      isLoading: true,
      isPending: true,
      isSuccess: false,
      status: 'pending',
    };
  }

  return {
    ...result,
    isLoading: isPending,
    isPending,
  };
};

// Query skipped for unauthenticated users
export const useAuthQuery: typeof usePublicQuery = (query, args, options) => {
  const { isLoading } = useAuth();
  const isAuth = useIsAuth() && !isLoading;

  const result = usePublicQuery(
    query,
    isAuth ? (args as any) : 'skip',
    options
  );

  return {
    ...result,
    isLoading: isLoading || result.isLoading,
    isPending: isLoading || result.isPending,
  } as typeof result;
};

// Paginated query for public users
export const usePublicPaginatedQuery = <Query extends PaginatedQueryReference>(
  query: Query,
  args: PaginatedQueryArgs<Query> | 'skip',
  options: {
    initialNumItems: number;
    placeholderData?: DeepPartial<PaginatedQueryItem<Query>>[];
  }
): {
  /** An array of the currently loaded results */
  data: PaginatedQueryItem<Query>[];
  /** Whether the query has a next page */
  hasNextPage: boolean;
  /** Whether the query is fetching */
  isFetching: boolean;
  /** Whether the query is fetching the next page */
  isFetchingNextPage: boolean;
  /** Whether the query is loading the first page */
  isLoading: boolean;
  /** Fetch the next page */
  fetchNextPage: () => void;
} => {
  // Some public queries have auth logic, so we need to skip when auth is loading
  const auth = useAuth();
  const mounted = useMounted();
  args = auth.isLoading ? 'skip' : args;

  // If not authenticated, always skip
  const {
    isLoading: _isLoading,
    loadMore,
    results,
    status,
  } = usePaginatedQuery(query, args, options);

  const fetchNextPage = useCallback(() => {
    loadMore(options.initialNumItems);
  }, [loadMore, options.initialNumItems]);

  const isLoading = auth.isLoading || (args !== 'skip' && _isLoading);
  const showPlaceholder =
    options?.placeholderData &&
    (!mounted || (isLoading && status === 'LoadingFirstPage'));

  // Filter duplicates by id. This is a workaround to avoid duplicates when deleting items from streams
  const uniqueResults = useMemo(() => {
    // Use placeholder data if provided and loading
    if (showPlaceholder) {
      return options.placeholderData as PaginatedQueryItem<Query>[];
    }

    return results.filter((item, index, self) => {
      // If item has _id property, use it for deduplication
      if (item._id) {
        return (
          index === self.findIndex((t) => '_id' in t && t._id === item._id)
        );
      }
      // If item has id property, use it for deduplication
      if (item.id) {
        return index === self.findIndex((t) => 'id' in t && t.id === item.id);
      }

      // Otherwise, keep all items
      return true;
    });
  }, [results, showPlaceholder, options?.placeholderData]);

  return {
    data: uniqueResults,
    fetchNextPage,
    hasNextPage: showPlaceholder ? false : status !== 'Exhausted',
    isFetching: isLoading,
    isFetchingNextPage: status === 'LoadingMore',
    isLoading: showPlaceholder || (isLoading && status === 'LoadingFirstPage'),
  };
};

// Paginated query skipped for unauthenticated users
export const useAuthPaginatedQuery: typeof usePublicPaginatedQuery = (
  query,
  args,
  options
) => {
  const { isLoading } = useAuth();
  const isAuth = useIsAuth() && !isLoading;

  const result = usePublicPaginatedQuery(
    query,
    isAuth ? (args as any) : 'skip',
    options
  );

  return {
    ...result,
    isLoading: isLoading || result.isLoading,
  } as typeof result;
};

// Mutation for public users (auth optional) using TanStack Query
export const usePublicMutation = <
  Mutation extends FunctionReference<'mutation', any, any>,
>(
  mutation: Mutation,
  options?: UseMutationOptions<
    FunctionReturnType<Mutation>,
    DefaultError,
    FunctionArgs<Mutation>
  >,
  queryClient?: QueryClient
) => {
  const convexMutation = useConvexMutation(mutation);

  return useMutation<
    FunctionReturnType<Mutation>,
    DefaultError,
    FunctionArgs<Mutation>
  >(
    {
      mutationFn: convexMutation as any,
      ...options,
    },
    queryClient
  );
};

// Mutation that requires authentication using TanStack Query
export const useAuthMutation: typeof usePublicMutation = (
  mutation,
  options,
  queryClient
) => {
  const authGuard = useAuthGuard();
  const convexMutation = useConvexMutation(mutation);

  return useMutation(
    {
      mutationFn: async (...args) => {
        if (authGuard()) {
          return;
        }

        return convexMutation(...args);
      },
      ...options,
    },
    queryClient
  );
};

// Action for public users (auth optional) using TanStack Query
export const usePublicAction = <
  Action extends FunctionReference<'action', any, any>,
>(
  action: Action,
  options?: UseMutationOptions<
    FunctionReturnType<Action>,
    DefaultError,
    FunctionArgs<Action>
  >,
  queryClient?: QueryClient
) => {
  const convexAction = useConvexAction(action);

  return useMutation<
    FunctionReturnType<Action>,
    DefaultError,
    FunctionArgs<Action>
  >(
    {
      mutationFn: convexAction as any,
      ...options,
    },
    queryClient
  );
};

// Action that requires authentication using TanStack Query
export const useAuthAction: typeof usePublicAction = (
  action,
  options,
  queryClient
) => {
  const authGuard = useAuthGuard();
  const convexAction = useConvexAction(action);

  return useMutation(
    {
      mutationFn: async (...args) => {
        if (authGuard()) {
          return;
        }

        return convexAction(...args);
      },
      ...options,
    },
    queryClient
  );
};

// Helper hook for mounted state
const useMounted = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return mounted;
};
