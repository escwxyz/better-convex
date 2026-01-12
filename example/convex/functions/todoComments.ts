import { ConvexError } from 'convex/values';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';

import type { Id } from './_generated/dataModel';
import {
  authMutation,
  optionalAuthQuery,
  privateMutation,
  publicQuery,
} from '../lib/crpc';

// Schema for comment list items
const CommentListItemSchema = z.object({
  _id: zid('todoComments'),
  content: z.string(),
  createdAt: z.number(),
  user: z
    .object({
      _id: zid('user'),
      name: z.string().optional(),
      image: z.string().nullish(),
    })
    .nullable(),
  replies: z.array(z.any()),
  replyCount: z.number(),
});

// ============================================
// COMMENT QUERIES
// ============================================

// Get comments for a todo with nested replies
export const getTodoComments = optionalAuthQuery
  .input(
    z.object({
      todoId: zid('todos'),
      includeReplies: z.boolean().default(true),
      maxReplyDepth: z.number().min(0).max(5).default(3),
    })
  )
  .paginated({ limit: 20, item: CommentListItemSchema })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };

    const todo = await ctx.table('todos').get(input.todoId);
    if (!todo) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    // Get top-level comments (no parent)
    return await ctx
      .table('todoComments')
      .filter((q) => q.eq(q.field('todoId'), input.todoId))
      .filter((q) => q.eq(q.field('parentId'), undefined))
      .order('desc')
      .paginate(paginationOpts)
      .map(async (comment) => {
        // Get user info
        const user = await comment.edge('user');

        // Get replies if requested
        let replies: any[] = [];
        if (input.includeReplies) {
          replies = await getNestedReplies(
            ctx,
            comment._id,
            0,
            input.maxReplyDepth
          );
        }

        return {
          _id: comment._id,
          content: comment.content,
          createdAt: comment._creationTime,
          user: user
            ? {
                _id: user._id,
                name: user.name,
                image: user.image,
              }
            : null,
          replies,
          replyCount: (await comment.edge('replies')).length,
        };
      });
  });

// Helper to get nested replies recursively
async function getNestedReplies(
  ctx: any,
  parentId: Id<'todoComments'>,
  currentDepth: number,
  maxDepth: number
): Promise<any[]> {
  if (currentDepth >= maxDepth) {
    return [];
  }

  const parent = await ctx.table('todoComments').get(parentId);
  if (!parent) {
    return [];
  }

  const replies = await parent.edge('replies').order('asc').take(10);

  return await Promise.all(
    replies.map(async (reply: any) => {
      const user = await reply.edge('user');
      const nestedReplies = await getNestedReplies(
        ctx,
        reply._id,
        currentDepth + 1,
        maxDepth
      );

      return {
        _id: reply._id,
        content: reply.content,
        createdAt: reply._creationTime,
        user: user
          ? {
              _id: user._id,
              name: user.name,
              image: user.image,
            }
          : null,
        replies: nestedReplies,
        replyCount: (await reply.edge('replies')).length,
      };
    })
  );
}

