'use client';

import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import {
  Edit2,
  GitMerge,
  Hash,
  MoreVertical,
  Plus,
  Tag,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WithSkeleton } from '@/components/ui/skeleton';
import { useAuthMutation, useAuthQuery } from '@/lib/convex/hooks';

export default function TagsPage() {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showMergeDialog, setShowMergeDialog] = useState(false);
  const [selectedTag, setSelectedTag] = useState<{
    _id: Id<'tags'>;
    name: string;
    color: string;
  } | null>(null);
  const [newTag, setNewTag] = useState({ name: '', color: '' });
  const [editTag, setEditTag] = useState({ name: '', color: '' });
  const [mergeTarget, setMergeTarget] = useState<Id<'tags'> | null>(null);

  const { data: tags, isLoading } = useAuthQuery(
    api.tags.list,
    {},
    {
      placeholderData: [
        {
          _id: '1' as any,
          _creationTime: new Date('2025-11-04').getTime(),
          name: 'Work',
          color: '#3B82F6',
          usageCount: 5,
        },
        {
          _id: '2' as any,
          _creationTime: new Date('2025-11-04').getTime(),
          name: 'Personal',
          color: '#10B981',
          usageCount: 3,
        },
        {
          _id: '3' as any,
          _creationTime: new Date('2025-11-04').getTime(),
          name: 'Urgent',
          color: '#EF4444',
          usageCount: 2,
        },
      ],
    }
  );

  const { data: popularTags } = useAuthQuery(api.tags.popular, { limit: 5 });

  const createTag = useAuthMutation(api.tags.create, {
    onSuccess: () => {
      setShowCreateDialog(false);
      setNewTag({ name: '', color: '' });
      toast.success('Tag created successfully');
    },
    onError: (error: any) => {
      toast.error(error.data?.message ?? 'Failed to create tag');
    },
  });

  const updateTag = useAuthMutation(api.tags.update, {
    onSuccess: () => {
      setShowEditDialog(false);
      setSelectedTag(null);
      toast.success('Tag updated successfully');
    },
    onError: (error: any) => {
      toast.error(error.data?.message ?? 'Failed to update tag');
    },
  });

  const deleteTag = useAuthMutation(api.tags.deleteTag, {
    onSuccess: () => {
      toast.success('Tag deleted successfully');
    },
    onError: (error: any) => {
      toast.error(error.data?.message ?? 'Failed to delete tag');
    },
  });

  const mergeTag = useAuthMutation(api.tags.merge, {
    onSuccess: () => {
      setShowMergeDialog(false);
      setSelectedTag(null);
      setMergeTarget(null);
      toast.success('Tags merged successfully');
    },
    onError: (error: any) => {
      toast.error(error.data?.message ?? 'Failed to merge tags');
    },
  });

  const handleCreateTag = () => {
    if (!newTag.name.trim()) {
      toast.error('Tag name is required');
      return;
    }

    createTag.mutate({
      name: newTag.name.trim(),
      color: newTag.color || undefined,
    });
  };

  const handleEditTag = () => {
    if (!(selectedTag && editTag.name.trim())) {
      toast.error('Tag name is required');
      return;
    }

    updateTag.mutate({
      tagId: selectedTag._id,
      name: editTag.name.trim(),
      color: editTag.color || undefined,
    });
  };

  const handleDeleteTag = (tagId: Id<'tags'>) => {
    if (
      // biome-ignore lint/suspicious/noAlert: demo
      confirm(
        'Are you sure you want to delete this tag? It will be removed from all todos.'
      )
    ) {
      deleteTag.mutate({ tagId });
    }
  };

  const handleMergeTags = () => {
    if (!(selectedTag && mergeTarget)) {
      toast.error('Please select a target tag');
      return;
    }

    mergeTag.mutate({
      sourceTagId: selectedTag._id,
      targetTagId: mergeTarget,
    });
  };

  const openEditDialog = (tag: {
    _id: Id<'tags'>;
    name: string;
    color: string;
  }) => {
    setSelectedTag(tag);
    setEditTag({ name: tag.name, color: tag.color });
    setShowEditDialog(true);
  };

  const openMergeDialog = (tag: {
    _id: Id<'tags'>;
    name: string;
    color: string;
  }) => {
    setSelectedTag(tag);
    setMergeTarget(null);
    setShowMergeDialog(true);
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl">Tags</h1>
          <p className="mt-2 text-muted-foreground">
            Organize your todos with tags
          </p>
        </div>
        <Dialog onOpenChange={setShowCreateDialog} open={showCreateDialog}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4" />
              New Tag
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Tag</DialogTitle>
              <DialogDescription>
                Create a new tag to organize your todos
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="tag-name">Name</Label>
                <Input
                  id="tag-name"
                  onChange={(e) =>
                    setNewTag({ ...newTag, name: e.target.value })
                  }
                  placeholder="e.g., Work, Personal, Urgent"
                  value={newTag.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tag-color">Color (optional)</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-10 w-20 cursor-pointer"
                    id="tag-color"
                    onChange={(e) =>
                      setNewTag({ ...newTag, color: e.target.value })
                    }
                    type="color"
                    value={newTag.color || '#3B82F6'}
                  />
                  <Input
                    className="flex-1"
                    onChange={(e) =>
                      setNewTag({ ...newTag, color: e.target.value })
                    }
                    placeholder="#3B82F6"
                    value={newTag.color}
                  />
                </div>
              </div>
            </div>
            <DialogFooter>
              <Button
                onClick={() => setShowCreateDialog(false)}
                variant="outline"
              >
                Cancel
              </Button>
              <Button disabled={createTag.isPending} onClick={handleCreateTag}>
                Create
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {popularTags && popularTags.length > 0 && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-lg">Popular Tags</CardTitle>
            <CardDescription>Most used tags across all users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {popularTags.map((tag) => (
                <Badge
                  className="px-3 py-1"
                  key={tag._id}
                  style={{
                    backgroundColor: `${tag.color}20`,
                    color: tag.color,
                    borderColor: tag.color,
                  }}
                  variant="outline"
                >
                  <Hash className="mr-1 h-3 w-3" />
                  {tag.name}
                  <span className="ml-2 text-xs opacity-70">
                    ({tag.usageCount})
                  </span>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Your Tags</CardTitle>
          <CardDescription>
            {tags?.length || 0} tag{tags?.length !== 1 ? 's' : ''}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3">
            {tags?.map((tag, index) => (
              <WithSkeleton
                className="w-full"
                isLoading={isLoading}
                key={tag._id || index}
              >
                <div className="flex items-center justify-between rounded-lg border p-3 hover:bg-muted/50">
                  <div className="flex items-center gap-3">
                    <div
                      className="flex h-8 w-8 items-center justify-center rounded-full"
                      style={{ backgroundColor: `${tag.color}20` }}
                    >
                      <Tag className="h-4 w-4" style={{ color: tag.color }} />
                    </div>
                    <div>
                      <div className="font-medium">{tag.name}</div>
                      <div className="text-muted-foreground text-sm">
                        Used in {tag.usageCount} todo
                        {tag.usageCount !== 1 ? 's' : ''}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button className="h-8 w-8 p-0" size="sm" variant="ghost">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => openEditDialog(tag)}>
                        <Edit2 className="h-4 w-4" />
                        Edit
                      </DropdownMenuItem>
                      {tags?.length && tags.length > 1 && (
                        <DropdownMenuItem onClick={() => openMergeDialog(tag)}>
                          <GitMerge className="h-4 w-4" />
                          Merge into...
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem
                        className="text-destructive"
                        onClick={() => handleDeleteTag(tag._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </WithSkeleton>
            ))}
          </div>

          {tags?.length === 0 && !isLoading && (
            <div className="py-8 text-center text-muted-foreground">
              <Tag className="mx-auto mb-4 h-12 w-12 opacity-50" />
              <p>No tags yet</p>
              <p className="mt-2 text-sm">
                Create your first tag to start organizing
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Tag Dialog */}
      <Dialog onOpenChange={setShowEditDialog} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Tag</DialogTitle>
            <DialogDescription>Update tag name or color</DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-tag-name">Name</Label>
              <Input
                id="edit-tag-name"
                onChange={(e) =>
                  setEditTag({ ...editTag, name: e.target.value })
                }
                value={editTag.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tag-color">Color</Label>
              <div className="flex items-center gap-2">
                <Input
                  className="h-10 w-20 cursor-pointer"
                  id="edit-tag-color"
                  onChange={(e) =>
                    setEditTag({ ...editTag, color: e.target.value })
                  }
                  type="color"
                  value={editTag.color}
                />
                <Input
                  className="flex-1"
                  onChange={(e) =>
                    setEditTag({ ...editTag, color: e.target.value })
                  }
                  value={editTag.color}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button disabled={updateTag.isPending} onClick={handleEditTag}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Merge Tag Dialog */}
      <Dialog onOpenChange={setShowMergeDialog} open={showMergeDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Merge Tag</DialogTitle>
            <DialogDescription>
              Merge "{selectedTag?.name}" into another tag. All todos will be
              updated.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Select target tag</Label>
              <div className="grid gap-2">
                {tags
                  ?.filter((t) => t._id !== selectedTag?._id)
                  .map((tag) => (
                    <div
                      className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 hover:bg-muted/50 ${
                        mergeTarget === tag._id ? 'ring-2 ring-primary' : ''
                      }`}
                      key={tag._id}
                      onClick={() => setMergeTarget(tag._id)}
                      role="button"
                    >
                      <div
                        className="h-6 w-6 rounded-full"
                        style={{ backgroundColor: tag.color }}
                      />
                      <div className="font-medium">{tag.name}</div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowMergeDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={!mergeTarget || mergeTag.isPending}
              onClick={handleMergeTags}
            >
              Merge Tags
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
