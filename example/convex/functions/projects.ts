import { ConvexError } from 'convex/values';
import { asyncMap } from 'convex-helpers';
import { stream } from 'convex-helpers/server/stream';
import { zid } from 'convex-helpers/server/zod4';
import { z } from 'zod';
import {
  authMutation,
  authQuery,
  optionalAuthQuery,
  publicQuery,
} from '../lib/crpc';
import { aggregateTodosByProject } from './aggregates';
import schema from './schema';

// Schema for project list items
const ProjectListItemSchema = z.object({
  _id: zid('projects'),
  _creationTime: z.number(),
  name: z.string(),
  description: z.string().optional(),
  ownerId: zid('user'),
  isPublic: z.boolean(),
  archived: z.boolean(),
  memberCount: z.number(),
  todoCount: z.number(),
  completedTodoCount: z.number(),
  isOwner: z.boolean(),
});

// List projects - shows user's projects when authenticated, public projects when not
export const list = optionalAuthQuery
  .input(
    z.object({
      includeArchived: z.boolean().optional(),
    })
  )
  .paginated({ limit: 20, item: ProjectListItemSchema })
  .query(async ({ ctx, input }) => {
    const paginationOpts = { cursor: input.cursor, numItems: input.limit };
    const userId = ctx.userId;

    // If not authenticated, show only public non-archived projects
    if (!userId) {
      const results = await stream(ctx.db, schema)
        .query('projects')
        .filterWith(async (project) => {
          // Only show public projects when not authenticated
          if (!project.isPublic) {
            return false;
          }

          // Apply archive filter (archived projects are never shown publicly)
          return !project.archived;
        })
        .paginate(paginationOpts);

      // Transform results with public data
      return {
        ...results,
        page: await asyncMap(results.page, async (project) => ({
          ...project,
          memberCount: (
            await ctx.table('projectMembers', 'projectId', (q) =>
              q.eq('projectId', project._id)
            )
          ).length,
          todoCount: await aggregateTodosByProject.count(ctx, {
            namespace: project._id,
            bounds: {},
          }),
          completedTodoCount: (
            await ctx
              .table('todos', 'projectId', (q) =>
                q.eq('projectId', project._id)
              )
              .filter((q) => q.eq(q.field('completed'), true))
          ).length,
          isOwner: false,
        })),
      };
    }

    // Get member project IDs for authenticated user
    const memberProjectIds = await ctx
      .table('projectMembers', 'userId', (q) => q.eq('userId', userId))
      .map(async (member) => member.projectId);

    // Use streams to filter and paginate all projects
    const results = await stream(ctx.db, schema)
      .query('projects')
      .filterWith(async (project) => {
        // Include if user is owner or member
        const isOwner = project.ownerId === userId;
        const isMember = memberProjectIds.includes(project._id);

        if (!(isOwner || isMember)) {
          return false;
        }

        // Apply archive filter
        if (input.includeArchived) {
          // When includeArchived is true, show ONLY archived projects
          return project.archived;
        }
        // When includeArchived is false/undefined, show ONLY non-archived projects
        return !project.archived;
      })
      .paginate(paginationOpts);

    // Transform results with additional data
    return {
      ...results,
      page: await asyncMap(results.page, async (project) => ({
        ...project,
        memberCount: (
          await ctx.table('projectMembers', 'projectId', (q) =>
            q.eq('projectId', project._id)
          )
        ).length,
        todoCount: await aggregateTodosByProject.count(ctx, {
          namespace: project._id,
          bounds: {},
        }),
        completedTodoCount: (
          await ctx
            .table('todos', 'projectId', (q) => q.eq('projectId', project._id))
            .filter((q) => q.eq(q.field('completed'), true))
        ).length,
        isOwner: project.ownerId === userId,
      })),
    };
  });

