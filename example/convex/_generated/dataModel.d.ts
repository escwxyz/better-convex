/* eslint-disable */
/**
 * Generated data model types.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  DocumentByName,
  TableNamesInDataModel,
  SystemTableNames,
  AnyDataModel,
} from "convex/server";
import type { GenericId } from "convex/values";

/**
 * A type describing your Convex data model.
 *
 * This type includes information about what tables you have, the type of
 * documents stored in those tables, and the indexes defined on them.
 *
 * This type is used to parameterize methods like `queryGeneric` and
 * `mutationGeneric` to make them type-safe.
 */

export type DataModel = {
  account: {
    document: {
      accessToken?: null | string;
      accessTokenExpiresAt?: null | number;
      accountId: string;
      createdAt: number;
      idToken?: null | string;
      password?: null | string;
      providerId: string;
      refreshToken?: null | string;
      refreshTokenExpiresAt?: null | number;
      scope?: null | string;
      updatedAt: number;
      userId: Id<"user">;
      _id: Id<"account">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "accessToken"
      | "accessTokenExpiresAt"
      | "accountId"
      | "createdAt"
      | "idToken"
      | "password"
      | "providerId"
      | "refreshToken"
      | "refreshTokenExpiresAt"
      | "scope"
      | "updatedAt"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      accountId: ["accountId", "_creationTime"];
      accountId_providerId: ["accountId", "providerId", "_creationTime"];
      providerId_userId: ["providerId", "userId", "_creationTime"];
      userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  commentReplies: {
    document: {
      parentId: Id<"todoComments">;
      replyId: Id<"todoComments">;
      _id: Id<"commentReplies">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "parentId" | "replyId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      parentId: ["parentId", "_creationTime"];
      parentId_replyId: ["parentId", "replyId", "_creationTime"];
      replyId: ["replyId", "_creationTime"];
      replyId_parentId: ["replyId", "parentId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  invitation: {
    document: {
      email: string;
      expiresAt: number;
      inviterId: Id<"user">;
      organizationId: Id<"organization">;
      role?: null | string;
      status: string;
      _id: Id<"invitation">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "email"
      | "expiresAt"
      | "inviterId"
      | "organizationId"
      | "role"
      | "status";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      email: ["email", "_creationTime"];
      email_organizationId_status: [
        "email",
        "organizationId",
        "status",
        "_creationTime",
      ];
      email_status: ["email", "status", "_creationTime"];
      inviterId: ["inviterId", "_creationTime"];
      organizationId: ["organizationId", "_creationTime"];
      organizationId_email: ["organizationId", "email", "_creationTime"];
      organizationId_email_status: [
        "organizationId",
        "email",
        "status",
        "_creationTime",
      ];
      organizationId_status: ["organizationId", "status", "_creationTime"];
      status: ["status", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  jwks: {
    document: {
      createdAt: number;
      privateKey: string;
      publicKey: string;
      _id: Id<"jwks">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "createdAt"
      | "privateKey"
      | "publicKey";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  member: {
    document: {
      createdAt: number;
      organizationId: Id<"organization">;
      role: string;
      userId: Id<"user">;
      _id: Id<"member">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "createdAt"
      | "organizationId"
      | "role"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      organizationId: ["organizationId", "_creationTime"];
      organizationId_role: ["organizationId", "role", "_creationTime"];
      organizationId_userId: ["organizationId", "userId", "_creationTime"];
      role: ["role", "_creationTime"];
      userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  organization: {
    document: {
      createdAt: number;
      logo?: null | string;
      metadata?: null | string;
      monthlyCredits: number;
      name: string;
      slug: string;
      _id: Id<"organization">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "createdAt"
      | "logo"
      | "metadata"
      | "monthlyCredits"
      | "name"
      | "slug";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      name: ["name", "_creationTime"];
      slug: ["slug", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  projectMembers: {
    document: {
      projectId: Id<"projects">;
      userId: Id<"user">;
      _id: Id<"projectMembers">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "projectId" | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      projectId: ["projectId", "_creationTime"];
      projectId_userId: ["projectId", "userId", "_creationTime"];
      userId: ["userId", "_creationTime"];
      userId_projectId: ["userId", "projectId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  projects: {
    document: {
      archived: boolean;
      description?: string;
      isPublic: boolean;
      name: string;
      ownerId: Id<"user">;
      _id: Id<"projects">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "archived"
      | "description"
      | "isPublic"
      | "name"
      | "ownerId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      archived: ["archived", "_creationTime"];
      isPublic: ["isPublic", "_creationTime"];
      ownerId: ["ownerId", "_creationTime"];
    };
    searchIndexes: {
      search_name_description: {
        searchField: "name";
        filterFields: "archived" | "isPublic";
      };
    };
    vectorIndexes: {};
  };
  session: {
    document: {
      activeOrganizationId?: null | string;
      createdAt: number;
      expiresAt: number;
      impersonatedBy?: null | string;
      ipAddress?: null | string;
      token: string;
      updatedAt: number;
      userAgent?: null | string;
      userId: Id<"user">;
      _id: Id<"session">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "activeOrganizationId"
      | "createdAt"
      | "expiresAt"
      | "impersonatedBy"
      | "ipAddress"
      | "token"
      | "updatedAt"
      | "userAgent"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      expiresAt: ["expiresAt", "_creationTime"];
      expiresAt_userId: ["expiresAt", "userId", "_creationTime"];
      token: ["token", "_creationTime"];
      userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  subscriptions: {
    document: {
      amount?: number | null;
      cancelAtPeriodEnd: boolean;
      checkoutId?: string | null;
      createdAt: string;
      currency?: string | null;
      currentPeriodEnd?: string | null;
      currentPeriodStart: string;
      customerCancellationComment?: string | null;
      customerCancellationReason?: string | null;
      endedAt?: string | null;
      metadata: Record<string, any>;
      modifiedAt?: string | null;
      organizationId: string;
      priceId?: string;
      productId: string;
      recurringInterval?: string | null;
      startedAt?: string | null;
      status: string;
      subscriptionId: string;
      userId: Id<"user">;
      _id: Id<"subscriptions">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "amount"
      | "cancelAtPeriodEnd"
      | "checkoutId"
      | "createdAt"
      | "currency"
      | "currentPeriodEnd"
      | "currentPeriodStart"
      | "customerCancellationComment"
      | "customerCancellationReason"
      | "endedAt"
      | "metadata"
      | `metadata.${string}`
      | "modifiedAt"
      | "organizationId"
      | "priceId"
      | "productId"
      | "recurringInterval"
      | "startedAt"
      | "status"
      | "subscriptionId"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      organizationId: ["organizationId", "_creationTime"];
      organizationId_status: ["organizationId", "status", "_creationTime"];
      subscriptionId: ["subscriptionId", "_creationTime"];
      userId: ["userId", "_creationTime"];
      userId_endedAt: ["userId", "endedAt", "_creationTime"];
      userId_organizationId_status: [
        "userId",
        "organizationId",
        "status",
        "_creationTime",
      ];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  tags: {
    document: {
      color: string;
      createdBy: Id<"user">;
      name: string;
      _id: Id<"tags">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "color" | "createdBy" | "name";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      createdBy: ["createdBy", "_creationTime"];
      name: ["name", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  todoComments: {
    document: {
      content: string;
      parentId?: Id<"todoComments">;
      todoId: Id<"todos">;
      userId: Id<"user">;
      _id: Id<"todoComments">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "content"
      | "parentId"
      | "todoId"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      parentId: ["parentId", "_creationTime"];
      todoId: ["todoId", "_creationTime"];
      userId: ["userId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  todos: {
    document: {
      completed: boolean;
      deletionTime?: number;
      description?: string;
      dueDate?: number;
      priority?: "low" | "medium" | "high";
      projectId?: Id<"projects">;
      title: string;
      userId: Id<"user">;
      _id: Id<"todos">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "completed"
      | "deletionTime"
      | "description"
      | "dueDate"
      | "priority"
      | "projectId"
      | "title"
      | "userId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      completed: ["completed", "_creationTime"];
      dueDate: ["dueDate", "_creationTime"];
      priority: ["priority", "_creationTime"];
      projectId: ["projectId", "_creationTime"];
      userId: ["userId", "_creationTime"];
      user_completed: ["userId", "completed", "_creationTime"];
    };
    searchIndexes: {
      search_title_description: {
        searchField: "title";
        filterFields: "completed" | "projectId" | "userId";
      };
    };
    vectorIndexes: {};
  };
  todoTags: {
    document: {
      tagId: Id<"tags">;
      todoId: Id<"todos">;
      _id: Id<"todoTags">;
      _creationTime: number;
    };
    fieldPaths: "_creationTime" | "_id" | "tagId" | "todoId";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      tagId: ["tagId", "_creationTime"];
      tagId_todoId: ["tagId", "todoId", "_creationTime"];
      todoId: ["todoId", "_creationTime"];
      todoId_tagId: ["todoId", "tagId", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  user: {
    document: {
      banExpires?: null | number;
      banReason?: null | string;
      banned?: null | boolean;
      bio?: null | string;
      createdAt: number;
      customerId?: string;
      deletedAt?: number;
      email: string;
      emailVerified: boolean;
      firstName?: null | string;
      github?: null | string;
      image?: null | string;
      lastActiveOrganizationId?: Id<"organization">;
      lastName?: null | string;
      linkedin?: null | string;
      location?: null | string;
      name: string;
      personalOrganizationId?: Id<"organization">;
      role?: null | string;
      updatedAt: number;
      username?: null | string;
      website?: null | string;
      x?: null | string;
      _id: Id<"user">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "banExpires"
      | "banned"
      | "banReason"
      | "bio"
      | "createdAt"
      | "customerId"
      | "deletedAt"
      | "email"
      | "emailVerified"
      | "firstName"
      | "github"
      | "image"
      | "lastActiveOrganizationId"
      | "lastName"
      | "linkedin"
      | "location"
      | "name"
      | "personalOrganizationId"
      | "role"
      | "updatedAt"
      | "username"
      | "website"
      | "x";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      customerId: ["customerId", "_creationTime"];
      email: ["email", "_creationTime"];
      email_name: ["email", "name", "_creationTime"];
      lastActiveOrganizationId: ["lastActiveOrganizationId", "_creationTime"];
      name: ["name", "_creationTime"];
      personalOrganizationId: ["personalOrganizationId", "_creationTime"];
      username: ["username", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
  verification: {
    document: {
      createdAt: number;
      expiresAt: number;
      identifier: string;
      updatedAt: number;
      value: string;
      _id: Id<"verification">;
      _creationTime: number;
    };
    fieldPaths:
      | "_creationTime"
      | "_id"
      | "createdAt"
      | "expiresAt"
      | "identifier"
      | "updatedAt"
      | "value";
    indexes: {
      by_id: ["_id"];
      by_creation_time: ["_creationTime"];
      expiresAt: ["expiresAt", "_creationTime"];
      identifier: ["identifier", "_creationTime"];
    };
    searchIndexes: {};
    vectorIndexes: {};
  };
};

/**
 * The names of all of your Convex tables.
 */
export type TableNames = TableNamesInDataModel<DataModel>;

/**
 * The type of a document stored in Convex.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Doc<TableName extends TableNames> = DocumentByName<
  DataModel,
  TableName
>;

/**
 * An identifier for a document in Convex.
 *
 * Convex documents are uniquely identified by their `Id`, which is accessible
 * on the `_id` field. To learn more, see [Document IDs](https://docs.convex.dev/using/document-ids).
 *
 * Documents can be loaded using `db.get(tableName, id)` in query and mutation functions.
 *
 * IDs are just strings at runtime, but this type can be used to distinguish them from other
 * strings when type checking.
 *
 * @typeParam TableName - A string literal type of the table name (like "users").
 */
export type Id<TableName extends TableNames | SystemTableNames> =
  GenericId<TableName>;
