---
"better-convex": minor
---

**BREAKING:** Refactored `createCRPCContext` and `createServerCRPCProxy` to use options object:

Before:

```ts
createCRPCContext(api, meta);
createServerCRPCProxy(api, meta);
```

After:

```ts
createCRPCContext<Api>({ api, meta, convexSiteUrl });
createServerCRPCProxy<Api>({ api, meta });
```

**BREAKING:** `getServerQueryClientOptions` now requires `convexSiteUrl`:

```ts
getServerQueryClientOptions({
  getToken: caller.getToken,
  convexSiteUrl: env.NEXT_PUBLIC_CONVEX_SITE_URL,
});
```

**Feature:** Added HTTP routes support via `WithHttpRouter` helper:

```ts
// convex/shared/types.ts - before
export type Api = typeof api;

// convex/shared/types.ts - after
import { WithHttpRouter } from "better-convex/server";
import type { appRouter } from "../functions/http";

export type Api = WithHttpRouter<typeof api, typeof appRouter>;
// ApiInputs['http']['todos'] now works for HTTP route type inference
```

**Feature:** Added `httpAction` builder to CRPC for type-safe HTTP routes:

```ts
// crpc.ts - pass httpAction to initCRPC.create()
const c = initCRPC.dataModel<DataModel>().create({
  query,
  mutation,
  action,
  httpAction,
});

export const publicRoute = c.httpAction;
export const authRoute = c.httpAction.use(authMiddleware);
export const router = c.router;
```

**Feature:** Added HTTP route builder methods (`.get()`, `.post()`, `.patch()`, `.delete()`):

```ts
// Define route with HTTP method and path
export const health = publicRoute
  .get('/api/health')
  .output(z.object({ status: z.string() }))
  .query(async () => ({ status: 'ok' }));

export const create = authRoute
  .post('/api/todos')
  .input(z.object({ title: z.string() }))
  .output(z.object({ id: zid('todos') }))
  .mutation(async ({ ctx, input }) => { ... });
```

**Feature:** Added route input methods (`.params()`, `.searchParams()`, `.input()`):

```ts
// Path params: /api/todos/:id
.params(z.object({ id: zid('todos') }))

// Query params: /api/todos?limit=10
.searchParams(z.object({ limit: z.coerce.number().optional() }))

// JSON body (POST/PATCH/DELETE)
.input(z.object({ title: z.string() }))
```

**Feature:** Added `router()` factory for nested HTTP routers (tRPC-style):

```ts
export const todosRouter = router({
  list: publicRoute.get('/api/todos')...,
  get: publicRoute.get('/api/todos/:id')...,
  create: authRoute.post('/api/todos')...,
});

export const appRouter = router({
  health,
  todos: todosRouter,
});
```

**Feature:** Added `registerCRPCRoutes` to register HTTP routes to Convex httpRouter with CORS:

```ts
// http.ts
import { registerCRPCRoutes } from "better-convex/server";

registerCRPCRoutes(http, appRouter, {
  httpAction,
  cors: {
    allowedOrigins: [process.env.SITE_URL!],
    allowCredentials: true,
  },
});
```

**Feature:** Added `crpc.http.*` proxy with TanStack Query integration:

```ts
const crpc = useCRPC();

// GET routes → queryOptions
const todos = useSuspenseQuery(crpc.http.todos.list.queryOptions({ limit: 10 }));
const health = useSuspenseQuery(crpc.http.health.queryOptions({}));

// POST/PATCH/DELETE routes → mutationOptions
const createTodo = useMutation(crpc.http.todos.create.mutationOptions({
  onSuccess: () => queryClient.invalidateQueries(crpc.http.todos.list.queryFilter()),
}));

// queryFilter for cache invalidation
queryClient.invalidateQueries(crpc.http.todos.list.queryFilter());
```

**Feature:** Added `prefetch` helper for RSC HTTP queries:

```ts
import { crpc, prefetch } from '@/lib/convex/rsc';

// Server component
prefetch(crpc.http.health.queryOptions({}));
prefetch(crpc.user.getCurrentUser.queryOptions());
```

**Fix:** Improved authentication in `ConvexAuthProvider`:

- **FetchAccessTokenContext**: New context passes `fetchAccessToken` through React tree - eliminates race conditions where token wasn't available during render
- **Token Expiration Tracking**: Added `expiresAt` field with `decodeJwtExp()` - 60s cache leeway prevents unnecessary token refreshes
- **SSR Hydration Fix**: Defensive `isLoading` check prevents UNAUTHORIZED errors when Better Auth briefly returns null during hydration
- **Removed HMR persistence**: No more globalThis Symbol storage (`getPersistedToken`/`persistToken`)
- **Simplified AuthStore**: Removed `guard` method and `AuthEffect` - state synced via `useConvexAuth()` directly
