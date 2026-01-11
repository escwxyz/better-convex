'use client';

import { api } from '@convex/_generated/api';
import type { Id } from '@convex/_generated/dataModel';
import { Archive, Loader2 } from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { WithSkeleton } from '@/components/ui/skeleton';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { usePublicPaginatedQuery } from '@/lib/convex/hooks';
import { TodoForm } from './todo-form';
import { TodoItem } from './todo-item';
import { TodoSearch } from './todo-search';

type TodoListProps = {
  projectId?: Id<'projects'>;
  showFilters?: boolean;
};

export function TodoList({ projectId, showFilters = true }: TodoListProps) {
  const [completedFilter, setCompletedFilter] = useState<boolean | undefined>();
  const [priorityFilter, setPriorityFilter] = useState<
    'low' | 'medium' | 'high' | undefined
  >();
  const [showDeleted, setShowDeleted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Use search API when there's a query, otherwise use the regular list
  const listResult = usePublicPaginatedQuery(
    searchQuery ? api.todos.search : api.todos.list,
    searchQuery
      ? {
          query: searchQuery,
          completed: completedFilter,
          projectId,
        }
      : {
          completed: completedFilter,
          projectId,
          priority: priorityFilter,
        },
    {
      initialNumItems: 9,
      placeholderData: [
        {
          _id: '1' as any,
          _creationTime: new Date('2025-11-04').getTime(),
          title: 'Example Todo 1',
          description: 'This is a placeholder todo item',
          completed: false,
          priority: 'medium' as const,
          dueDate: new Date('2025-11-05').getTime(),
          userId: 'user1' as any,
          tags: [],
          project: null,
        },
        {
          _id: '2' as any,
          _creationTime: new Date('2025-11-04').getTime(),
          title: 'Example Todo 2',
          description: 'Another placeholder todo item',
          completed: true,
          priority: 'low' as const,
          userId: 'user1' as any,
          tags: [],
          project: null,
        },
      ],
    }
  );

  const { data, isLoading, hasNextPage, isFetchingNextPage, fetchNextPage } =
    listResult;

  const allTodos = data || [];
  const todos = showDeleted
    ? allTodos.filter((todo: any) => todo.deletionTime)
    : allTodos.filter((todo: any) => !todo.deletionTime);
  const isEmpty = !isLoading && todos.length === 0;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-2xl">Todos</h2>
        <div className="flex items-center gap-2">
          <Button
            className={showDeleted ? 'bg-muted' : ''}
            onClick={() => setShowDeleted(!showDeleted)}
            size="sm"
            variant="outline"
          >
            <Archive className="h-4 w-4" />
            {showDeleted ? 'Hide' : 'Show'} Deleted
          </Button>
          <TodoForm defaultProjectId={projectId} />
        </div>
      </div>

      {showFilters && (
        <div className="space-y-4">
          <TodoSearch onSearchChange={setSearchQuery} />

          <div className="flex flex-wrap gap-2">
            <Tabs
              onValueChange={(value) => {
                setCompletedFilter(
                  value === 'all' ? undefined : value === 'completed'
                );
              }}
              value={
                completedFilter === undefined
                  ? 'all'
                  : completedFilter
                    ? 'completed'
                    : 'active'
              }
            >
              <TabsList>
                <TabsTrigger value="all">All</TabsTrigger>
                <TabsTrigger value="active">Active</TabsTrigger>
                <TabsTrigger value="completed">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            <Select
              onValueChange={(value) =>
                setPriorityFilter(value === 'all' ? undefined : (value as any))
              }
              value={priorityFilter || 'all'}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter by priority" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All priorities</SelectItem>
                <SelectItem value="low">Low</SelectItem>
                <SelectItem value="medium">Medium</SelectItem>
                <SelectItem value="high">High</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {isEmpty ? (
          <div className="py-12 text-center text-muted-foreground">
            {searchQuery
              ? `No todos found for "${searchQuery}"`
              : showDeleted
                ? 'No deleted todos.'
                : completedFilter === false
                  ? 'No active todos. Great job!'
                  : completedFilter === true
                    ? 'No completed todos yet.'
                    : 'No todos yet. Create your first one!'}
          </div>
        ) : (
          <>
            {todos.map((todo: any, index: number) => (
              <WithSkeleton
                className="w-full"
                isLoading={isLoading}
                key={todo._id || index}
              >
                <TodoItem todo={todo} />
              </WithSkeleton>
            ))}

            {hasNextPage && (
              <div className="flex justify-center pt-4">
                <Button
                  disabled={isFetchingNextPage}
                  onClick={() => fetchNextPage()}
                  variant="outline"
                >
                  {isFetchingNextPage ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Loading...
                    </>
                  ) : (
                    'Load more'
                  )}
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
