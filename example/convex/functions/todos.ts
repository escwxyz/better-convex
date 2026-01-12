import { ConvexError } from 'convex/values';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';
import { authMutation, authQuery, optionalAuthQuery } from '../lib/crpc';

// Schema for todo list items
const TodoListItemSchema = z.object({
  _id: zid('todos'),
  _creationTime: z.number(),
  userId: zid('user'),
  title: z.string(),
  description: z.string().optional(),
  completed: z.boolean(),
  priority: z.enum(['low', 'medium', 'high']).optional(),
  dueDate: z.number().optional(),
  projectId: zid('projects').optional(),
  deletionTime: z.number().optional(),
  tags: z.array(
    z.object({
      _id: zid('tags'),
      _creationTime: z.number(),
      name: z.string(),
      color: z.string(),
      createdBy: zid('user'),
    })
  ),
  project: z
    .object({
      _id: zid('projects'),
      _creationTime: z.number(),
      name: z.string(),
      description: z.string().optional(),
      isPublic: z.boolean(),
      archived: z.boolean(),
      ownerId: zid('user'),
    })
    .nullable(),
});

// List todos - shows user's todos when authenticated, public project todos when not
export const list = optionalAuthQuery
  .input(
    z.object({
      completed: z.boolean().optional(),
      projectId: zid('projects').optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
    })
  )
  .paginated({ limit: 20, item: TodoListItemSchema })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };

    // If projectId is specified, check if it's a public project
    if (input.projectId) {
      const project = await ctx.table('projects').getX(input.projectId);

      // Check access
      if (!project.isPublic) {
        if (!ctx.userId) {
          throw new ConvexError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }

        // Check if user is owner or member
        const isOwner = project.ownerId === ctx.userId;
        const isMember = await ctx
          .table('projectMembers', 'projectId_userId', (q) =>
            q.eq('projectId', input.projectId!).eq('userId', ctx.userId!)
          )
          .first();

        if (!(isOwner || isMember)) {
          throw new ConvexError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }
      }

      // For public projects or authorized users, show all project todos
      let query = ctx.table('todos', 'projectId', (q) =>
        q.eq('projectId', input.projectId)
      );

      // Apply filters
      if (input.completed !== undefined) {
        query = query.filter((q) =>
          q.eq(q.field('completed'), input.completed!)
        );
      }

      if (input.priority !== undefined) {
        query = query.filter((q) => q.eq(q.field('priority'), input.priority!));
      }

      // Order by creation time (newest first) and paginate
      return await query
        .order('desc')
        .paginate(paginationOpts)
        .map(async (todo) => ({
          ...todo.doc(),
          tags: await todo.edge('tags').map((tag) => tag.doc()),
          project: await ctx.table('projects').get(todo.projectId!),
        }));
    }

    // No projectId specified - show user's todos only (must be authenticated)
    if (!ctx.userId) {
      // Return empty paginated result using a filter that matches nothing
      return await ctx
        .table('todos')
        .filter((q) => q.eq(q.field('userId'), 'impossible-user-id' as any))
        .paginate(paginationOpts)
        .map(async (todo) => ({
          ...todo.doc(),
          tags: await todo.edge('tags').map((tag) => tag.doc()),
          project: null,
        }));
    }

    // Start with user's todos
    let query = ctx.table('todos', 'userId', (q) =>
      q.eq('userId', ctx.userId!)
    );

    // Apply completed filter if specified
    if (input.completed !== undefined) {
      query = query.filter((q) => q.eq(q.field('completed'), input.completed!));
    }

    // Apply priority filter if specified
    if (input.priority !== undefined) {
      query = query.filter((q) => q.eq(q.field('priority'), input.priority!));
    }

    // Order by creation time (newest first) and paginate
    return await query
      .order('desc')
      .paginate(paginationOpts)
      .map(async (todo) => ({
        ...todo.doc(),
        tags: await todo.edge('tags').map((tag) => tag.doc()),
        project: todo.projectId
          ? await ctx.table('projects').get(todo.projectId)
          : null,
      }));
  });

