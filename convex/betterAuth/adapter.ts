import type { BetterAuthOptions, Prettify, Where } from 'better-auth';
import {
  type AdapterDebugLogs,
  createAdapterFactory,
} from 'better-auth/adapters';
import {
  createFunctionHandle,
  GenericDataModel,
  SchemaDefinition,
  type FunctionHandle,
  type PaginationOptions,
  type PaginationResult,
} from 'convex/server';
import type { SetOptional } from 'type-fest';
import { getAuthTables } from 'better-auth/db';
import { GenericCtx } from '@convex-dev/better-auth';

import { createSchema } from './createSchema';
import {
  createHandler,
  findOneHandler,
  findManyHandler,
  updateOneHandler,
  deleteOneHandler,
  deleteManyHandler,
  updateManyHandler,
} from './api';

import type { AuthFunctions, Triggers } from './client';

type CleanedWhere = Prettify<Required<Where>>;

export const handlePagination = async (
  next: ({
    paginationOpts,
  }: {
    paginationOpts: PaginationOptions;
  }) => Promise<
    SetOptional<PaginationResult<any>, 'page'> & { count?: number }
  >,
  { limit, numItems }: { limit?: number; numItems?: number } = {}
) => {
  const state: {
    isDone: boolean;
    cursor: string | null;
    docs: any[];
    count: number;
  } = {
    isDone: false,
    cursor: null,
    docs: [],
    count: 0,
  };
  const onResult = (
    result: SetOptional<PaginationResult<any>, 'page'> & { count?: number }
  ) => {
    state.cursor =
      result.pageStatus === 'SplitRecommended' ||
      result.pageStatus === 'SplitRequired'
        ? (result.splitCursor ?? result.continueCursor)
        : result.continueCursor;
    if (result.page) {
      state.docs.push(...result.page);
      state.isDone = (limit && state.docs.length >= limit) || result.isDone;
      return;
    }
    // Update and delete only return a count
    if (result.count) {
      state.count += result.count;
      state.isDone = (limit && state.count >= limit) || result.isDone;
      return;
    }
    state.isDone = result.isDone;
  };

  do {
    const result = await next({
      paginationOpts: {
        numItems: Math.min(
          numItems ?? 200,
          (limit ?? 200) - state.docs.length,
          200
        ),
        cursor: state.cursor,
      },
    });
    onResult(result);
  } while (!state.isDone);
  return state;
};

export type ConvexCleanedWhere = CleanedWhere & {
  value: string | number | boolean | string[] | number[] | null;
};

export const parseWhere = (where?: CleanedWhere[]): ConvexCleanedWhere[] => {
  return where?.map((where) => {
    if (where.value instanceof Date) {
      return {
        ...where,
        value: where.value.getTime(),
      };
    }
    return where;
  }) as ConvexCleanedWhere[];
};

export const adapterConfig = {
  adapterId: 'convex',
  adapterName: 'Convex Adapter',
  debugLogs: false,
  disableIdGeneration: true,
  supportsNumericIds: false,
  usePlural: false,
  mapKeysTransformOutput: {
    _id: 'id',
  },
  // With supportsDates: false, dates are stored as strings,
  // we convert them to numbers here. This aligns with how
  // Convex stores _creationTime, and avoids a breaking change.
  supportsDates: false,
  customTransformInput: ({ data, fieldAttributes }) => {
    if (data && fieldAttributes.type === 'date') {
      return new Date(data).getTime();
    }
    return data;
  },
  customTransformOutput: ({ data, fieldAttributes }) => {
    if (data && fieldAttributes.type === 'date') {
      return new Date(data).getTime();
    }
    return data;
  },
};

export const httpAdapter = <
  DataModel extends GenericDataModel,
  Schema extends SchemaDefinition<any, any>,
