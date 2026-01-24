'use client';

import { useQuery } from '@tanstack/react-query';
import { useCRPC } from '@/lib/convex/crpc';

export default function PublicPage() {
  const crpc = useCRPC();
  const { data } = useQuery(crpc.public.hello.queryOptions());

  return (
    <div className="mx-auto max-w-2xl px-6 py-8">
      <h1 className="mb-4 font-semibold text-2xl">Public Page</h1>
      <p>{data?.message ?? 'Loading...'}</p>
    </div>
  );
}