// Search todos - works for public projects when not authenticated
export const search = optionalAuthQuery
  .input(
    z.object({
      query: z.string().min(1),
      completed: z.boolean().optional(),
      projectId: zid('projects').optional(),
    })
  )
  .paginated({ limit: 20, item: TodoListItemSchema })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };

    // If projectId is specified, check if it's a public project
    if (input.projectId) {
      const project = await ctx.table('projects').getX(input.projectId);

      // Check access
      if (!project.isPublic) {
        if (!ctx.userId) {
          throw new ConvexError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }

        // Check if user is owner or member
        const isOwner = project.ownerId === ctx.userId;
        const isMember = await ctx
          .table('projectMembers', 'projectId_userId', (q) =>
            q.eq('projectId', input.projectId!).eq('userId', ctx.userId!)
          )
          .first();

        if (!(isOwner || isMember)) {
          throw new ConvexError({
            code: 'FORBIDDEN',
            message: 'You do not have access to this project',
          });
        }
      }

      // Search within the project
      return await ctx
        .table('todos')
        .search('search_title_description', (q) => {
          let searchQuery = q
            .search('title', input.query)
            .eq('projectId', input.projectId);

          if (input.completed !== undefined) {
            searchQuery = searchQuery.eq('completed', input.completed);
          }

          return searchQuery;
        })
        .paginate(paginationOpts)
        .map(async (todo) => ({
          ...todo.doc(),
          tags: await todo.edge('tags').map((tag) => tag.doc()),
          project: await ctx.table('projects').get(todo.projectId!),
        }));
    }

    // No projectId - search user's todos only (must be authenticated)
    if (!ctx.userId) {
      throw new ConvexError({
        code: 'UNAUTHENTICATED',
        message: 'You must be logged in to search your todos',
      });
    }

    return await ctx
      .table('todos')
      .search('search_title_description', (q) => {
        let searchQuery = q
          .search('title', input.query)
          .eq('userId', ctx.userId!);

        if (input.completed !== undefined) {
          searchQuery = searchQuery.eq('completed', input.completed);
        }

        return searchQuery;
      })
      .paginate(paginationOpts)
      .map(async (todo) => ({
        ...todo.doc(),
        tags: await todo.edge('tags').map((tag) => tag.doc()),
        project: todo.projectId
          ? await ctx.table('projects').get(todo.projectId)
          : null,
      }));
  });

// Get a single todo with all relations
export const get = authQuery
  .input(z.object({ id: zid('todos') }))
  .output(
    z
      .object({
        _id: zid('todos'),
        _creationTime: z.number(),
        userId: zid('user'),
        title: z.string(),
        description: z.string().optional(),
        completed: z.boolean(),
        priority: z.enum(['low', 'medium', 'high']).optional(),
        dueDate: z.number().optional(),
        projectId: zid('projects').optional(),
        deletionTime: z.number().optional(),
        tags: z.array(
          z.object({
            _id: zid('tags'),
            _creationTime: z.number(),
            name: z.string(),
            color: z.string(),
            createdBy: zid('user'),
          })
        ),
        project: z
          .object({
            _id: zid('projects'),
            _creationTime: z.number(),
            name: z.string(),
            description: z.string().optional(),
            isPublic: z.boolean(),
            archived: z.boolean(),
            ownerId: zid('user'),
          })
          .nullable(),
        user: z.object({
          _id: zid('user'),
          _creationTime: z.number(),
          name: z.string().optional(),
          email: z.string(),
          image: z.string().nullish(),
        }),
      })
      .nullable()
  )
  .query(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').get(input.id);

    if (!todo || todo.userId !== ctx.userId) {
      return null;
    }

    return {
      ...todo.doc(),
      tags: await todo.edge('tags').map((tag) => tag.doc()),
      project: todo.projectId
        ? await ctx.table('projects').get(todo.projectId)
        : null,
      user: (await todo.edge('user'))?.doc(),
    };
  });

// Create a new todo
export const create = authMutation
  .meta({ rateLimit: 'todo/create' })
  .input(
    z.object({
      title: z.string().min(1).max(200),
      description: z.string().max(1000).optional(),
      priority: z.enum(['low', 'medium', 'high']).optional(),
      dueDate: z.number().optional(),
      projectId: zid('projects').optional(),
      tagIds: z.array(zid('tags')).max(10).optional(),
    })
  )
  .output(zid('todos'))
  .mutation(async ({ ctx, input }) => {
    // Validate project access if provided
    if (input.projectId) {
      const project = await ctx.table('projects').getX(input.projectId);

      // Check if user is owner or member
      const isOwner = project.ownerId === ctx.userId;
      const isMember = await project.edge('members').has(ctx.userId);

      if (!(isOwner || isMember)) {
        throw new ConvexError({
          code: 'FORBIDDEN',
          message: "You don't have access to this project",
        });
      }
    }

    // Validate tags if provided
    if (input.tagIds && input.tagIds.length > 0) {
      const tags = await ctx.table('tags').getMany(input.tagIds);
      const validTags = tags.filter(
        (tag) => tag && tag.createdBy === ctx.userId
      );

      if (validTags.length !== input.tagIds.length) {
        throw new ConvexError({
          code: 'INVALID_TAGS',
          message: "Some tags are invalid or don't belong to you",
        });
      }
    }

    // Create the todo
    const todoId = await ctx.table('todos').insert({
      title: input.title,
      description: input.description,
      completed: false,
      priority: input.priority,
      dueDate: input.dueDate,
      projectId: input.projectId,
      userId: ctx.userId,
      tags: input.tagIds || [],
    });

    return todoId;
  });