>(
  ctx: GenericCtx<DataModel>,
  {
    authFunctions,
    triggers,
    debugLogs,
  }: {
    authFunctions: AuthFunctions;
    debugLogs?: AdapterDebugLogs;
    triggers?: Triggers<DataModel, Schema>;
  }
) => {
  return createAdapterFactory({
    config: {
      ...adapterConfig,
      debugLogs: debugLogs || false,
    },
    adapter: ({ options }) => {
      options.telemetry = { enabled: false };
      return {
        id: 'convex',
        createSchema,
        create: async ({ model, data, select }): Promise<any> => {
          if (!('runMutation' in ctx)) {
            throw new Error('ctx is not a mutation ctx');
          }
          const onCreateHandle =
            authFunctions.onCreate && triggers?.[model]?.onCreate
              ? ((await createFunctionHandle(
                  authFunctions.onCreate
                )) as FunctionHandle<'mutation'>)
              : undefined;
          return ctx.runMutation(authFunctions.create, {
            input: { model, data },
            select,
            onCreateHandle: onCreateHandle,
          });
        },
        findOne: async (data): Promise<any> => {
          if (data.where?.every((w) => w.connector === 'OR')) {
            for (const w of data.where) {
              const result: any = await ctx.runQuery(authFunctions.findOne, {
                ...data,
                where: parseWhere([w]),
              });
              if (result) {
                return result;
              }
            }
          }
          return await ctx.runQuery(authFunctions.findOne, {
            ...data,
            where: parseWhere(data.where),
          });
        },
        findMany: async (data): Promise<any[]> => {
          if (data.offset) {
            throw new Error('offset not supported');
          }
          if (data.where?.some((w) => w.connector === 'OR')) {
            throw new Error('OR connector not supported in findMany');
          }
          const result = await handlePagination(
            async ({ paginationOpts }) => {
              return await ctx.runQuery(authFunctions.findMany, {
                ...data,
                where: parseWhere(data.where),
                paginationOpts,
              });
            },
            { limit: data.limit }
          );
          return result.docs;
        },
        count: async (data) => {
          // Yes, count is just findMany returning a number.
          if (data.where?.some((w) => w.connector === 'OR')) {
            throw new Error('OR connector not supported in findMany');
          }
          const result = await handlePagination(async ({ paginationOpts }) => {
            return await ctx.runQuery(authFunctions.findMany, {
              ...data,
              where: parseWhere(data.where),
              paginationOpts,
            });
          });
          return result.docs?.length ?? 0;
        },
        update: async (data): Promise<any> => {
          if (!('runMutation' in ctx)) {
            throw new Error('ctx is not a mutation ctx');
          }
          if (data.where?.length === 1 && data.where[0].operator === 'eq') {
            const onUpdateHandle =
              authFunctions.onUpdate && triggers?.[data.model]?.onUpdate
                ? ((await createFunctionHandle(
                    authFunctions.onUpdate
                  )) as FunctionHandle<'mutation'>)
                : undefined;
            return ctx.runMutation(authFunctions.updateOne, {
              input: {
                model: data.model as any,
                where: parseWhere(data.where),
                update: data.update as any,
              },
              onUpdateHandle: onUpdateHandle,
            });
          }
          throw new Error('where clause not supported');
        },
        delete: async (data) => {
          if (!('runMutation' in ctx)) {
            throw new Error('ctx is not a mutation ctx');
          }
          const onDeleteHandle =
            authFunctions.onDelete && triggers?.[data.model]?.onDelete
              ? ((await createFunctionHandle(
                  authFunctions.onDelete
                )) as FunctionHandle<'mutation'>)
              : undefined;
          await ctx.runMutation(authFunctions.deleteOne, {
            input: {
              model: data.model,
              where: parseWhere(data.where),
            },
            onDeleteHandle: onDeleteHandle,
          });
        },
        deleteMany: async (data) => {
          if (!('runMutation' in ctx)) {
            throw new Error('ctx is not a mutation ctx');
          }
          const onDeleteHandle =
            authFunctions.onDelete && triggers?.[data.model]?.onDelete
              ? ((await createFunctionHandle(
                  authFunctions.onDelete
                )) as FunctionHandle<'mutation'>)
              : undefined;
          const result = await handlePagination(async ({ paginationOpts }) => {
            return await ctx.runMutation(authFunctions.deleteMany, {
              input: {
                ...data,
                where: parseWhere(data.where),
              },
              paginationOpts,
              onDeleteHandle: onDeleteHandle,
            });
          });
          return result.count;
        },
        updateMany: async (data) => {
          if (!('runMutation' in ctx)) {
            throw new Error('ctx is not an action ctx');
          }

          const onUpdateHandle =
            authFunctions.onUpdate && triggers?.[data.model]?.onUpdate
              ? ((await createFunctionHandle(
                  authFunctions.onUpdate
                )) as FunctionHandle<'mutation'>)
              : undefined;

          const result = await handlePagination(async ({ paginationOpts }) => {
            return await ctx.runMutation(authFunctions.updateMany, {
              input: {
                ...(data as any),
                where: parseWhere(data.where),
              },
              paginationOpts,
              onUpdateHandle: onUpdateHandle,
            });
          });

          return result.count;
        },
      };
    },
  });
};

export const dbAdapter = <
  DataModel extends GenericDataModel,
  Schema extends SchemaDefinition<any, any>,
