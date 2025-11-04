import { TodoList } from '@/components/todos/todo-list';

export default async function HomePage() {
  return (
    <div className="container mx-auto px-4 py-6">
      <TodoList />
    </div>
  );
}
