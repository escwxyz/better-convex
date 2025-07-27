import type { Message } from 'ai';
import type {
  GenericEnt,
  GenericEntWriter,
  PromiseTableWriter,
} from 'convex-ents';
import type { FunctionReturnType, WithoutSystemFields } from 'convex/server';

import type { api } from '../_generated/api';
import type { Doc, TableNames } from '../_generated/dataModel';
import type { entDefinitions } from '../schema';

export type DocWithId<TableName extends TableNames> = WithoutSystemFields<
  Doc<TableName>
> & {
  id: Doc<TableName>['_id'];
};

export type ApiChatMessagesMap = NonNullable<
  FunctionReturnType<typeof api.chat.getChat>
>['messagesMap'];

export type ApiChatMessage = ApiChatMessagesMap[string] & {
  parts?: Message['parts'];
};

// Ent types for read and write operations
export type Ent<TableName extends TableNames> = GenericEnt<
  typeof entDefinitions,
  TableName
>;

export type EntWriter<TableName extends TableNames> = GenericEntWriter<
  typeof entDefinitions,
  TableName
>;

export type EntInsert<TableName extends TableNames> = Parameters<
  Awaited<PromiseTableWriter<TableName, typeof entDefinitions>['insert']>
>[0];

export type EntInsertMany<TableName extends TableNames> = Parameters<
  Awaited<PromiseTableWriter<TableName, typeof entDefinitions>['insertMany']>
>[0];