// Get project with members and todo count - public projects viewable by all
export const get = publicQuery
  .input(z.object({ projectId: zid('projects') }))
  .output(
    z
      .object({
        _id: zid('projects'),
        _creationTime: z.number(),
        name: z.string(),
        description: z.string().optional(),
        ownerId: zid('user'),
        isPublic: z.boolean(),
        archived: z.boolean(),
        owner: z.object({
          _id: zid('user'),
          name: z.string().nullable(),
          email: z.string(),
        }),
        members: z.array(
          z.object({
            _id: zid('user'),
            name: z.string().nullable(),
            email: z.string(),
            joinedAt: z.number(),
          })
        ),
        todoCount: z.number(),
        completedTodoCount: z.number(),
      })
      .nullable()
  )
  .query(async ({ ctx, input }) => {
    const project = await ctx.table('projects').get(input.projectId);
    if (!project) {
      return null;
    }

    // Check access - get session to check if authenticated
    const { getSession } = await import('better-convex/auth');
    const session = await getSession(ctx);
    const userId = session?.userId ?? null;
    const isOwner = userId === project.ownerId;

    // For private projects, check membership
    if (!(project.isPublic || isOwner)) {
      if (!userId) {
        throw new ConvexError({
          code: 'FORBIDDEN',
          message: 'You do not have access to this project',
        });
      }

      // Is not member, throw error
      await ctx
        .table('projectMembers', 'projectId_userId', (q) =>
          q.eq('projectId', input.projectId).eq('userId', userId)
        )
        .firstX();
    }

    const owner = await ctx.table('user').getX(project.ownerId);

    const members = await ctx
      .table('projectMembers', 'projectId', (q) =>
        q.eq('projectId', project._id)
      )
      .map(async (member) => {
        const user = await ctx.table('user').getX(member.userId);

        return {
          _id: user._id,
          name: user.name ?? null,
          email: user.email,
          joinedAt: member._creationTime,
        };
      });

    const todoCount = await aggregateTodosByProject.count(ctx, {
      namespace: project._id,
      bounds: {},
    });

    // Get completed todo count
    const completedTodoCount = (
      await ctx
        .table('todos', 'projectId', (q) => q.eq('projectId', project._id))
        .filter((q) => q.eq(q.field('completed'), true))
    ).length;

    return {
      ...project.doc(),
      owner: {
        _id: owner._id,
        name: owner.name ?? null,
        email: owner.email,
      },
      members,
      todoCount,
      completedTodoCount,
    };
  });

// Create project with owner assignment
export const create = authMutation
  .meta({ rateLimit: 'project/create' })
  .input(
    z.object({
      name: z.string().min(1).max(100),
      description: z.string().max(500).optional(),
      isPublic: z.boolean().optional(),
    })
  )
  .output(zid('projects'))
  .mutation(async ({ ctx, input }) => {
    const projectId = await ctx.table('projects').insert({
      name: input.name,
      description: input.description,
      ownerId: ctx.userId,
      isPublic: input.isPublic ?? false,
      archived: false,
    });

    return projectId;
  });

// Update project
export const update = authMutation
  .meta({ rateLimit: 'project/update' })
  .input(
    z.object({
      projectId: zid('projects'),
      name: z.string().min(1).max(100).optional(),
      description: z.string().max(500).nullable().optional(),
      isPublic: z.boolean().optional(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can update the project',
      });
    }

    const updates: any = {};
    if (input.name !== undefined) {
      updates.name = input.name;
    }
    if (input.description !== undefined) {
      updates.description = input.description;
    }
    if (input.isPublic !== undefined) {
      updates.isPublic = input.isPublic;
    }

    if (Object.keys(updates).length > 0) {
      await ctx.table('projects').getX(input.projectId).patch(updates);
    }

    return null;
  });

// Archive project (soft delete)
export const archive = authMutation
  .meta({ rateLimit: 'project/update' })
  .input(z.object({ projectId: zid('projects') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can archive the project',
      });
    }

    await ctx.table('projects').getX(input.projectId).patch({
      archived: true,
    });

    return null;
  });

// Restore archived project
export const restore = authMutation
  .meta({ rateLimit: 'project/update' })
  .input(z.object({ projectId: zid('projects') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can restore the project',
      });
    }

    await ctx.table('projects').getX(input.projectId).patch({
      archived: false,
    });

    return null;
  });