// Get single comment thread
export const getCommentThread = publicQuery
  .input(
    z.object({
      commentId: zid('todoComments'),
      maxDepth: z.number().min(0).max(10).default(10),
    })
  )
  .output(
    z
      .object({
        comment: z.object({
          _id: zid('todoComments'),
          content: z.string(),
          createdAt: z.number(),
          todoId: zid('todos'),
          todo: z.object({
            title: z.string(),
            completed: z.boolean(),
          }),
          user: z
            .object({
              _id: zid('user'),
              name: z.string().optional(),
              image: z.string().nullish(),
            })
            .nullable(),
          parent: z
            .object({
              _id: zid('todoComments'),
              content: z.string(),
              user: z
                .object({
                  name: z.string().optional(),
                })
                .nullable(),
            })
            .nullable(),
          replies: z.array(z.any()),
          ancestors: z.array(
            z.object({
              _id: zid('todoComments'),
              content: z.string(),
              user: z
                .object({
                  name: z.string().optional(),
                })
                .nullable(),
            })
          ),
        }),
      })
      .nullable()
  )
  .query(async ({ ctx, input }) => {
    const comment = await ctx.table('todoComments').get(input.commentId);
    if (!comment) {
      return null;
    }

    // Get related data
    const [user, todo, parentId, replies] = await Promise.all([
      comment.edge('user'),
      comment.edgeX('todo'),
      Promise.resolve(comment.parentId),
      getNestedReplies(ctx, comment._id, 0, input.maxDepth),
    ]);

    // Get parent if exists
    const parent = parentId
      ? await ctx.table('todoComments').get(parentId)
      : null;

    // Get ancestors (for context)
    const ancestors: any[] = [];
    let currentParentId = parentId;
    while (currentParentId && ancestors.length < 5) {
      const currentParent = await ctx
        .table('todoComments')
        .get(currentParentId);
      if (!currentParent) {
        break;
      }

      const parentUser = await currentParent.edge('user');
      ancestors.unshift({
        _id: currentParent._id,
        content: currentParent.content,
        user: parentUser ? { name: parentUser.name } : null,
      });
      currentParentId = currentParent.parentId;
    }

    return {
      comment: {
        _id: comment._id,
        content: comment.content,
        createdAt: comment._creationTime,
        todoId: comment.todoId,
        todo: {
          title: todo.title,
          completed: todo.completed,
        },
        user: user
          ? {
              _id: user._id,
              name: user.name,
              image: user.image,
            }
          : null,
        parent: parent
          ? {
              _id: parent._id,
              content: parent.content,
              user: (await parent.edge('user'))?.name
                ? { name: (await parent.edge('user'))?.name }
                : null,
            }
          : null,
        replies,
        ancestors,
      },
    };
  });

// Schema for user comments
const UserCommentSchema = z.object({
  _id: zid('todoComments'),
  content: z.string(),
  createdAt: z.number(),
  isReply: z.boolean(),
  todo: z
    .object({
      _id: zid('todos'),
      title: z.string(),
      completed: z.boolean(),
    })
    .nullable()
    .optional(),
  parentPreview: z
    .object({
      content: z.string(),
      userName: z.string().optional(),
    })
    .optional(),
});

// Get user's recent comments
export const getUserComments = optionalAuthQuery
  .input(
    z.object({
      userId: zid('user'),
      includeTodo: z.boolean().default(true),
    })
  )
  .paginated({ limit: 20, item: UserCommentSchema })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };

    return await ctx
      .table('todoComments')
      .filter((q) => q.eq(q.field('userId'), input.userId))
      .order('desc')
      .paginate(paginationOpts)
      .map(async (comment) => {
        const result: any = {
          _id: comment._id,
          content: comment.content,
          createdAt: comment._creationTime,
          isReply: comment.parentId !== undefined,
        };

        if (input.includeTodo) {
          const todo = await comment.edge('todo');
          result.todo = todo
            ? {
                _id: todo._id,
                title: todo.title,
                completed: todo.completed,
              }
            : null;
        }

        // Include parent preview if it's a reply
        if (comment.parentId) {
          const parent = await ctx.table('todoComments').get(comment.parentId);
          if (parent) {
            const parentUser = await parent.edge('user');
            result.parentPreview = {
              content:
                parent.content.slice(0, 100) +
                (parent.content.length > 100 ? '...' : ''),
              userName: parentUser?.name,
            };
          }
        }

        return result;
      });
  });

// ============================================
// COMMENT MUTATIONS
// ============================================

// Add comment to todo
export const addComment = authMutation
  .meta({ rateLimit: 'todoComment/create' })
  .input(
    z.object({
      todoId: zid('todos'),
      content: z.string().min(1).max(1000),
      parentId: zid('todoComments').optional(),
    })
  )
  .output(zid('todoComments'))
  .mutation(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').getX(input.todoId);

    // Check access (todo must be public, owned by user, or user is project member)
    const hasAccess = await checkTodoAccess(ctx, todo);
    if (!hasAccess) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'No access to this todo',
      });
    }

    // Validate parent if provided
    if (input.parentId) {
      const parent = await ctx.table('todoComments').get(input.parentId);
      if (!parent || parent.todoId !== input.todoId) {
        throw new ConvexError({
          code: 'BAD_REQUEST',
          message: 'Invalid parent comment',
        });
      }

      // Check reply depth limit
      const depth = await getCommentDepth(ctx, input.parentId);
      if (depth >= 5) {
        throw new ConvexError({
          code: 'BAD_REQUEST',
          message: 'Maximum reply depth reached',
        });
      }
    }

    return await ctx.table('todoComments').insert({
      content: input.content,
      todoId: input.todoId,
      userId: ctx.userId,
      parentId: input.parentId,
    });
  });

