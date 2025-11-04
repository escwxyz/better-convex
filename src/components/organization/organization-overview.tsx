'use client';

import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import {
  Building2,
  Calendar,
  Crown,
  Edit3,
  ExternalLink,
  Settings,
  Trash2,
  UserCheck,
  Users,
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
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuthMutation } from '@/lib/convex/hooks';

type OrganizationOverviewProps = {
  organization?: {
    id: Id<'organization'>;
    createdAt: number;
    isActive: boolean;
    isPersonal: boolean;
    logo?: string | null;
    membersCount: number;
    name: string;
    role?: string;
    slug: string;
  } | null;
};

export function OrganizationOverview({
  organization,
}: OrganizationOverviewProps) {
  const [now] = useState(new Date('2025-11-04').getTime());
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [editData, setEditData] = useState({
    name: '',
    slug: '',
    logo: '',
  });

  const updateOrganization = useAuthMutation(
    api.organization.updateOrganization,
    {
      onSuccess: () => {
        setShowEditDialog(false);
        toast.success('Organization updated successfully');
      },
      onError: (error: any) => {
        toast.error(error.data?.message ?? 'Failed to update organization');
      },
    }
  );

  const deleteOrganization = useAuthMutation(
    api.organization.deleteOrganization,
    {
      onSuccess: () => {
        setShowDeleteDialog(false);
        toast.success('Organization deleted successfully');
        // Redirect handled by the mutation
      },
      onError: (error: any) => {
        toast.error(error.data?.message ?? 'Failed to delete organization');
      },
    }
  );

  if (!organization) {
    return null;
  }

  const handleEditOrganization = () => {
    setEditData({
      name: organization.name,
      slug: organization.slug,
      logo: organization.logo || '',
    });
    setShowEditDialog(true);
  };

  const handleUpdateOrganization = async () => {
    if (!editData.name.trim()) {
      toast.error('Organization name is required');
      return;
    }

    const updateData: any = {};
    if (editData.name !== organization.name) {
      updateData.name = editData.name.trim();
    }
    if (editData.slug !== organization.slug && editData.slug.trim()) {
      updateData.slug = editData.slug.trim();
    }
    if (editData.logo !== (organization.logo || '') && editData.logo.trim()) {
      updateData.logo = editData.logo.trim();
    }

    if (Object.keys(updateData).length === 0) {
      toast.error('No changes detected');
      return;
    }

    updateOrganization.mutate(updateData);
  };

  const handleDeleteOrganization = () => {
    deleteOrganization.mutate({});
  };

  const isOwner = organization.role === 'owner';
  const canEdit = isOwner && !organization.isPersonal;

  return (
    <div className="space-y-6">
      {/* Organization Info */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                Organization Details
              </CardTitle>
              <CardDescription>
                Basic information about this organization
              </CardDescription>
            </div>
            {canEdit && (
              <Button
                onClick={handleEditOrganization}
                size="sm"
                variant="outline"
              >
                <Edit3 className="h-4 w-4" />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="font-medium text-muted-foreground text-sm">
                Name
              </Label>
              <p className="text-sm">{organization.name}</p>
            </div>
            <div>
              <Label className="font-medium text-muted-foreground text-sm">
                Slug
              </Label>
              <p className="font-mono text-sm">{organization.slug}</p>
            </div>
            <div>
              <Label className="font-medium text-muted-foreground text-sm">
                Type
              </Label>
              <div className="flex items-center gap-2">
                <Badge
                  variant={organization.isPersonal ? 'secondary' : 'default'}
                >
                  {organization.isPersonal ? 'Personal' : 'Team'}
                </Badge>
                {organization.isActive && (
                  <Badge variant="outline">Active</Badge>
                )}
              </div>
            </div>
            <div>
              <Label className="font-medium text-muted-foreground text-sm">
                Created
              </Label>
              <p className="text-sm">
                {new Date(organization.createdAt).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Organization Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Organization Stats
          </CardTitle>
          <CardDescription>
            Overview of organization activity and membership
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-primary/10 p-2">
                <Users className="h-4 w-4 text-primary" />
              </div>
              <div>
                <p className="font-bold text-2xl">
                  {organization.membersCount}
                </p>
                <p className="text-muted-foreground text-sm">
                  Member{organization.membersCount !== 1 ? 's' : ''}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-green-100 p-2 dark:bg-green-900">
                <Crown className="h-4 w-4 text-green-600 dark:text-green-400" />
              </div>
              <div>
                <p className="font-bold text-2xl capitalize">
                  {organization.role || 'Member'}
                </p>
                <p className="text-muted-foreground text-sm">Your Role</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border p-4">
              <div className="rounded-full bg-blue-100 p-2 dark:bg-blue-900">
                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="font-bold text-2xl">
                  {Math.floor(
                    (now - organization.createdAt) / (1000 * 60 * 60 * 24)
                  )}
                </p>
                <p className="text-muted-foreground text-sm">Days Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks for this organization</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
            <Button className="justify-start" variant="outline">
              <ExternalLink className="h-4 w-4" />
              View Public Profile
            </Button>
            {isOwner && (
              <>
                <Button className="justify-start" variant="outline">
                  <UserCheck className="h-4 w-4" />
                  Manage Members
                </Button>
                <Button className="justify-start" variant="outline">
                  <Settings className="h-4 w-4" />
                  Organization Settings
                </Button>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Danger Zone */}
      {canEdit && (
        <Card className="border-destructive/20">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible and destructive actions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => setShowDeleteDialog(true)}
              variant="destructive"
            >
              <Trash2 className="h-4 w-4" />
              Delete Organization
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Edit Organization Dialog */}
      <Dialog onOpenChange={setShowEditDialog} open={showEditDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>
              Update your organization details
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name">Name</Label>
              <Input
                id="edit-name"
                onChange={(e) =>
                  setEditData({ ...editData, name: e.target.value })
                }
                value={editData.name}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-slug">Slug</Label>
              <Input
                id="edit-slug"
                onChange={(e) =>
                  setEditData({ ...editData, slug: e.target.value })
                }
                placeholder="organization-slug"
                value={editData.slug}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-logo">Logo URL</Label>
              <Input
                id="edit-logo"
                onChange={(e) =>
                  setEditData({ ...editData, logo: e.target.value })
                }
                placeholder="https://example.com/logo.png"
                value={editData.logo}
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={() => setShowEditDialog(false)} variant="outline">
              Cancel
            </Button>
            <Button
              disabled={updateOrganization.isPending}
              onClick={handleUpdateOrganization}
            >
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Organization Dialog */}
      <Dialog onOpenChange={setShowDeleteDialog} open={showDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Organization</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              organization and all of its data.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              onClick={() => setShowDeleteDialog(false)}
              variant="outline"
            >
              Cancel
            </Button>
            <Button
              disabled={deleteOrganization.isPending}
              onClick={handleDeleteOrganization}
              variant="destructive"
            >
              Delete Organization
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
