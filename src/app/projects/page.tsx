'use client';

import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Archive, CheckSquare, Plus, Square, Users } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WithSkeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import {
  useAuthMutation,
  useIsAuth,
  usePublicPaginatedQuery,
} from '@/lib/convex/hooks';

export default function ProjectsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [includeArchived, setIncludeArchived] = useState(false);
  const [newProject, setNewProject] = useState({
    name: '',
    description: '',
    isPublic: false,
  });

  const isAuth = useIsAuth();

  const { data, hasNextPage, isLoading, isFetchingNextPage, fetchNextPage } =
    usePublicPaginatedQuery(
      api.projects.list,
      { includeArchived },
      { initialNumItems: 9 }
    );

  const createProject = useAuthMutation(api.projects.create, {
    onSuccess: () => {
      setShowCreateDialog(false);
      setNewProject({ name: '', description: '', isPublic: false });
      toast.success('Project created successfully');
    },
    onError: (error: any) => {
      toast.error(error.data?.message ?? 'Failed to create project');
    },
  });

  const archiveProject = useAuthMutation(api.projects.archive);
  const restoreProject = useAuthMutation(api.projects.restore);

  const handleCreateProject = async () => {
    if (!newProject.name.trim()) {
      toast.error('Project name is required');
      return;
    }

    createProject.mutate({
      name: newProject.name.trim(),
      description: newProject.description.trim() || undefined,
      isPublic: newProject.isPublic,
    });
  };

  const handleArchiveToggle = async (
    projectId: Id<'projects'>,
    isArchived: boolean
  ) => {
    const mutation = isArchived ? restoreProject : archiveProject;

    toast.promise(mutation.mutateAsync({ projectId }), {
      loading: isArchived ? 'Restoring project...' : 'Archiving project...',
      success: isArchived ? 'Project restored' : 'Project archived',
      error: (e) => e.data?.message ?? 'Failed to update project',
    });
  };

  const projects = data || [];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Projects</h1>
        {isAuth && (
          <Dialog onOpenChange={setShowCreateDialog} open={showCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4" />
                New Project
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Project</DialogTitle>
                <DialogDescription>
                  Create a new project to organize your todos
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    onChange={(e) =>
                      setNewProject({ ...newProject, name: e.target.value })
                    }
                    placeholder="My Awesome Project"
                    value={newProject.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    onChange={(e) =>
                      setNewProject({
                        ...newProject,
                        description: e.target.value,
                      })
                    }
                    placeholder="Brief description of your project"
                    rows={3}
                    value={newProject.description}
                  />
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={newProject.isPublic}
                    id="isPublic"
                    onCheckedChange={(checked) =>
                      setNewProject({
                        ...newProject,
                        isPublic: checked as boolean,
                      })
                    }
                  />
                  <Label className="font-normal text-sm" htmlFor="isPublic">
                    Make this project public
                  </Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  onClick={() => setShowCreateDialog(false)}
                  variant="outline"
                >
                  Cancel
                </Button>
                <Button
                  disabled={createProject.isPending}
                  onClick={handleCreateProject}
                >
                  Create
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>

      {isAuth && (
        <div className="mb-4 flex items-center space-x-2">
          <Checkbox
            checked={includeArchived}
            id="includeArchived"
            onCheckedChange={(checked) =>
              setIncludeArchived(checked as boolean)
            }
          />
          <Label className="font-normal text-sm" htmlFor="includeArchived">
            Show only archived projects
          </Label>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {projects.map((project, index) => (
          <WithSkeleton
            className="w-full"
            isLoading={isLoading}
            key={project._id || index}
          >
            <Card className={project.archived ? 'opacity-60' : ''}>
              <CardHeader>
                <Link href={`/projects/${project._id}`}>
                  <CardTitle className="cursor-pointer hover:underline">
                    {project.name}
                  </CardTitle>
                </Link>
                <CardDescription>
                  {project.description || 'No description'}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-muted-foreground text-sm">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <span>{project.memberCount} members</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      {project.completedTodoCount > 0 ? (
                        <CheckSquare className="h-4 w-4" />
                      ) : (
                        <Square className="h-4 w-4" />
                      )}
                      <span>
                        {project.completedTodoCount}/{project.todoCount} todos
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs">
                      {project.isOwner ? 'Owner' : 'Member'}
                    </span>
                    {project.isOwner && (
                      <Button
                        className="h-7 px-2"
                        onClick={() =>
                          handleArchiveToggle(project._id, project.archived)
                        }
                        size="sm"
                        variant="ghost"
                      >
                        <Archive className="mr-1 h-3 w-3" />
                        {project.archived ? 'Restore' : 'Archive'}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </WithSkeleton>
        ))}
      </div>

      {projects.length === 0 && !isLoading && (
        <div className="py-12 text-center">
          <p className="mb-4 text-muted-foreground">
            {isAuth
              ? includeArchived
                ? 'No archived projects found'
                : 'No active projects found'
              : 'No public projects available'}
          </p>
          {isAuth && (
            <Button onClick={() => setShowCreateDialog(true)}>
              <Plus className="h-4 w-4" />
              Create your first project
            </Button>
          )}
        </div>
      )}

      {hasNextPage && (
        <div className="mt-6 text-center">
          <Button
            disabled={isFetchingNextPage}
            onClick={() => fetchNextPage()}
            variant="outline"
          >
            {isFetchingNextPage ? 'Loading...' : 'Load more'}
          </Button>
        </div>
      )}
    </div>
  );
}
