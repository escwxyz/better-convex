import {
  type DefaultOptions,
  defaultShouldDehydrateQuery,
  QueryCache,
  QueryClient,
} from '@tanstack/react-query';
import { isCRPCClientError } from 'better-convex/crpc';
import { toast } from 'sonner';
import SuperJSON from 'superjson';

/** Shared hydration config for SSR data transfer (used by client + server) */
export const hydrationConfig: Pick<DefaultOptions, 'dehydrate' | 'hydrate'> = {
  dehydrate: {
    serializeData: SuperJSON.serialize,
    shouldDehydrateQuery: (query) =>
      defaultShouldDehydrateQuery(query) || query.state.status === 'pending',
    shouldRedactErrors: () => false,
  },
  hydrate: {
    deserializeData: SuperJSON.deserialize,
  },
};

/** Create QueryClient for client-side with error handling */
export function createQueryClient() {
  return new QueryClient({
    queryCache: new QueryCache({
      onError: (error) => {
        if (isCRPCClientError(error)) {
          console.log(`[CRPC] ${error.code}:`, error.functionName);
        }
      },
    }),
    defaultOptions: {
      ...hydrationConfig,
      mutations: {
        onError: (err) => {
          const error = err as Error & { data?: { message?: string } };
          toast.error(error.data?.message || error.message || 'Something went wrong');
        },
      },
      queries: {
        retry: (failureCount, error) => {
          // Don't retry CRPC client errors (auth failures)
          if (isCRPCClientError(error)) return false;

          const message =
            error instanceof Error ? error.message : String(error);

          // Retry timeouts
          if (message.includes('timed out') && failureCount < 3) {
            console.warn(
              `[QueryClient] Retrying timed out query (attempt ${failureCount + 1}/3)`
            );
            return true;
          }

          return failureCount < 3;
        },
        retryDelay: (attemptIndex) =>
          Math.min(2000 * 2 ** attemptIndex, 30_000),
      },
    },
  });
}
