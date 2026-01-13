'use client';

import { useMutation, useQuery } from '@tanstack/react-query';
import { useMaybeAuth } from 'better-convex/react';
import {
  Building2,
  CheckSquare,
  FolderOpen,
  Loader2,
  LogIn,
  LogOut,
  Sparkles,
  Tags,
  TestTube2,
} from 'lucide-react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { OrganizationSwitcher } from '@/components/organization/organization-switcher';
import { Button } from '@/components/ui/button';
import { useSignOutMutationOptions } from '@/lib/convex/auth-client';
import { useCRPC } from '@/lib/convex/crpc';
import { useCurrentUser } from '@/lib/convex/hooks';

const navItems = [
  {
    href: '/' as const,
    label: 'Todos',
    icon: CheckSquare,
    match: (p: string) => p === '/',
  },
  {
    href: '/projects' as const,
    label: 'Projects',
    icon: FolderOpen,
    match: (p: string) => p.startsWith('/projects'),
  },
  {
    href: '/tags' as const,
    label: 'Tags',
    icon: Tags,
    match: (p: string) => p.startsWith('/tags'),
  },
];

export function BreadcrumbNav() {
  const pathname = usePathname();
  const router = useRouter();
  const user = useCurrentUser();
  const isAuth = useMaybeAuth();

  const crpc = useCRPC();
  const generateSamplesAction = useMutation(
    crpc.seed.generateSamples.mutationOptions()
  );
  const signOutMutation = useMutation(
    useSignOutMutationOptions({
      onSuccess: () => router.push('/login'),
      onError: () => toast.error('Failed to sign out'),
    })
  );

  const { data: projectsData, isPlaceholderData } = useQuery(
    crpc.projects.list.queryOptions(
      { limit: 1, cursor: null },
      {
        placeholderData: { page: [], isDone: true, continueCursor: '' },
      }
    )
  );
  const hasData = projectsData && projectsData.page.length > 0;

  return (
    <header className="sticky top-0 z-50 border-border/40 border-b bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-14 items-center justify-between">
          {/* Brand */}
          <Link
            className="group flex items-center gap-2 transition-opacity hover:opacity-80"
            href="/"
          >
            <div className="flex size-8 items-center justify-center rounded-lg bg-foreground">
              <Sparkles className="size-4 text-background" />
            </div>
            <span className="font-semibold text-lg tracking-tight">
              Taskflow
            </span>
          </Link>

          {/* Navigation */}
          <nav className="flex items-center gap-1">
            {navItems.map((item) => {
              const isActive = item.match(pathname);
              const Icon = item.icon;
              return (
                <Link
                  className={`relative flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                    isActive
                      ? 'text-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  }`}
                  href={item.href}
                  key={item.href}
                >
                  <Icon className="size-4" />
                  {item.label}
                  {isActive && (
                    <span className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-foreground" />
                  )}
                </Link>
              );
            })}
            {user?.activeOrganization?.slug && (
              <Link
                className={`relative flex items-center gap-2 rounded-md px-3 py-2 font-medium text-sm transition-colors ${
                  pathname.startsWith('/org')
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
                href={`/org/${user.activeOrganization.slug}`}
              >
                <Building2 className="size-4" />
                Organization
                {pathname.startsWith('/org') && (
                  <span className="absolute inset-x-1 -bottom-[13px] h-0.5 rounded-full bg-foreground" />
                )}
              </Link>
            )}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {isAuth ? (
              <>
                {!user.isPlaceholderData && <OrganizationSwitcher />}
                {!isPlaceholderData && !hasData && (
                  <Button
                    className="gap-2"
                    disabled={generateSamplesAction.isPending}
                    onClick={() => {
                      toast.promise(
                        generateSamplesAction.mutateAsync({ count: 100 }),
                        {
                          loading: 'Generating sample data...',
                          success: (result) =>
                            `Created ${result.created} projects with ${result.todosCreated} todos!`,
                          error: (e) =>
                            e.data?.message ?? 'Failed to generate samples',
                        }
                      );
                    }}
                    size="sm"
                    variant="ghost"
                  >
                    <TestTube2 className="size-4" />
                    <span className="hidden sm:inline">Samples</span>
                  </Button>
                )}
                <Button
                  className="gap-2"
                  disabled={signOutMutation.isPending}
                  onClick={() => signOutMutation.mutate()}
                  size="sm"
                  variant="ghost"
                >
                  {signOutMutation.isPending ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <LogOut className="size-4" />
                  )}
                  <span className="hidden sm:inline">Sign out</span>
                </Button>
              </>
            ) : pathname !== '/login' ? (
              <Button asChild size="sm" variant="default">
                <Link className="gap-2" href="/login">
                  <LogIn className="size-4" />
                  Sign in
                </Link>
              </Button>
            ) : null}
          </div>
        </div>
      </div>
    </header>
  );
}
