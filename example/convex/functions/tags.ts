import { zid } from 'convex-helpers/server/zod';
import { ConvexError } from 'convex/values';
import { z } from 'zod';
import { authMutation, authQuery } from '../lib/crpc';

// List user's tags with usage count
export const list = authQuery
  .output(
    z.array(
      z.object({
        _id: zid('tags'),
        _creationTime: z.number(),
        name: z.string(),
        color: z.string(),
        usageCount: z.number(),
      })
    )
  )
  .query(async ({ ctx }) => {
    const tags = await ctx
      .table('tags', 'createdBy', (q) => q.eq('createdBy', ctx.userId))
      .order('asc');

    return await Promise.all(
      tags.map(async (tag) => ({
        ...tag.doc(),
        usageCount: (await tag.edge('todos')).length,
      }))
    );
  });

// Create a new tag
export const create = authMutation
  .meta({ rateLimit: 'tag/create' })
  .input(
    z.object({
      name: z.string().min(1).max(50),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .optional(),
    })
  )
  .output(zid('tags'))
  .mutation(async ({ ctx, input }) => {
    // Check if tag with same name already exists for this user
    const existingTag = await ctx
      .table('tags', 'createdBy', (q) => q.eq('createdBy', ctx.userId))
      .filter((q) => q.eq(q.field('name'), input.name))
      .first();

    if (existingTag) {
      throw new ConvexError({
        code: 'DUPLICATE_TAG',
        message: 'A tag with this name already exists',
      });
    }

    const tagId = await ctx.table('tags').insert({
      name: input.name,
      color: input.color || generateRandomColor(),
      createdBy: ctx.userId,
    });

    return tagId;
  });

// Update tag name or color
export const update = authMutation
  .meta({ rateLimit: 'tag/update' })
  .input(
    z.object({
      tagId: zid('tags'),
      name: z.string().min(1).max(50).optional(),
      color: z
        .string()
        .regex(/^#[0-9A-F]{6}$/i)
        .optional(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const tag = await ctx.table('tags').getX(input.tagId);

    if (tag.createdBy !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Tag not found',
      });
    }

    // Check for duplicate name if updating name
    if (input.name && input.name !== tag.name) {
      const existingTag = await ctx
        .table('tags', 'createdBy', (q) => q.eq('createdBy', ctx.userId))
        .filter((q) => q.eq(q.field('name'), input.name))
        .first();

      if (existingTag) {
        throw new ConvexError({
          code: 'DUPLICATE_TAG',
          message: 'A tag with this name already exists',
        });
      }
    }

    const updates: any = {};
    if (input.name !== undefined) {
      updates.name = input.name;
    }
    if (input.color !== undefined) {
      updates.color = input.color;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.table('tags').getX(input.tagId).patch(updates);
    }

    return null;
  });

// Delete a tag (removes from all todos)
export const deleteTag = authMutation
  .meta({ rateLimit: 'tag/delete' })
  .input(
    z.object({
      tagId: zid('tags'),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const tag = await ctx.table('tags').getX(input.tagId);

    if (tag.createdBy !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Tag not found',
      });
    }

    // Delete the tag - Convex Ents will handle removing from todos automatically
    await ctx.table('tags').getX(input.tagId).delete();

    return null;
  });

// Merge two tags
export const merge = authMutation
  .meta({ rateLimit: 'tag/update' })
  .input(
    z.object({
      sourceTagId: zid('tags'),
      targetTagId: zid('tags'),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    if (input.sourceTagId === input.targetTagId) {
      throw new ConvexError({
        code: 'INVALID_OPERATION',
        message: 'Cannot merge a tag with itself',
      });
    }

    const sourceTag = await ctx.table('tags').getX(input.sourceTagId);
    const targetTag = await ctx.table('tags').getX(input.targetTagId);

    if (sourceTag.createdBy !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Source tag not found',
      });
    }

    if (targetTag.createdBy !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Target tag not found',
      });
    }

    // Get all todos with source tag
    const todosWithSourceTag = await sourceTag.edge('todos');

    // Add target tag to todos that have source tag (avoiding duplicates)
    for (const todo of todosWithSourceTag) {
      const currentTags = await todo.edge('tags').map((t) => t._id);
      if (!currentTags.includes(input.targetTagId)) {
        await ctx
          .table('todos')
          .getX(todo._id)
          .patch({
            tags: { add: [input.targetTagId] },
          });
      }
    }

    // Delete source tag
    await ctx.table('tags').getX(input.sourceTagId).delete();

    return null;
  });

// Get most popular tags across all users
export const popular = authQuery
  .input(
    z.object({
      limit: z.number().min(1).max(50).optional(),
    })
  )
  .output(
    z.array(
      z.object({
        _id: zid('tags'),
        name: z.string(),
        color: z.string(),
        usageCount: z.number(),
        isOwn: z.boolean(),
      })
    )
  )
  .query(async ({ ctx, input }) => {
    const limit = input.limit || 10;

    // Get all tags with usage counts
    const allTags = await ctx.table('tags').take(100);

    const tagsWithCounts = await Promise.all(
      allTags.map(async (tag) => ({
        ...tag.doc(),
        usageCount: (await tag.edge('todos')).length,
        isOwn: tag.createdBy === ctx.userId,
      }))
    );

    // Sort by usage count and return top N
    return tagsWithCounts
      .sort((a, b) => b.usageCount - a.usageCount)
      .slice(0, limit);
  });

// Helper function to generate random hex color
function generateRandomColor(): string {
  const colors = [
    '#EF4444', // red
    '#F59E0B', // amber
    '#10B981', // emerald
    '#3B82F6', // blue
    '#8B5CF6', // violet
    '#EC4899', // pink
    '#14B8A6', // teal
    '#F97316', // orange
    '#6366F1', // indigo
    '#84CC16', // lime
  ];
  return colors[Math.floor(Math.random() * colors.length)];
}
