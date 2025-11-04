'use client';

import { api } from '@convex/_generated/api';
import {
  Building2,
  Calendar,
  Crown,
  LogOut,
  Settings,
  Users,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useState } from 'react';
import { OrganizationMembers } from '@/components/organization/organization-members';
import { OrganizationOverview } from '@/components/organization/organization-overview';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { WithSkeleton } from '@/components/ui/skeleton';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuthQuery } from '@/lib/convex/hooks';

export default function OrganizationPage() {
  const params = useParams();
  const slug = params.slug as string;
  const [activeTab, setActiveTab] = useState('overview');

  const { data: organization, isLoading } = useAuthQuery(
    api.organization.getOrganization,
    { slug },
    {
      placeholderData: {
        id: '1' as any,
        createdAt: new Date('2025-11-04').getTime(),
        isActive: false,
        isPersonal: false,
        logo: null,
        membersCount: 3,
        name: 'Loading Organization',
        role: 'member',
        slug,
      },
    }
  );

  const { data: members, isLoading: membersLoading } = useAuthQuery(
    api.organization.listMembers,
    { slug },
    {
      placeholderData: {
        currentUserRole: 'member',
        isPersonal: false,
        members: [
          {
            id: '1' as any,
            createdAt: new Date('2025-11-04').getTime(),
            organizationId: '1' as any,
            role: 'owner',
            user: {
              id: '1' as any,
              email: 'owner@example.com',
              image: null,
              name: 'Organization Owner',
            },
            userId: '1' as any,
          },
          {
            id: '2' as any,
            createdAt: new Date('2025-11-04').getTime(),
            organizationId: '1' as any,
            role: 'member',
            user: {
              id: '2' as any,
              email: 'member@example.com',
              image: null,
              name: 'Team Member',
            },
            userId: '2' as any,
          },
        ],
      },
    }
  );

  if (!(organization || isLoading)) {
    return (
      <div className="container mx-auto px-4 py-6">
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground">
              Organization not found or you don't have access
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const isOwner = organization?.role === 'owner';

  return (
    <div className="container mx-auto px-4 py-6">
      <WithSkeleton className="w-full" isLoading={isLoading}>
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-4">
              <Avatar className="h-16 w-16">
                <AvatarImage src={organization?.logo || ''} />
                <AvatarFallback className="text-lg">
                  <Building2 className="h-8 w-8" />
                </AvatarFallback>
              </Avatar>
              <div>
                <div className="flex items-center gap-2">
                  <h1 className="font-bold text-3xl">{organization?.name}</h1>
                  {organization?.isPersonal && (
                    <Badge variant="secondary">Personal</Badge>
                  )}
                  {organization?.isActive && (
                    <Badge variant="default">Active</Badge>
                  )}
                </div>
                <div className="mt-2 flex items-center gap-4 text-muted-foreground text-sm">
                  <div className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    <span>{organization?.membersCount} members</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>
                      Created{' '}
                      {organization?.createdAt
                        ? new Date(organization.createdAt).toLocaleDateString()
                        : 'Unknown'}
                    </span>
                  </div>
                  {organization?.role && (
                    <div className="flex items-center gap-1">
                      <Crown className="h-4 w-4" />
                      <span className="capitalize">{organization.role}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {isOwner && (
                <Button size="sm" variant="outline">
                  <Settings className="h-4 w-4" />
                  Settings
                </Button>
              )}
              {!(organization?.isPersonal || isOwner) && (
                <Button size="sm" variant="outline">
                  <LogOut className="h-4 w-4" />
                  Leave
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <Tabs
          className="space-y-4"
          onValueChange={setActiveTab}
          value={activeTab}
        >
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="members">Members</TabsTrigger>
          </TabsList>

          <TabsContent className="space-y-4" value="overview">
            <OrganizationOverview organization={organization} />
          </TabsContent>

          <TabsContent className="space-y-4" value="members">
            <OrganizationMembers
              isLoading={membersLoading}
              members={members}
              organization={organization}
            />
          </TabsContent>
        </Tabs>
      </WithSkeleton>
    </div>
  );
}
