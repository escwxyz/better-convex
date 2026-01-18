---
"better-convex": patch
---

Fix `UNAUTHORIZED` errors:

- Fix queries failing after switching tabs and returning to the app. The auth token is now preserved during session refetch instead of being cleared.
- Fix `useSuspenseQuery` failing on initial page load when auth is still loading. WebSocket subscriptions now wait for auth to settle before connecting.