// Update comment
export const updateComment = authMutation
  .meta({ rateLimit: 'todoComment/update' })
  .input(
    z.object({
      commentId: zid('todoComments'),
      content: z.string().min(1).max(1000),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const comment = await ctx.table('todoComments').getX(input.commentId);

    // Only author can update
    if (comment.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only comment author can update',
      });
    }

    // Don't allow editing after 1 hour
    const hourAgo = Date.now() - 60 * 60 * 1000;
    if (comment._creationTime < hourAgo) {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'Cannot edit comments older than 1 hour',
      });
    }

    await comment.patch({ content: input.content });
    return null;
  });

// Delete comment
export const deleteComment = authMutation
  .meta({ rateLimit: 'todoComment/update' }) // Using update rate limit for delete
  .input(z.object({ commentId: zid('todoComments') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const comment = await ctx.table('todoComments').getX(input.commentId);

    // Author or todo owner can delete
    const todo = await comment.edgeX('todo');
    if (comment.userId !== ctx.userId && todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Insufficient permissions',
      });
    }

    // If has replies, just mark as deleted
    const hasReplies = (await comment.edge('replies').first()) !== null;
    if (hasReplies) {
      await comment.patch({
        content: '[deleted]',
        // Could add a deletedAt field in schema for soft delete
      });
    } else {
      await ctx.table('todoComments').getX(comment._id).delete();
    }

    return null;
  });

// ============================================
// COMMENT REACTIONS (BONUS)
// ============================================

// React to comment
export const toggleReaction = authMutation
  .meta({ rateLimit: 'todoComment/reaction' })
  .input(
    z.object({
      commentId: zid('todoComments'),
      emoji: z.enum(['👍', '❤️', '😂', '🎉', '😕', '👎']),
    })
  )
  .output(
    z.object({
      added: z.boolean(),
      counts: z.record(z.string(), z.number()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    const _comment = await ctx.table('todoComments').getX(input.commentId);

    // Store reactions in a simple format (could be a separate table)
    // For demo, we'll use a map stored on the comment
    // In production, use a separate reactions table

    // This is a simplified example - in real app, create a reactions table
    throw new ConvexError({
      code: 'NOT_IMPLEMENTED',
      message: 'Reactions require a separate table - see schema design',
    });
  });

// ============================================
// INTERNAL FUNCTIONS
// ============================================

// Clean up orphaned comments
export const cleanupOrphanedComments = privateMutation
  .input(z.object({ batchSize: z.number().default(100) }))
  .output(
    z.object({
      deleted: z.number(),
      hasMore: z.boolean(),
    })
  )
  .mutation(async ({ ctx, input }) => {
    // Find comments where todo was deleted
    const comments = await ctx.table('todoComments').take(input.batchSize);

    let deleted = 0;
    for (const comment of comments) {
      const todo = await comment.edge('todo');
      if (!todo) {
        await ctx.table('todoComments').getX(comment._id).delete();
        deleted++;
      }
    }

    return {
      deleted,
      hasMore: comments.length === input.batchSize,
    };
  });

// ============================================
// HELPER FUNCTIONS
// ============================================

// Check if user has access to todo
async function checkTodoAccess(ctx: any, todo: any): Promise<boolean> {
  // Owner always has access
  if (todo.userId === ctx.userId) {
    return true;
  }

  // Check if todo is in a public project
  if (todo.projectId) {
    const project = await todo.edge('project');
    if (project?.isPublic) {
      return true;
    }

    // Check if user is project member
    if (project) {
      const isMember = await project.edge('member').has(ctx.userId);
      if (isMember || project.ownerId === ctx.userId) {
        return true;
      }
    }
  }

  return false;
}

// Get comment depth in thread
async function getCommentDepth(
  ctx: any,
  commentId: Id<'todoComments'>
): Promise<number> {
  let depth = 0;
  let current = await ctx.table('todoComments').get(commentId);

  while (current?.parentId && depth < 10) {
    depth++;
    current = await ctx.table('todoComments').get(current.parentId);
  }

  return depth;
}
