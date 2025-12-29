/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type { FunctionReference } from "convex/server";
import type { GenericId as Id } from "convex/values";

/**
 * A utility for referencing Convex functions in your app's public API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
export declare const api: {
  admin: {
    checkUserAdminStatus: FunctionReference<
      "query",
      "public",
      { userId: Id<"user"> },
      { isAdmin: boolean; role?: string | null }
    >;
    getAllUsers: FunctionReference<
      "query",
      "public",
      {
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        role?: "all" | "user" | "admin";
        search?: string;
      },
      any
    >;
    getDashboardStats: FunctionReference<
      "query",
      "public",
      {},
      {
        recentUsers: Array<{
          _creationTime: number;
          _id: Id<"user">;
          image?: string | null;
          name?: string;
        }>;
        totalAdmins: number;
        totalUsers: number;
        userGrowth: Array<{ count: number; date: string }>;
      }
    >;
    grantAdminByEmail: FunctionReference<
      "mutation",
      "public",
      { email: string; role: "admin" },
      { success: boolean; userId?: Id<"user"> }
    >;
    updateUserRole: FunctionReference<
      "mutation",
      "public",
      { role: "user" | "admin"; userId: Id<"user"> },
      boolean
    >;
  };
  emails: {
    sendOrganizationInviteEmail: FunctionReference<
      "action",
      "public",
      {
        acceptUrl: string;
        invitationId: string;
        inviterEmail: string;
        inviterName: string;
        organizationName: string;
        role: string;
        to: string;
      },
      string
    >;
  };
  organization: {
    acceptInvitation: FunctionReference<
      "mutation",
      "public",
      { invitationId: Id<"invitation"> },
      null
    >;
    cancelInvitation: FunctionReference<
      "mutation",
      "public",
      { invitationId: Id<"invitation"> },
      null
    >;
    createOrganization: FunctionReference<
      "mutation",
      "public",
      { name: string },
      { id: Id<"organization">; slug: string }
    >;
    deleteOrganization: FunctionReference<"mutation", "public", {}, null>;
    getOrganization: FunctionReference<
      "query",
      "public",
      { slug: string },
      {
        createdAt: number;
        id: Id<"organization">;
        isActive: boolean;
        isPersonal: boolean;
        logo?: string | null;
        membersCount: number;
        name: string;
        plan: string;
        role?: string;
        slug: string;
      } | null
    >;
    getOrganizationOverview: FunctionReference<
      "query",
      "public",
      { inviteId?: Id<"invitation">; slug: string },
      {
        createdAt: number;
        id: Id<"organization">;
        invitation: {
          email: string;
          expiresAt: number;
          id: Id<"invitation">;
          inviterEmail: string;
          inviterId: Id<"user">;
          inviterName: string;
          inviterUsername: string | null;
          organizationId: Id<"organization">;
          organizationName: string;
          organizationSlug: string;
          role: string;
          status: string;
        } | null;
        isActive: boolean;
        isPersonal: boolean;
        logo?: string | null;
        name: string;
        plan?: string;
        role?: string;
        slug: string;
      } | null
    >;
    inviteMember: FunctionReference<
      "mutation",
      "public",
      { email: string; role: "owner" | "member" },
      null
    >;
    leaveOrganization: FunctionReference<"mutation", "public", {}, null>;
    listMembers: FunctionReference<
      "query",
      "public",
      { slug: string },
      {
        currentUserRole?: string;
        isPersonal: boolean;
        members: Array<{
          createdAt: number;
          id: Id<"member">;
          organizationId: Id<"organization">;
          role?: string;
          user: {
            email: string;
            id: Id<"user">;
            image?: string | null;
            name: string | null;
          };
          userId: Id<"user">;
        }>;
      }
    >;
    listOrganizations: FunctionReference<
      "query",
      "public",
      {},
      {
        canCreateOrganization: boolean;
        organizations: Array<{
          createdAt: number;
          id: Id<"organization">;
          isPersonal: boolean;
          logo?: string | null;
          name: string;
          plan: string;
          slug: string;
        }>;
      }
    >;
    listPendingInvitations: FunctionReference<
      "query",
      "public",
      { slug: string },
      Array<{
        createdAt: number;
        email: string;
        expiresAt: number;
        id: Id<"invitation">;
        organizationId: Id<"organization">;
        role: string;
        status: string;
      }>
    >;
    rejectInvitation: FunctionReference<
      "mutation",
      "public",
      { invitationId: Id<"invitation"> },
      null
    >;
    removeMember: FunctionReference<
      "mutation",
      "public",
      { memberId: Id<"member"> },
      null
    >;
    setActiveOrganization: FunctionReference<
      "mutation",
      "public",
      { organizationId: Id<"organization"> },
      null
    >;
    updateMemberRole: FunctionReference<
      "mutation",
      "public",
      { memberId: Id<"member">; role: "owner" | "member" },
      null
    >;
    updateOrganization: FunctionReference<
      "mutation",
      "public",
      { logo?: string; name?: string; slug?: string },
      null
    >;
  };
  projects: {
    addMember: FunctionReference<
      "mutation",
      "public",
      { projectId: Id<"projects">; userEmail: string },
      null
    >;
    archive: FunctionReference<
      "mutation",
      "public",
      { projectId: Id<"projects"> },
      null
    >;
    create: FunctionReference<
      "mutation",
      "public",
      { description?: string; isPublic?: boolean; name: string },
      Id<"projects">
    >;
    get: FunctionReference<
      "query",
      "public",
      { projectId: Id<"projects"> },
      {
        _creationTime: number;
        _id: Id<"projects">;
        archived: boolean;
        completedTodoCount: number;
        description?: string;
        isPublic: boolean;
        members: Array<{
          _id: Id<"user">;
          email: string;
          joinedAt: number;
          name: string | null;
        }>;
        name: string;
        owner: { _id: Id<"user">; email: string; name: string | null };
        ownerId: Id<"user">;
        todoCount: number;
      } | null
    >;
    leave: FunctionReference<
      "mutation",
      "public",
      { projectId: Id<"projects"> },
      null
    >;
    list: FunctionReference<
      "query",
      "public",
      {
        includeArchived?: boolean;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    listForDropdown: FunctionReference<
      "query",
      "public",
      {},
      Array<{ _id: Id<"projects">; isOwner: boolean; name: string }>
    >;
    removeMember: FunctionReference<
      "mutation",
      "public",
      { projectId: Id<"projects">; userId: Id<"user"> },
      null
    >;
    restore: FunctionReference<
      "mutation",
      "public",
      { projectId: Id<"projects"> },
      null
    >;
    transfer: FunctionReference<
      "mutation",
      "public",
      { newOwnerId: Id<"user">; projectId: Id<"projects"> },
      null
    >;
    update: FunctionReference<
      "mutation",
      "public",
      {
        description?: string | null;
        isPublic?: boolean;
        name?: string;
        projectId: Id<"projects">;
      },
      null
    >;
  };
  seed: {
    generateSamples: FunctionReference<
      "action",
      "public",
      { count?: number },
      { created: number; todosCreated: number }
    >;
  };
  tags: {
    create: FunctionReference<
      "mutation",
      "public",
      { color?: string; name: string },
      Id<"tags">
    >;
    deleteTag: FunctionReference<
      "mutation",
      "public",
      { tagId: Id<"tags"> },
      null
    >;
    list: FunctionReference<
      "query",
      "public",
      {},
      Array<{
        _creationTime: number;
        _id: Id<"tags">;
        color: string;
        name: string;
        usageCount: number;
      }>
    >;
    merge: FunctionReference<
      "mutation",
      "public",
      { sourceTagId: Id<"tags">; targetTagId: Id<"tags"> },
      null
    >;
    popular: FunctionReference<
      "query",
      "public",
      { limit?: number },
      Array<{
        _id: Id<"tags">;
        color: string;
        isOwn: boolean;
        name: string;
        usageCount: number;
      }>
    >;
    update: FunctionReference<
      "mutation",
      "public",
      { color?: string; name?: string; tagId: Id<"tags"> },
      null
    >;
  };
  todoComments: {
    addComment: FunctionReference<
      "mutation",
      "public",
      { content: string; parentId?: Id<"todoComments">; todoId: Id<"todos"> },
      Id<"todoComments">
    >;
    deleteComment: FunctionReference<
      "mutation",
      "public",
      { commentId: Id<"todoComments"> },
      null
    >;
    getCommentThread: FunctionReference<
      "query",
      "public",
      { commentId: Id<"todoComments">; maxDepth?: number },
      {
        comment: {
          _id: Id<"todoComments">;
          ancestors: Array<{
            _id: Id<"todoComments">;
            content: string;
            user: { name?: string } | null;
          }>;
          content: string;
          createdAt: number;
          parent: {
            _id: Id<"todoComments">;
            content: string;
            user: { name?: string } | null;
          } | null;
          replies: Array<any>;
          todo: { completed: boolean; title: string };
          todoId: Id<"todos">;
          user: {
            _id: Id<"user">;
            image?: string | null;
            name?: string;
          } | null;
        };
      } | null
    >;
    getTodoComments: FunctionReference<
      "query",
      "public",
      {
        includeReplies?: boolean;
        maxReplyDepth?: number;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        todoId: Id<"todos">;
      },
      any
    >;
    getUserComments: FunctionReference<
      "query",
      "public",
      {
        includeTodo?: boolean;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        userId: Id<"user">;
      },
      any
    >;
    toggleReaction: FunctionReference<
      "mutation",
      "public",
      {
        commentId: Id<"todoComments">;
        emoji: "👍" | "❤️" | "😂" | "🎉" | "😕" | "👎";
      },
      { added: boolean; counts: Record<string, number> }
    >;
    updateComment: FunctionReference<
      "mutation",
      "public",
      { commentId: Id<"todoComments">; content: string },
      null
    >;
  };
  todos: {
    bulkDelete: FunctionReference<
      "mutation",
      "public",
      { ids: Array<Id<"todos">> },
      { deleted: number; errors: Array<string> }
    >;
    create: FunctionReference<
      "mutation",
      "public",
      {
        description?: string;
        dueDate?: number;
        priority?: "low" | "medium" | "high";
        projectId?: Id<"projects">;
        tagIds?: Array<Id<"tags">>;
        title: string;
      },
      Id<"todos">
    >;
    deleteTodo: FunctionReference<
      "mutation",
      "public",
      { id: Id<"todos"> },
      null
    >;
    get: FunctionReference<
      "query",
      "public",
      { id: Id<"todos"> },
      {
        _creationTime: number;
        _id: Id<"todos">;
        completed: boolean;
        deletionTime?: number;
        description?: string;
        dueDate?: number;
        priority?: "low" | "medium" | "high";
        project: {
          _creationTime: number;
          _id: Id<"projects">;
          archived: boolean;
          description?: string;
          isPublic: boolean;
          name: string;
          ownerId: Id<"user">;
        } | null;
        projectId?: Id<"projects">;
        tags: Array<{
          _creationTime: number;
          _id: Id<"tags">;
          color: string;
          createdBy: Id<"user">;
          name: string;
        }>;
        title: string;
        user: {
          _creationTime: number;
          _id: Id<"user">;
          email: string;
          image?: string | null;
          name?: string;
        };
        userId: Id<"user">;
      } | null
    >;
    list: FunctionReference<
      "query",
      "public",
      {
        completed?: boolean;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        priority?: "low" | "medium" | "high";
        projectId?: Id<"projects">;
      },
      any
    >;
    reorder: FunctionReference<
      "mutation",
      "public",
      { projectId?: Id<"projects">; targetIndex: number; todoId: Id<"todos"> },
      null
    >;
    restore: FunctionReference<"mutation", "public", { id: Id<"todos"> }, null>;
    search: FunctionReference<
      "query",
      "public",
      {
        completed?: boolean;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        projectId?: Id<"projects">;
        query: string;
      },
      any
    >;
    toggleComplete: FunctionReference<
      "mutation",
      "public",
      { id: Id<"todos"> },
      boolean
    >;
    update: FunctionReference<
      "mutation",
      "public",
      {
        description?: string;
        dueDate?: number | null;
        id: Id<"todos">;
        priority?: "low" | "medium" | "high" | null;
        projectId?: Id<"projects"> | null;
        tagIds?: Array<Id<"tags">>;
        title?: string;
      },
      null
    >;
  };
  user: {
    getCurrentUser: FunctionReference<
      "query",
      "public",
      any,
      {
        activeOrganization: {
          id: Id<"organization">;
          logo?: string | null;
          name: string;
          role: string;
          slug: string;
        } | null;
        id: Id<"user">;
        image?: string | null;
        isAdmin: boolean;
        name?: string;
        personalOrganizationId?: Id<"organization">;
        plan?: string;
      } | null
    >;
    getIsAuthenticated: FunctionReference<"query", "public", any, boolean>;
    getSessionUser: FunctionReference<
      "query",
      "public",
      any,
      {
        activeOrganization: {
          id: Id<"organization">;
          logo?: string | null;
          name: string;
          role: string;
          slug: string;
        } | null;
        id: Id<"user">;
        image?: string | null;
        isAdmin: boolean;
        name?: string;
        personalOrganizationId?: Id<"organization">;
        plan?: string;
      } | null
    >;
    updateSettings: FunctionReference<
      "mutation",
      "public",
      { bio?: string; name?: string },
      { success: boolean }
    >;
  };
};

/**
 * A utility for referencing Convex functions in your app's internal API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = internal.myModule.myFunction;
 * ```
 */