// Update a todo
export const update = authMutation
  .meta({ rateLimit: 'todo/update' })
  .input(
    z.object({
      id: zid('todos'),
      title: z.string().min(1).max(200).optional(),
      description: z.string().max(1000).optional(),
      priority: z.enum(['low', 'medium', 'high']).nullable().optional(),
      dueDate: z.number().nullable().optional(),
      projectId: zid('projects').nullable().optional(),
      tagIds: z.array(zid('tags')).max(10).optional(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').getX(input.id);

    if (todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    // Build update object
    const updates: any = {};

    if (input.title !== undefined) {
      updates.title = input.title;
    }
    if (input.description !== undefined) {
      updates.description = input.description;
    }
    if (input.priority !== undefined) {
      updates.priority = input.priority || undefined;
    }
    if (input.dueDate !== undefined) {
      updates.dueDate = input.dueDate || undefined;
    }

    // Handle project update
    if (input.projectId !== undefined) {
      if (input.projectId) {
        const project = await ctx.table('projects').getX(input.projectId);

        const isOwner = project.ownerId === ctx.userId;
        const isMember = await project.edge('members').has(ctx.userId);

        if (!(isOwner || isMember)) {
          throw new ConvexError({
            code: 'FORBIDDEN',
            message: "You don't have access to this project",
          });
        }
        updates.projectId = input.projectId;
      } else {
        updates.projectId = undefined;
      }
    }

    // Handle tag updates
    if (input.tagIds !== undefined) {
      if (input.tagIds.length > 0) {
        const tags = await ctx.table('tags').getMany(input.tagIds);
        const validTags = tags.filter(
          (tag) => tag && tag.createdBy === ctx.userId
        );

        if (validTags.length !== input.tagIds.length) {
          throw new ConvexError({
            code: 'INVALID_TAGS',
            message: "Some tags are invalid or don't belong to you",
          });
        }
      }
      updates.tags = input.tagIds;
    }

    // Apply updates
    await todo.patch(updates);

    return null;
  });

// Toggle todo completion status
export const toggleComplete = authMutation
  .meta({ rateLimit: 'todo/update' })
  .input(z.object({ id: zid('todos') }))
  .output(z.boolean())
  .mutation(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').getX(input.id);

    if (todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    const newStatus = !todo.completed;
    await todo.patch({ completed: newStatus });

    return newStatus;
  });

// Soft delete a todo
export const deleteTodo = authMutation
  .meta({ rateLimit: 'todo/delete' })
  .input(z.object({ id: zid('todos') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').getX(input.id);

    if (todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    // Soft delete sets deletionTime
    await todo.delete();

    return null;
  });

// Restore a soft-deleted todo
export const restore = authMutation
  .meta({ rateLimit: 'todo/update' })
  .input(z.object({ id: zid('todos') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const todo = await ctx.table('todos').getX(input.id);

    if (todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    if (!todo.deletionTime) {
      throw new ConvexError({
        code: 'INVALID_STATE',
        message: 'Todo is not deleted',
      });
    }

    // Restore by removing deletionTime
    await todo.patch({ deletionTime: undefined });

    return null;
  });

// Bulk delete todos
export const bulkDelete = authMutation
  .meta({ rateLimit: 'todo/delete' })
  .input(z.object({ ids: z.array(zid('todos')).min(1).max(100) }))
  .output(
    z.object({
      deleted: z.number(),
      errors: z.array(z.string()),
    })
  )
  .mutation(async ({ ctx, input }) => {
    let deleted = 0;
    const errors: string[] = [];

    for (const id of input.ids) {
      try {
        const todo = await ctx.table('todos').get(id);

        if (todo && todo.userId === ctx.userId) {
          await todo.delete();
          deleted++;
        } else {
          errors.push(`Todo ${id} not found or unauthorized`);
        }
      } catch (_error) {
        errors.push(`Failed to delete todo ${id}`);
      }
    }

    return { deleted, errors };
  });

// Reorder todos (for drag-and-drop support)
export const reorder = authMutation
  .meta({ rateLimit: 'todo/update' })
  .input(
    z.object({
      todoId: zid('todos'),
      targetIndex: z.number().min(0),
      projectId: zid('projects').optional(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    // This is a placeholder for reordering logic
    // In a real implementation, you would:
    // 1. Add an "order" field to the schema
    // 2. Update the order of todos within the same project/list
    // 3. Ensure consistent ordering

    const todo = await ctx.table('todos').getX(input.todoId);

    if (todo.userId !== ctx.userId) {
      throw new ConvexError({
        code: 'NOT_FOUND',
        message: 'Todo not found',
      });
    }

    // For now, just validate the todo exists and belongs to the user
    // Real implementation would update order fields

    return null;
  });
