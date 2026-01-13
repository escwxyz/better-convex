import type { inferApiInputs, inferApiOutputs } from 'better-convex/server';
import type { WithoutSystemFields } from 'convex/server';

import type { api } from '../functions/_generated/api';
import type { Doc, TableNames } from '../functions/_generated/dataModel';

export type DocWithId<TableName extends TableNames> = WithoutSystemFields<
  Doc<TableName>
> & {
  id: Doc<TableName>['_id'];
};

// API type inference (tRPC-style)
export type Api = typeof api;
export type ApiInputs = inferApiInputs<Api>;
export type ApiOutputs = inferApiOutputs<Api>;