export declare const internal: {
  auth: {
    beforeCreate: FunctionReference<
      "mutation",
      "internal",
      { data: any; model: string },
      any
    >;
    beforeDelete: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    beforeUpdate: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string; update: any },
      any
    >;
    create: FunctionReference<
      "mutation",
      "internal",
      {
        beforeCreateHandle?: string;
        input:
          | {
              data: {
                activeOrganizationId?: null | string;
                createdAt?: number;
                expiresAt?: number;
                impersonatedBy?: null | string;
                ipAddress?: null | string;
                token?: string;
                updatedAt?: number;
                userAgent?: null | string;
                userId?: Id<"user">;
              };
              model: "session";
            }
          | {
              data: {
                accessToken?: null | string;
                accessTokenExpiresAt?: null | number;
                accountId?: string;
                createdAt?: number;
                idToken?: null | string;
                password?: null | string;
                providerId?: string;
                refreshToken?: null | string;
                refreshTokenExpiresAt?: null | number;
                scope?: null | string;
                updatedAt?: number;
                userId?: Id<"user">;
              };
              model: "account";
            }
          | {
              data: {
                createdAt?: number;
                expiresAt?: number;
                identifier?: string;
                updatedAt?: number;
                value?: string;
              };
              model: "verification";
            }
          | {
              data: {
                createdAt?: number;
                logo?: null | string;
                metadata?: null | string;
                monthlyCredits?: number;
                name?: string;
                slug?: string;
              };
              model: "organization";
            }
          | {
              data: {
                createdAt?: number;
                organizationId?: Id<"organization">;
                role?: string;
                userId?: Id<"user">;
              };
              model: "member";
            }
          | {
              data: {
                email?: string;
                expiresAt?: number;
                inviterId?: Id<"user">;
                organizationId?: Id<"organization">;
                role?: null | string;
                status?: string;
              };
              model: "invitation";
            }
          | {
              data: {
                createdAt?: number;
                privateKey?: string;
                publicKey?: string;
              };
              model: "jwks";
            }
          | {
              data: {
                banExpires?: null | number;
                banReason?: null | string;
                banned?: null | boolean;
                bio?: null | string;
                createdAt?: number;
                customerId?: string;
                deletedAt?: number;
                email?: string;
                emailVerified?: boolean;
                firstName?: null | string;
                github?: null | string;
                image?: null | string;
                lastActiveOrganizationId?: Id<"organization">;
                lastName?: null | string;
                linkedin?: null | string;
                location?: null | string;
                name?: string;
                personalOrganizationId?: Id<"organization">;
                role?: null | string;
                updatedAt?: number;
                username?: null | string;
                website?: null | string;
                x?: null | string;
              };
              model: "user";
            }
          | {
              data: {
                amount?: number | null;
                cancelAtPeriodEnd?: boolean;
                checkoutId?: string | null;
                createdAt?: string;
                currency?: string | null;
                currentPeriodEnd?: string | null;
                currentPeriodStart?: string;
                customerCancellationComment?: string | null;
                customerCancellationReason?: string | null;
                endedAt?: string | null;
                metadata?: Record<string, any>;
                modifiedAt?: string | null;
                organizationId?: string;
                priceId?: string;
                productId?: string;
                recurringInterval?: string | null;
                startedAt?: string | null;
                status?: string;
                subscriptionId?: string;
                userId?: Id<"user">;
              };
              model: "subscriptions";
            }
          | {
              data: {
                completed?: boolean;
                deletionTime?: number;
                description?: string;
                dueDate?: number;
                priority?: "low" | "medium" | "high";
                projectId?: Id<"projects">;
                title?: string;
                userId?: Id<"user">;
              };
              model: "todos";
            }
          | {
              data: {
                archived?: boolean;
                description?: string;
                isPublic?: boolean;
                name?: string;
                ownerId?: Id<"user">;
              };
              model: "projects";
            }
          | {
              data: { color?: string; createdBy?: Id<"user">; name?: string };
              model: "tags";
            }
          | {
              data: {
                content?: string;
                parentId?: Id<"todoComments">;
                todoId?: Id<"todos">;
                userId?: Id<"user">;
              };
              model: "todoComments";
            }
          | {
              data: { projectId?: Id<"projects">; userId?: Id<"user"> };
              model: "projectMembers";
            }
          | {
              data: { tagId?: Id<"tags">; todoId?: Id<"todos"> };
              model: "todoTags";
            }
          | {
              data: {
                parentId?: Id<"todoComments">;
                replyId?: Id<"todoComments">;
              };
              model: "commentReplies";
            };
        onCreateHandle?: string;
        select?: Array<string>;
      },
      any
    >;
    deleteMany: FunctionReference<
      "mutation",
      "internal",
      {
        beforeDeleteHandle?: string;
        input:
          | {
              model: "session";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "expiresAt"
                  | "createdAt"
                  | "updatedAt"
                  | "ipAddress"
                  | "userAgent"
                  | "impersonatedBy"
                  | "activeOrganizationId"
                  | "token"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "account";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "accountId"
                  | "providerId"
                  | "accessToken"
                  | "refreshToken"
                  | "idToken"
                  | "accessTokenExpiresAt"
                  | "refreshTokenExpiresAt"
                  | "scope"
                  | "password"
                  | "createdAt"
                  | "updatedAt"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "verification";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "value"
                  | "createdAt"
                  | "updatedAt"
                  | "identifier"
                  | "expiresAt"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "organization";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "logo"
                  | "createdAt"
                  | "metadata"
                  | "monthlyCredits"
                  | "slug"
                  | "name"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "member";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "role"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "invitation";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "role"
                  | "expiresAt"
                  | "email"
                  | "status"
                  | "organizationId"
                  | "inviterId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "jwks";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "publicKey" | "privateKey" | "createdAt" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "user";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "emailVerified"
                  | "createdAt"
                  | "updatedAt"
                  | "image"
                  | "role"
                  | "banned"
                  | "banReason"
                  | "banExpires"
                  | "bio"
                  | "firstName"
                  | "github"
                  | "lastName"
                  | "linkedin"
                  | "location"
                  | "username"
                  | "website"
                  | "x"
                  | "deletedAt"
                  | "email"
                  | "customerId"
                  | "lastActiveOrganizationId"
                  | "personalOrganizationId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "subscriptions";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "modifiedAt"
                  | "amount"
                  | "currency"
                  | "recurringInterval"
                  | "status"
                  | "currentPeriodStart"
                  | "currentPeriodEnd"
                  | "cancelAtPeriodEnd"
                  | "startedAt"
                  | "endedAt"
                  | "priceId"
                  | "productId"
                  | "checkoutId"
                  | "metadata"
                  | "customerCancellationReason"
                  | "customerCancellationComment"
                  | "subscriptionId"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todos";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "title"
                  | "description"
                  | "completed"
                  | "priority"
                  | "dueDate"
                  | "deletionTime"
                  | "userId"
                  | "projectId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projects";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "description"
                  | "isPublic"
                  | "archived"
                  | "ownerId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "tags";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "color" | "name" | "createdBy" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoComments";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "content" | "parentId" | "todoId" | "userId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projectMembers";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "userId" | "projectId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoTags";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "todoId" | "tagId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "commentReplies";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "parentId" | "replyId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            };
        onDeleteHandle?: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    deleteOne: FunctionReference<
      "mutation",
      "internal",
      {
        beforeDeleteHandle?: string;
        input:
          | {
              model: "session";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "expiresAt"
                  | "createdAt"
                  | "updatedAt"
                  | "ipAddress"
                  | "userAgent"
                  | "impersonatedBy"
                  | "activeOrganizationId"
                  | "token"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "account";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "accountId"
                  | "providerId"
                  | "accessToken"
                  | "refreshToken"
                  | "idToken"
                  | "accessTokenExpiresAt"
                  | "refreshTokenExpiresAt"
                  | "scope"
                  | "password"
                  | "createdAt"
                  | "updatedAt"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "verification";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "value"
                  | "createdAt"
                  | "updatedAt"
                  | "identifier"
                  | "expiresAt"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "organization";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "logo"
                  | "createdAt"
                  | "metadata"
                  | "monthlyCredits"
                  | "slug"
                  | "name"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "member";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "role"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "invitation";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "role"
                  | "expiresAt"
                  | "email"
                  | "status"
                  | "organizationId"
                  | "inviterId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "jwks";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "publicKey" | "privateKey" | "createdAt" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "user";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "emailVerified"
                  | "createdAt"
                  | "updatedAt"
                  | "image"
                  | "role"
                  | "banned"
                  | "banReason"
                  | "banExpires"
                  | "bio"
                  | "firstName"
                  | "github"
                  | "lastName"
                  | "linkedin"
                  | "location"
                  | "username"
                  | "website"
                  | "x"
                  | "deletedAt"
                  | "email"
                  | "customerId"
                  | "lastActiveOrganizationId"
                  | "personalOrganizationId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "subscriptions";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "modifiedAt"
                  | "amount"
                  | "currency"
                  | "recurringInterval"
                  | "status"
                  | "currentPeriodStart"
                  | "currentPeriodEnd"
                  | "cancelAtPeriodEnd"
                  | "startedAt"
                  | "endedAt"
                  | "priceId"
                  | "productId"
                  | "checkoutId"
                  | "metadata"
                  | "customerCancellationReason"
                  | "customerCancellationComment"
                  | "subscriptionId"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todos";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "title"
                  | "description"
                  | "completed"
                  | "priority"
                  | "dueDate"
                  | "deletionTime"
                  | "userId"
                  | "projectId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projects";
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "description"
                  | "isPublic"
                  | "archived"
                  | "ownerId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "tags";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "color" | "name" | "createdBy" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoComments";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "content" | "parentId" | "todoId" | "userId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projectMembers";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "userId" | "projectId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoTags";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "todoId" | "tagId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "commentReplies";
              where?: Array<{
                connector?: "AND" | "OR";
                field: "parentId" | "replyId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            };
        onDeleteHandle?: string;
      },
      any
    >;
    findMany: FunctionReference<
      "query",
      "internal",
      {
        limit?: number;
        model:
          | "session"
          | "account"
          | "verification"
          | "organization"
          | "member"
          | "invitation"
          | "jwks"
          | "user"
          | "subscriptions"
          | "todos"
          | "projects"
          | "tags"
          | "todoComments"
          | "projectMembers"
          | "todoTags"
          | "commentReplies";
        offset?: number;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
        sortBy?: { direction: "asc" | "desc"; field: string };
        where?: Array<{
          connector?: "AND" | "OR";
          field: string;
          operator?:
            | "lt"
            | "lte"
            | "gt"
            | "gte"
            | "eq"
            | "in"
            | "not_in"
            | "ne"
            | "contains"
            | "starts_with"
            | "ends_with";
          value:
            | string
            | number
            | boolean
            | Array<string>
            | Array<number>
            | null;
        }>;
      },
      any
    >;
    findOne: FunctionReference<
      "query",
      "internal",
      {
        model:
          | "session"
          | "account"
          | "verification"
          | "organization"
          | "member"
          | "invitation"
          | "jwks"
          | "user"
          | "subscriptions"
          | "todos"
          | "projects"
          | "tags"
          | "todoComments"
          | "projectMembers"
          | "todoTags"
          | "commentReplies";
        select?: Array<string>;
        where?: Array<{
          connector?: "AND" | "OR";
          field: string;
          operator?:
            | "lt"
            | "lte"
            | "gt"
            | "gte"
            | "eq"
            | "in"
            | "not_in"
            | "ne"
            | "contains"
            | "starts_with"
            | "ends_with";
          value:
            | string
            | number
            | boolean
            | Array<string>
            | Array<number>
            | null;
        }>;
      },
      any
    >;
    onCreate: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    onDelete: FunctionReference<
      "mutation",
      "internal",
      { doc: any; model: string },
      any
    >;
    onUpdate: FunctionReference<
      "mutation",
      "internal",
      { model: string; newDoc: any; oldDoc: any },
      any
    >;
    updateMany: FunctionReference<
      "mutation",
      "internal",
      {
        beforeUpdateHandle?: string;
        input:
          | {
              model: "session";
              update: {
                activeOrganizationId?: null | string;
                createdAt?: number;
                expiresAt?: number;
                impersonatedBy?: null | string;
                ipAddress?: null | string;
                token?: string;
                updatedAt?: number;
                userAgent?: null | string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "expiresAt"
                  | "createdAt"
                  | "updatedAt"
                  | "ipAddress"
                  | "userAgent"
                  | "impersonatedBy"
                  | "activeOrganizationId"
                  | "token"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "account";
              update: {
                accessToken?: null | string;
                accessTokenExpiresAt?: null | number;
                accountId?: string;
                createdAt?: number;
                idToken?: null | string;
                password?: null | string;
                providerId?: string;
                refreshToken?: null | string;
                refreshTokenExpiresAt?: null | number;
                scope?: null | string;
                updatedAt?: number;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "accountId"
                  | "providerId"
                  | "accessToken"
                  | "refreshToken"
                  | "idToken"
                  | "accessTokenExpiresAt"
                  | "refreshTokenExpiresAt"
                  | "scope"
                  | "password"
                  | "createdAt"
                  | "updatedAt"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "verification";
              update: {
                createdAt?: number;
                expiresAt?: number;
                identifier?: string;
                updatedAt?: number;
                value?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "value"
                  | "createdAt"
                  | "updatedAt"
                  | "identifier"
                  | "expiresAt"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "organization";
              update: {
                createdAt?: number;
                logo?: null | string;
                metadata?: null | string;
                monthlyCredits?: number;
                name?: string;
                slug?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "logo"
                  | "createdAt"
                  | "metadata"
                  | "monthlyCredits"
                  | "slug"
                  | "name"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "member";
              update: {
                createdAt?: number;
                organizationId?: Id<"organization">;
                role?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "role"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "invitation";
              update: {
                email?: string;
                expiresAt?: number;
                inviterId?: Id<"user">;
                organizationId?: Id<"organization">;
                role?: null | string;
                status?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "role"
                  | "expiresAt"
                  | "email"
                  | "status"
                  | "organizationId"
                  | "inviterId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "jwks";
              update: {
                createdAt?: number;
                privateKey?: string;
                publicKey?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "publicKey" | "privateKey" | "createdAt" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "user";
              update: {
                banExpires?: null | number;
                banReason?: null | string;
                banned?: null | boolean;
                bio?: null | string;
                createdAt?: number;
                customerId?: string;
                deletedAt?: number;
                email?: string;
                emailVerified?: boolean;
                firstName?: null | string;
                github?: null | string;
                image?: null | string;
                lastActiveOrganizationId?: Id<"organization">;
                lastName?: null | string;
                linkedin?: null | string;
                location?: null | string;
                name?: string;
                personalOrganizationId?: Id<"organization">;
                role?: null | string;
                updatedAt?: number;
                username?: null | string;
                website?: null | string;
                x?: null | string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "emailVerified"
                  | "createdAt"
                  | "updatedAt"
                  | "image"
                  | "role"
                  | "banned"
                  | "banReason"
                  | "banExpires"
                  | "bio"
                  | "firstName"
                  | "github"
                  | "lastName"
                  | "linkedin"
                  | "location"
                  | "username"
                  | "website"
                  | "x"
                  | "deletedAt"
                  | "email"
                  | "customerId"
                  | "lastActiveOrganizationId"
                  | "personalOrganizationId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "subscriptions";
              update: {
                amount?: number | null;
                cancelAtPeriodEnd?: boolean;
                checkoutId?: string | null;
                createdAt?: string;
                currency?: string | null;
                currentPeriodEnd?: string | null;
                currentPeriodStart?: string;
                customerCancellationComment?: string | null;
                customerCancellationReason?: string | null;
                endedAt?: string | null;
                metadata?: Record<string, any>;
                modifiedAt?: string | null;
                organizationId?: string;
                priceId?: string;
                productId?: string;
                recurringInterval?: string | null;
                startedAt?: string | null;
                status?: string;
                subscriptionId?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "modifiedAt"
                  | "amount"
                  | "currency"
                  | "recurringInterval"
                  | "status"
                  | "currentPeriodStart"
                  | "currentPeriodEnd"
                  | "cancelAtPeriodEnd"
                  | "startedAt"
                  | "endedAt"
                  | "priceId"
                  | "productId"
                  | "checkoutId"
                  | "metadata"
                  | "customerCancellationReason"
                  | "customerCancellationComment"
                  | "subscriptionId"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todos";
              update: {
                completed?: boolean;
                deletionTime?: number;
                description?: string;
                dueDate?: number;
                priority?: "low" | "medium" | "high";
                projectId?: Id<"projects">;
                title?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "title"
                  | "description"
                  | "completed"
                  | "priority"
                  | "dueDate"
                  | "deletionTime"
                  | "userId"
                  | "projectId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projects";
              update: {
                archived?: boolean;
                description?: string;
                isPublic?: boolean;
                name?: string;
                ownerId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "description"
                  | "isPublic"
                  | "archived"
                  | "ownerId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "tags";
              update: { color?: string; createdBy?: Id<"user">; name?: string };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "color" | "name" | "createdBy" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoComments";
              update: {
                content?: string;
                parentId?: Id<"todoComments">;
                todoId?: Id<"todos">;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "content" | "parentId" | "todoId" | "userId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projectMembers";
              update: { projectId?: Id<"projects">; userId?: Id<"user"> };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "userId" | "projectId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoTags";
              update: { tagId?: Id<"tags">; todoId?: Id<"todos"> };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "todoId" | "tagId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "commentReplies";
              update: {
                parentId?: Id<"todoComments">;
                replyId?: Id<"todoComments">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "parentId" | "replyId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            };
        onUpdateHandle?: string;
        paginationOpts: {
          cursor: string | null;
          endCursor?: string | null;
          id?: number;
          maximumBytesRead?: number;
          maximumRowsRead?: number;
          numItems: number;
        };
      },
      any
    >;
    updateOne: FunctionReference<
      "mutation",
      "internal",
      {
        beforeUpdateHandle?: string;
        input:
          | {
              model: "session";
              update: {
                activeOrganizationId?: null | string;
                createdAt?: number;
                expiresAt?: number;
                impersonatedBy?: null | string;
                ipAddress?: null | string;
                token?: string;
                updatedAt?: number;
                userAgent?: null | string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "expiresAt"
                  | "createdAt"
                  | "updatedAt"
                  | "ipAddress"
                  | "userAgent"
                  | "impersonatedBy"
                  | "activeOrganizationId"
                  | "token"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "account";
              update: {
                accessToken?: null | string;
                accessTokenExpiresAt?: null | number;
                accountId?: string;
                createdAt?: number;
                idToken?: null | string;
                password?: null | string;
                providerId?: string;
                refreshToken?: null | string;
                refreshTokenExpiresAt?: null | number;
                scope?: null | string;
                updatedAt?: number;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "accountId"
                  | "providerId"
                  | "accessToken"
                  | "refreshToken"
                  | "idToken"
                  | "accessTokenExpiresAt"
                  | "refreshTokenExpiresAt"
                  | "scope"
                  | "password"
                  | "createdAt"
                  | "updatedAt"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "verification";
              update: {
                createdAt?: number;
                expiresAt?: number;
                identifier?: string;
                updatedAt?: number;
                value?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "value"
                  | "createdAt"
                  | "updatedAt"
                  | "identifier"
                  | "expiresAt"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "organization";
              update: {
                createdAt?: number;
                logo?: null | string;
                metadata?: null | string;
                monthlyCredits?: number;
                name?: string;
                slug?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "logo"
                  | "createdAt"
                  | "metadata"
                  | "monthlyCredits"
                  | "slug"
                  | "name"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "member";
              update: {
                createdAt?: number;
                organizationId?: Id<"organization">;
                role?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "role"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "invitation";
              update: {
                email?: string;
                expiresAt?: number;
                inviterId?: Id<"user">;
                organizationId?: Id<"organization">;
                role?: null | string;
                status?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "role"
                  | "expiresAt"
                  | "email"
                  | "status"
                  | "organizationId"
                  | "inviterId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "jwks";
              update: {
                createdAt?: number;
                privateKey?: string;
                publicKey?: string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "publicKey" | "privateKey" | "createdAt" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "user";
              update: {
                banExpires?: null | number;
                banReason?: null | string;
                banned?: null | boolean;
                bio?: null | string;
                createdAt?: number;
                customerId?: string;
                deletedAt?: number;
                email?: string;
                emailVerified?: boolean;
                firstName?: null | string;
                github?: null | string;
                image?: null | string;
                lastActiveOrganizationId?: Id<"organization">;
                lastName?: null | string;
                linkedin?: null | string;
                location?: null | string;
                name?: string;
                personalOrganizationId?: Id<"organization">;
                role?: null | string;
                updatedAt?: number;
                username?: null | string;
                website?: null | string;
                x?: null | string;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "emailVerified"
                  | "createdAt"
                  | "updatedAt"
                  | "image"
                  | "role"
                  | "banned"
                  | "banReason"
                  | "banExpires"
                  | "bio"
                  | "firstName"
                  | "github"
                  | "lastName"
                  | "linkedin"
                  | "location"
                  | "username"
                  | "website"
                  | "x"
                  | "deletedAt"
                  | "email"
                  | "customerId"
                  | "lastActiveOrganizationId"
                  | "personalOrganizationId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "subscriptions";
              update: {
                amount?: number | null;
                cancelAtPeriodEnd?: boolean;
                checkoutId?: string | null;
                createdAt?: string;
                currency?: string | null;
                currentPeriodEnd?: string | null;
                currentPeriodStart?: string;
                customerCancellationComment?: string | null;
                customerCancellationReason?: string | null;
                endedAt?: string | null;
                metadata?: Record<string, any>;
                modifiedAt?: string | null;
                organizationId?: string;
                priceId?: string;
                productId?: string;
                recurringInterval?: string | null;
                startedAt?: string | null;
                status?: string;
                subscriptionId?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "createdAt"
                  | "modifiedAt"
                  | "amount"
                  | "currency"
                  | "recurringInterval"
                  | "status"
                  | "currentPeriodStart"
                  | "currentPeriodEnd"
                  | "cancelAtPeriodEnd"
                  | "startedAt"
                  | "endedAt"
                  | "priceId"
                  | "productId"
                  | "checkoutId"
                  | "metadata"
                  | "customerCancellationReason"
                  | "customerCancellationComment"
                  | "subscriptionId"
                  | "organizationId"
                  | "userId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todos";
              update: {
                completed?: boolean;
                deletionTime?: number;
                description?: string;
                dueDate?: number;
                priority?: "low" | "medium" | "high";
                projectId?: Id<"projects">;
                title?: string;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "title"
                  | "description"
                  | "completed"
                  | "priority"
                  | "dueDate"
                  | "deletionTime"
                  | "userId"
                  | "projectId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projects";
              update: {
                archived?: boolean;
                description?: string;
                isPublic?: boolean;
                name?: string;
                ownerId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field:
                  | "name"
                  | "description"
                  | "isPublic"
                  | "archived"
                  | "ownerId"
                  | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "tags";
              update: { color?: string; createdBy?: Id<"user">; name?: string };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "color" | "name" | "createdBy" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoComments";
              update: {
                content?: string;
                parentId?: Id<"todoComments">;
                todoId?: Id<"todos">;
                userId?: Id<"user">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "content" | "parentId" | "todoId" | "userId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "projectMembers";
              update: { projectId?: Id<"projects">; userId?: Id<"user"> };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "userId" | "projectId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "todoTags";
              update: { tagId?: Id<"tags">; todoId?: Id<"todos"> };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "todoId" | "tagId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            }
          | {
              model: "commentReplies";
              update: {
                parentId?: Id<"todoComments">;
                replyId?: Id<"todoComments">;
              };
              where?: Array<{
                connector?: "AND" | "OR";
                field: "parentId" | "replyId" | "_id";
                operator?:
                  | "lt"
                  | "lte"
                  | "gt"
                  | "gte"
                  | "eq"
                  | "in"
                  | "not_in"
                  | "ne"
                  | "contains"
                  | "starts_with"
                  | "ends_with";
                value:
                  | string
                  | number
                  | boolean
                  | Array<string>
                  | Array<number>
                  | null;
              }>;
            };
        onUpdateHandle?: string;
      },
      any
    >;
  };
  init: {
    default: FunctionReference<"mutation", "internal", {}, null>;
  };
  reset: {
    deletePage: FunctionReference<
      "mutation",
      "internal",
      { cursor: string | null; tableName: string },
      any
    >;
    getAdminUsers: FunctionReference<
      "query",
      "internal",
      {},
      Array<{ customerId?: string | null }>
    >;
    reset: FunctionReference<"action", "internal", any, any>;
  };
  seed: {
    cleanupSeedData: FunctionReference<"mutation", "internal", {}, null>;
    generateSamplesBatch: FunctionReference<
      "mutation",
      "internal",
      { batchIndex: number; count: number; userId: Id<"user"> },
      { created: number; todosCreated: number }
    >;
    seed: FunctionReference<"mutation", "internal", {}, null>;
    seedUsers: FunctionReference<"mutation", "internal", {}, Array<Id<"user">>>;
  };
  todoComments: {
    cleanupOrphanedComments: FunctionReference<
      "mutation",
      "internal",
      { batchSize?: number },
      { deleted: number; hasMore: boolean }
    >;
  };
  todoInternal: {
    archiveOldCompletedTodos: FunctionReference<
      "mutation",
      "internal",
      { batchSize?: number; daysOld?: number },
      { archived: number; hasMore: boolean }
    >;
    generateWeeklyReport: FunctionReference<
      "action",
      "internal",
      { userId: Id<"user"> },
      {
        insights: Array<string>;
        stats: {
          mostProductiveDay: string | null;
          projectsWorkedOn: number;
          todosCompleted: number;
          todosCreated: number;
        };
        week: { end: number; start: number };
      }
    >;
    getSystemStats: FunctionReference<
      "query",
      "internal",
      {},
      {
        activity: {
          commentsToday: number;
          todosCompletedToday: number;
          todosCreatedToday: number;
        };
        projects: { active: number; public: number; total: number };
        todos: {
          byPriority: Record<string, number>;
          completed: number;
          overdue: number;
          total: number;
        };
        users: { active30d: number; total: number; withTodos: number };
      }
    >;
    getUsersWithOverdueTodos: FunctionReference<
      "query",
      "internal",
      { hoursOverdue?: number; limit?: number },
      Array<{
        email: string;
        name?: string;
        overdueTodos: Array<{
          _id: Id<"todos">;
          daysOverdue: number;
          dueDate: number;
          title: string;
        }>;
        userId: Id<"user">;
      }>
    >;
    getUserWeeklyActivity: FunctionReference<
      "query",
      "internal",
      { userId: Id<"user">; weekStart: number },
      { all: Array<any>; completed: Array<any>; created: Array<any> }
    >;
    processDailySummaries: FunctionReference<
      "action",
      "internal",
      {},
      { failed: number; processed: number; sent: number }
    >;
    recalculateUserStats: FunctionReference<
      "mutation",
      "internal",
      { userId: Id<"user"> },
      { completedTodos: number; streak: number; totalTodos: number }
    >;
    updateOverduePriorities: FunctionReference<
      "mutation",
      "internal",
      { batchSize?: number },
      { hasMore: boolean; updated: number }
    >;
  };
};

export declare const components: {
  rateLimiter: {
    lib: {
      checkRateLimit: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      clearAll: FunctionReference<
        "mutation",
        "internal",
        { before?: number },
        null
      >;
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
      getValue: FunctionReference<
        "query",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          key?: string;
          name: string;
          sampleShards?: number;
        },
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          shard: number;
          ts: number;
          value: number;
        }
      >;
      rateLimit: FunctionReference<
        "mutation",
        "internal",
        {
          config:
            | {
                capacity?: number;
                kind: "token bucket";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: null;
              }
            | {
                capacity?: number;
                kind: "fixed window";
                maxReserved?: number;
                period: number;
                rate: number;
                shards?: number;
                start?: number;
              };
          count?: number;
          key?: string;
          name: string;
          reserve?: boolean;
          throws?: boolean;
        },
        { ok: true; retryAfter?: number } | { ok: false; retryAfter: number }
      >;
      resetRateLimit: FunctionReference<
        "mutation",
        "internal",
        { key?: string; name: string },
        null
      >;
    };
    time: {
      getServerTime: FunctionReference<"mutation", "internal", {}, number>;
    };
  };
  resend: {
    lib: {
      cancelEmail: FunctionReference<
        "mutation",
        "internal",
        { emailId: string },
        null
      >;
      cleanupAbandonedEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      cleanupOldEmails: FunctionReference<
        "mutation",
        "internal",
        { olderThan?: number },
        null
      >;
      createManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          from: string;
          headers?: Array<{ name: string; value: string }>;
          replyTo?: Array<string>;
          subject: string;
          to: Array<string> | string;
        },
        string
      >;
      get: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          bcc?: Array<string>;
          bounced?: boolean;
          cc?: Array<string>;
          clicked?: boolean;
          complained: boolean;
          createdAt: number;
          deliveryDelayed?: boolean;
          errorMessage?: string;
          failed?: boolean;
          finalizedAt: number;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          opened: boolean;
          replyTo: Array<string>;
          resendId?: string;
          segment: number;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
          subject?: string;
          template?: {
            id: string;
            variables?: Record<string, string | number>;
          };
          text?: string;
          to: Array<string>;
        } | null
      >;
      getStatus: FunctionReference<
        "query",
        "internal",
        { emailId: string },
        {
          bounced: boolean;
          clicked: boolean;
          complained: boolean;
          deliveryDelayed: boolean;
          errorMessage: string | null;
          failed: boolean;
          opened: boolean;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        } | null
      >;
      handleEmailEvent: FunctionReference<
        "mutation",
        "internal",
        { event: any },
        null
      >;
      sendEmail: FunctionReference<
        "mutation",
        "internal",
        {
          bcc?: Array<string>;
          cc?: Array<string>;
          from: string;
          headers?: Array<{ name: string; value: string }>;
          html?: string;
          options: {
            apiKey: string;
            initialBackoffMs: number;
            onEmailEvent?: { fnHandle: string };
            retryAttempts: number;
            testMode: boolean;
          };
          replyTo?: Array<string>;
          subject?: string;
          template?: {
            id: string;
            variables?: Record<string, string | number>;
          };
          text?: string;
          to: Array<string>;
        },
        string
      >;
      updateManualEmail: FunctionReference<
        "mutation",
        "internal",
        {
          emailId: string;
          errorMessage?: string;
          resendId?: string;
          status:
            | "waiting"
            | "queued"
            | "cancelled"
            | "sent"
            | "delivered"
            | "delivery_delayed"
            | "bounced"
            | "failed";
        },
        null
      >;
    };
  };
  aggregateUsers: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateTodosByUser: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateTodosByProject: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateTodosByStatus: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateTagUsage: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateProjectMembers: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
  aggregateCommentsByTodo: {
    btree: {
      aggregateBetween: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any },
        { count: number; sum: number }
      >;
      aggregateBetweenBatch: FunctionReference<
        "query",
        "internal",
        { queries: Array<{ k1?: any; k2?: any; namespace?: any }> },
        Array<{ count: number; sum: number }>
      >;
      atNegativeOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffset: FunctionReference<
        "query",
        "internal",
        { k1?: any; k2?: any; namespace?: any; offset: number },
        { k: any; s: number; v: any }
      >;
      atOffsetBatch: FunctionReference<
        "query",
        "internal",
        {
          queries: Array<{
            k1?: any;
            k2?: any;
            namespace?: any;
            offset: number;
          }>;
        },
        Array<{ k: any; s: number; v: any }>
      >;
      get: FunctionReference<
        "query",
        "internal",
        { key: any; namespace?: any },
        null | { k: any; s: number; v: any }
      >;
      offset: FunctionReference<
        "query",
        "internal",
        { k1?: any; key: any; namespace?: any },
        number
      >;
      offsetUntil: FunctionReference<
        "query",
        "internal",
        { k2?: any; key: any; namespace?: any },
        number
      >;
      paginate: FunctionReference<
        "query",
        "internal",
        {
          cursor?: string;
          k1?: any;
          k2?: any;
          limit: number;
          namespace?: any;
          order: "asc" | "desc";
        },
        {
          cursor: string;
          isDone: boolean;
          page: Array<{ k: any; s: number; v: any }>;
        }
      >;
      paginateNamespaces: FunctionReference<
        "query",
        "internal",
        { cursor?: string; limit: number },
        { cursor: string; isDone: boolean; page: Array<any> }
      >;
      validate: FunctionReference<
        "query",
        "internal",
        { namespace?: any },
        any
      >;
    };
    inspect: {
      display: FunctionReference<"query", "internal", { namespace?: any }, any>;
      dump: FunctionReference<"query", "internal", { namespace?: any }, string>;
      inspectNode: FunctionReference<
        "query",
        "internal",
        { namespace?: any; node?: string },
        null
      >;
      listTreeNodes: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          aggregate?: { count: number; sum: number };
          items: Array<{ k: any; s: number; v: any }>;
          subtrees: Array<string>;
        }>
      >;
      listTrees: FunctionReference<
        "query",
        "internal",
        { take?: number },
        Array<{
          _creationTime: number;
          _id: string;
          maxNodeSize: number;
          namespace?: any;
          root: string;
        }>
      >;
    };
    public: {
      clear: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      delete_: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        null
      >;
      deleteIfExists: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any },
        any
      >;
      init: FunctionReference<
        "mutation",
        "internal",
        { maxNodeSize?: number; namespace?: any; rootLazy?: boolean },
        null
      >;
      insert: FunctionReference<
        "mutation",
        "internal",
        { key: any; namespace?: any; summand?: number; value: any },
        null
      >;
      makeRootLazy: FunctionReference<
        "mutation",
        "internal",
        { namespace?: any },
        null
      >;
      replace: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        null
      >;
      replaceOrInsert: FunctionReference<
        "mutation",
        "internal",
        {
          currentKey: any;
          namespace?: any;
          newKey: any;
          newNamespace?: any;
          summand?: number;
          value: any;
        },
        any
      >;
    };
  };
};