>(
  ctx: GenericCtx<DataModel>,
  schema: Schema,
  options: BetterAuthOptions,
  {
    debugLogs,
    authFunctions,
    triggers,
  }: {
    authFunctions: AuthFunctions;
    debugLogs?: AdapterDebugLogs;
    triggers?: Triggers<DataModel, Schema>;
  }
) => {
  const betterAuthSchema = getAuthTables(options);

  return createAdapterFactory({
    config: {
      ...adapterConfig,
      debugLogs: debugLogs || false,
    },
    adapter: ({ options }) => {
      options.telemetry = { enabled: false };
      return {
        id: 'convex',
        createSchema,
        create: async ({ model, data, select }): Promise<any> => {
          const onCreateHandle =
            authFunctions.onCreate && triggers?.[model]?.onCreate
              ? ((await createFunctionHandle(
                  authFunctions.onCreate
                )) as FunctionHandle<'mutation'>)
              : undefined;

          return createHandler(
            ctx,
            {
              input: { model, data },
              select,
              onCreateHandle: onCreateHandle,
            },
            schema,
            betterAuthSchema
          );
        },
        findOne: async (data): Promise<any> => {
          if (data.where?.every((w) => w.connector === 'OR')) {
            for (const w of data.where) {
              const result = await findOneHandler(
                ctx,
                {
                  ...data,
                  where: parseWhere([w]),
                },
                schema,
                betterAuthSchema
              );
              if (result) {
                return result;
              }
            }
          }
          return await findOneHandler(
            ctx,
            {
              ...data,
              where: parseWhere(data.where),
            },
            schema,
            betterAuthSchema
          );
        },
        findMany: async (data): Promise<any[]> => {
          if (data.offset) {
            throw new Error('offset not supported');
          }
          if (data.where?.some((w) => w.connector === 'OR')) {
            throw new Error('OR connector not supported in findMany');
          }
          const result = await handlePagination(
            async ({ paginationOpts }) => {
              return await findManyHandler(
                ctx,
                {
                  ...data,
                  where: parseWhere(data.where),
                  paginationOpts,
                },
                schema,
                betterAuthSchema
              );
            },
            { limit: data.limit }
          );
          return result.docs;
        },
        count: async (data) => {
          if (data.where?.some((w) => w.connector === 'OR')) {
            throw new Error('OR connector not supported in findMany');
          }
          const result = await handlePagination(async ({ paginationOpts }) => {
            return await findManyHandler(
              ctx,
              {
                ...data,
                where: parseWhere(data.where),
                paginationOpts,
              },
              schema,
              betterAuthSchema
            );
          });
          return result.docs?.length ?? 0;
        },
        update: async (data): Promise<any> => {
          if (data.where?.length === 1 && data.where[0].operator === 'eq') {
            const onUpdateHandle =
              authFunctions.onUpdate && triggers?.[data.model]?.onUpdate
                ? ((await createFunctionHandle(
                    authFunctions.onUpdate
                  )) as FunctionHandle<'mutation'>)
                : undefined;

            return updateOneHandler(
              ctx,
              {
                input: {
                  model: data.model as any,
                  where: parseWhere(data.where),
                  update: data.update as any,
                },
                onUpdateHandle: onUpdateHandle,
              },
              schema,
              betterAuthSchema
            );
          }
          throw new Error('where clause not supported');
        },
        delete: async (data) => {
          const onDeleteHandle =
            authFunctions.onDelete && triggers?.[data.model]?.onDelete
              ? ((await createFunctionHandle(
                  authFunctions.onDelete
                )) as FunctionHandle<'mutation'>)
              : undefined;

          await deleteOneHandler(
            ctx,
            {
              input: {
                model: data.model,
                where: parseWhere(data.where),
              },
              onDeleteHandle: onDeleteHandle,
            },
            schema,
            betterAuthSchema
          );
        },
        deleteMany: async (data) => {
          const onDeleteHandle =
            authFunctions.onDelete && triggers?.[data.model]?.onDelete
              ? ((await createFunctionHandle(
                  authFunctions.onDelete
                )) as FunctionHandle<'mutation'>)
              : undefined;

          const result = await handlePagination(async ({ paginationOpts }) => {
            return await deleteManyHandler(
              ctx,
              {
                input: {
                  ...data,
                  where: parseWhere(data.where),
                },
                paginationOpts,
                onDeleteHandle: onDeleteHandle,
              },
              schema,
              betterAuthSchema
            );
          });
          return result.count;
        },
        updateMany: async (data) => {
          const onUpdateHandle =
            authFunctions.onUpdate && triggers?.[data.model]?.onUpdate
              ? ((await createFunctionHandle(
                  authFunctions.onUpdate
                )) as FunctionHandle<'mutation'>)
              : undefined;

          const result = await handlePagination(async ({ paginationOpts }) => {
            return await updateManyHandler(
              ctx,
              {
                input: {
                  ...(data as any),
                  where: parseWhere(data.where),
                },
                paginationOpts,
                onUpdateHandle: onUpdateHandle,
              },
              schema,
              betterAuthSchema
            );
          });

          return result.count;
        },
      };
    },
  });
};
