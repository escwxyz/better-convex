import * as React from 'react';

import { notFound, redirect } from 'next/navigation';

import { env } from '@/env';
import { getSessionUser, isUnauth } from '@/lib/convex/server';
import { routes } from '@/lib/navigation/routes';

export const authGuard = async () => {
  // Check Convex auth
  if (await isUnauth()) {
    redirect(routes.login());
  }
};

export const authRedirect = async ({
  pathname,
  searchParams,
}: {
  pathname?: string;
  searchParams?: Record<string, string>;
}) => {
  // Check Convex auth
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

    redirect(callbackUrl);
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

export const adminGuard = async () => {
  // Get session from Convex
  const user = await getSessionUser();

  if (!user?.isAdmin) {
    notFound();
  }
};

export const superAdminGuard = async () => {
  // Get session from Convex
  const user = await getSessionUser();

  if (!user?.isSuperAdmin) {
    notFound();
  }
};

export async function AdminGuard({
  children,
  pathname,
  searchParams,
}: {
  children: React.ReactNode;
  pathname?: string;
  searchParams?: Record<string, string>;
}) {
  await authRedirect({ pathname, searchParams });

  // Get session from Convex
  const user = await getSessionUser();

  if (env.NODE_ENV === 'production' && !user?.isSuperAdmin) {
    return notFound();
  }

  return <>{children}</>;
}