// Add project member
export const addMember = authMutation
  .meta({ rateLimit: 'project/member' })
  .input(
    z.object({
      projectId: zid('projects'),
      userEmail: z.email(),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can add members',
      });
    }

    // Find user by email
    const userToAdd = await ctx.table('user').getX('email', input.userEmail);

    // Check if already member or owner
    if (userToAdd._id === project.ownerId) {
      throw new ConvexError({
        code: 'BAD_REQUEST',
        message: 'User is already the owner of this project',
      });
    }

    // existing?
    await ctx
      .table('projectMembers', 'projectId_userId', (q) =>
        q.eq('projectId', input.projectId).eq('userId', userToAdd._id)
      )
      .firstX();

    // Add member
    await ctx.table('projectMembers').insert({
      projectId: input.projectId,
      userId: userToAdd._id,
    });

    return null;
  });

// Remove project member
export const removeMember = authMutation
  .meta({ rateLimit: 'project/member' })
  .input(
    z.object({
      projectId: zid('projects'),
      userId: zid('user'),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can remove members',
      });
    }

    const member = await ctx
      .table('projectMembers', 'projectId_userId', (q) =>
        q.eq('projectId', input.projectId).eq('userId', input.userId)
      )
      .firstX();

    await ctx.table('projectMembers').getX(member._id).delete();

    return null;
  });

// Leave project as member
export const leave = authMutation
  .meta({ rateLimit: 'project/member' })
  .input(z.object({ projectId: zid('projects') }))
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const member = await ctx
      .table('projectMembers', 'projectId_userId', (q) =>
        q.eq('projectId', input.projectId).eq('userId', ctx.userId)
      )
      .firstX();

    await ctx.table('projectMembers').getX(member._id).delete();

    return null;
  });

// Transfer project ownership
export const transfer = authMutation
  .meta({ rateLimit: 'project/update' })
  .input(
    z.object({
      projectId: zid('projects'),
      newOwnerId: zid('user'),
    })
  )
  .output(z.null())
  .mutation(async ({ ctx, input }) => {
    const project = await ctx.table('projects').getX(input.projectId);

    // Check ownership
    if (project.ownerId !== ctx.userId) {
      throw new ConvexError({
        code: 'FORBIDDEN',
        message: 'Only the project owner can transfer ownership',
      });
    }

    // Check new owner exists
    await ctx.table('user').getX(input.newOwnerId);

    // If new owner is currently a member, remove them
    const memberRecord = await ctx
      .table('projectMembers', 'projectId_userId', (q) =>
        q.eq('projectId', input.projectId).eq('userId', input.newOwnerId)
      )
      .first();

    if (memberRecord) {
      await ctx.table('projectMembers').getX(memberRecord._id).delete();
    }

    // Add current owner as member
    await ctx.table('projectMembers').insert({
      projectId: input.projectId,
      userId: ctx.userId,
    });

    // Transfer ownership
    await ctx.table('projects').getX(input.projectId).patch({
      ownerId: input.newOwnerId,
    });

    return null;
  });

// Get user's active projects for dropdown
export const listForDropdown = authQuery
  .output(
    z.array(
      z.object({
        _id: zid('projects'),
        name: z.string(),
        isOwner: z.boolean(),
      })
    )
  )
  .query(async ({ ctx }) => {
    const userId = ctx.userId;

    // Get owned projects
    const ownedProjects = await ctx
      .table('projects', 'ownerId', (q) => q.eq('ownerId', userId))
      .filter((q) => q.eq(q.field('archived'), false))
      .map(async (project) => ({
        _id: project._id,
        name: project.name,
        isOwner: true,
      }));

    // Get member projects
    const memberProjects = await ctx
      .table('projectMembers', 'userId', (q) => q.eq('userId', userId))
      .map(async (member) => {
        const project = await ctx.table('projects').get(member.projectId);
        if (!project || project.archived) {
          return null;
        }
        return {
          _id: project._id,
          name: project.name,
          isOwner: false,
        };
      });

    return [
      ...ownedProjects,
      ...memberProjects.filter((p): p is NonNullable<typeof p> => p !== null),
    ].sort((a, b) => a.name.localeCompare(b.name));
  });
