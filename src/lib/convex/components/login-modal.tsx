'use client';

import { DialogBody, DialogContent, DialogTitle } from '@/components/ui/dialog';
import { Icons } from '@/components/ui/icons';
import { SignForm } from '@/lib/convex/components/login-form';
import { useIsAuth } from '@/lib/convex/hooks';

export function LoginModal() {
  const isAuth = useIsAuth();

  if (isAuth) return null;

  return (
    <DialogContent size="md">
      <div className="pt-4 pb-2">
        <Icons.logo className="mx-auto mb-3 size-10 text-foreground" />

        <DialogTitle className="text-center text-xl md:text-2xl">
          Welcome back
        </DialogTitle>
      </div>

      <DialogBody className="py-4">
        <SignForm />
      </DialogBody>
    </DialogContent>
  );
}
