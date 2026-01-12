import type {
  GenericEnt,
  GenericEntWriter,
  PromiseTableWriter,
} from 'convex-ents';
import { entsTableFactory, getEntDefinitions } from 'convex-ents';

import type { TableNames } from '../functions/_generated/dataModel';
import type { MutationCtx, QueryCtx } from '../functions/_generated/server';
import schema from '../functions/schema';

export const entDefinitions = getEntDefinitions(schema);

export type Ent<TableName extends TableNames> = GenericEnt<
  typeof entDefinitions,
  // @ts-expect-error Ents types mismatch with raw DataModel
  TableName
>;

export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  // @ts-expect-error Ents types mismatch with raw DataModel
  TableName
>;

export type EntInsert<TableName extends TableNames> = Parameters<
  // @ts-expect-error Ents types mismatch with raw DataModel
  Awaited<PromiseTableWriter<TableName, typeof entDefinitions>['insert']>
>[0];

export type EntInsertMany<TableName extends TableNames> = Parameters<
  // @ts-expect-error Ents types mismatch with raw DataModel
  Awaited<PromiseTableWriter<TableName, typeof entDefinitions>['insertMany']>
>[0];

export type CtxWithTable<Ctx extends MutationCtx | QueryCtx = QueryCtx> =
  ReturnType<typeof getCtxWithTable<Ctx>>;

export const getCtxWithTable = <Ctx extends MutationCtx | QueryCtx>(
  ctx: Ctx
) => {
  return {
    ...ctx,
    table: entsTableFactory(ctx, entDefinitions),
  };
};
