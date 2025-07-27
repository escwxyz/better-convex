'use client';

import * as React from 'react';

import { cn } from '@udecode/cn';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useQueryState } from 'nuqs';

import { Button } from '@/components/ui/button';
import { Icons } from '@/components/ui/icons';
import { env } from '@/env';
import { signIn } from '@/lib/convex/auth-client';
import { authRoutes, routes } from '@/lib/navigation/routes';
import { encodeURL } from '@/lib/url/encodeURL';

export function SignForm() {
  let [callbackUrl] = useQueryState('callbackUrl');
  const pathname = usePathname();
  const searchParams = useSearchParams();

  if (!callbackUrl && !authRoutes.includes(pathname)) {
    callbackUrl = encodeURL(pathname, searchParams.toString());
  }

  const handleGoogleSignIn = () => {
    const callback = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : routes.home();

    signIn.social({
      callbackURL: `${env.NEXT_PUBLIC_SITE_URL}${callback}`,
      provider: 'google',
    });
  };

  const handleGithubSignIn = () => {
    const callback = callbackUrl
      ? decodeURIComponent(callbackUrl)
      : routes.home();

    signIn.social({
      callbackURL: `${env.NEXT_PUBLIC_SITE_URL}${callback}`,
      provider: 'github',
    });
  };

  return (
    <div className={cn('mx-auto grid max-w-[268px] gap-3')}>
      <Button
        size="lg"
        variant="outline"
        className="w-full"
        onClick={handleGoogleSignIn}
        icon={<Icons.google />}
      >
        Continue with Google
      </Button>

      <Button
        size="lg"
        variant="default"
        className="w-full"
        onClick={handleGithubSignIn}
        icon={<Icons.github />}
      >
        Continue with Github
      </Button>

      <div className="my-3 max-w-xs text-center text-xs text-balance text-muted-foreground">
        By continuing, you agree to our{' '}
        <Link className="font-semibold hover:underline" href={routes.terms()}>
          Terms of Service
        </Link>{' '}
        and acknowledge you've read our{' '}
        <Link className="font-semibold hover:underline" href={routes.privacy()}>
          Privacy Policy
        </Link>
        .
      </div>
    </div>
  );
}
