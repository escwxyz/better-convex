import {
  type FunctionReference,
  GenericDataModel,
  GenericMutationCtx,
  GenericSchema,
  IdField,
  internalMutationGeneric,
  SchemaDefinition,
  SystemFields,
} from 'convex/server';
import { type Infer, v } from 'convex/values';
import { GenericCtx } from '@convex-dev/better-auth';

import { httpAdapter } from './adapter';

export type AuthFunctions = {
  onCreate: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  onUpdate: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  onDelete: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  create: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  findOne: FunctionReference<'query', 'internal', { [key: string]: any }>;
  findMany: FunctionReference<'query', 'internal', { [key: string]: any }>;
  updateOne: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  updateMany: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  deleteOne: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
  deleteMany: FunctionReference<'mutation', 'internal', { [key: string]: any }>;
};

export type Triggers<
  DataModel extends GenericDataModel,
  Schema extends SchemaDefinition<any, any>,
> = {
  [K in keyof Schema['tables'] & string]?: {
    onCreate?: (
      ctx: GenericMutationCtx<DataModel>,
      doc: Infer<Schema['tables'][K]['validator']> & IdField<K> & SystemFields
    ) => Promise<void>;
    onUpdate?: (
      ctx: GenericMutationCtx<DataModel>,
      oldDoc: Infer<Schema['tables'][K]['validator']> &
        IdField<K> &
        SystemFields,
      newDoc: Infer<Schema['tables'][K]['validator']> &
        IdField<K> & {
          _creationTime: number;
        }
    ) => Promise<void>;
    onDelete?: (
      ctx: GenericMutationCtx<DataModel>,
      doc: Infer<Schema['tables'][K]['validator']> & IdField<K> & SystemFields
    ) => Promise<void>;
  };
};

export const createClient = <
  DataModel extends GenericDataModel,
  Schema extends SchemaDefinition<GenericSchema, true>,
>(config: {
  authFunctions: AuthFunctions;
  triggers?: Triggers<DataModel, Schema>;
}) => {
  return {
    adapter: (ctx: GenericCtx<DataModel>) => httpAdapter(ctx, config),
    triggersApi: () => ({
      onCreate: internalMutationGeneric({
        args: {
          doc: v.any(),
          model: v.string(),
        },
        handler: async (ctx, args) => {
          await config?.triggers?.[args.model]?.onCreate?.(ctx, args.doc);
        },
      }),
      onUpdate: internalMutationGeneric({
        args: {
          oldDoc: v.any(),
          newDoc: v.any(),
          model: v.string(),
        },
        handler: async (ctx, args) => {
          await config?.triggers?.[args.model]?.onUpdate?.(
            ctx,
            args.oldDoc,
            args.newDoc
          );
        },
      }),
      onDelete: internalMutationGeneric({
        args: {
          doc: v.any(),
          model: v.string(),
        },
        handler: async (ctx, args) => {
          await config?.triggers?.[args.model]?.onDelete?.(ctx, args.doc);
        },
      }),
    }),
    triggers: config.triggers,
    authFunctions: config.authFunctions,
  };
};
