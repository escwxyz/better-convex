import { api } from '@convex/api';
import { meta } from '@convex/meta';
import { createCRPCContext } from 'better-convex/react';

export const { CRPCProvider, useCRPC, useCRPCClient } = createCRPCContext(
  api,
  meta
);
