import { api } from '@convex/api';
import { meta } from '@convex/meta';
import { convexBetterAuth } from 'better-convex/auth-nextjs';

export const { createContext, createCaller, handler } = convexBetterAuth({
  api,
  convexSiteUrl: process.env.NEXT_PUBLIC_CONVEX_SITE_URL!,
  jwtCache: { enabled: true },
  meta,
});
