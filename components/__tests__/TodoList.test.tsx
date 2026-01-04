import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import TodoList from '../TodoList';
import { Todo } from '../TodoApp';

describe('TodoList', () => {
  const mockOnToggle = vi.fn();
  const mockOnDelete = vi.fn();
  const mockOnEdit = vi.fn();

  it('should display empty state message when there are no todos', () => {
    render(
      <TodoList
        todos={[]}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    expect(screen.getByText('上の入力欄から新しいタスクを追加してください')).toBeInTheDocument();
  });

  it('should not display empty state when there are todos', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Test task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.queryByText('タスクがありません')).not.toBeInTheDocument();
  });

  it('should render a single todo item', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Buy groceries',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
  });

  it('should render multiple todo items', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Buy groceries',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        text: 'Clean the house',
        completed: true,
        createdAt: '2024-01-01T01:00:00.000Z',
      },
      {
        id: 3,
        text: 'Write tests',
        completed: false,
        createdAt: '2024-01-01T02:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    expect(screen.getByText('Clean the house')).toBeInTheDocument();
    expect(screen.getByText('Write tests')).toBeInTheDocument();
  });

  it('should render correct number of checkboxes for all todos', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Task 1',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        text: 'Task 2',
        completed: true,
        createdAt: '2024-01-01T01:00:00.000Z',
      },
      {
        id: 3,
        text: 'Task 3',
        completed: false,
        createdAt: '2024-01-01T02:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes).toHaveLength(3);
  });

  it('should render todos with correct completion states', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Active task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        text: 'Completed task',
        completed: true,
        createdAt: '2024-01-01T01:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes[0]).not.toBeChecked();
    expect(checkboxes[1]).toBeChecked();
  });

  it('should handle a large number of todos', () => {
    const todos: Todo[] = Array.from({ length: 100 }, (_, i) => ({
      id: i + 1,
      text: `Task ${i + 1}`,
      completed: i % 2 === 0,
      createdAt: new Date().toISOString(),
    }));

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Task 1')).toBeInTheDocument();
    expect(screen.getByText('Task 50')).toBeInTheDocument();
    expect(screen.getByText('Task 100')).toBeInTheDocument();
  });

  it('should pass correct props to TodoItem components', () => {
    const todos: Todo[] = [
      {
        id: 123,
        text: 'Test task',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
    ];

    render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
  });

  it('should render todos with unique keys based on id', () => {
    const todos: Todo[] = [
      {
        id: 1,
        text: 'Task 1',
        completed: false,
        createdAt: '2024-01-01T00:00:00.000Z',
      },
      {
        id: 2,
        text: 'Task 2',
        completed: false,
        createdAt: '2024-01-01T01:00:00.000Z',
      },
    ];

    const { container } = render(
      <TodoList
        todos={todos}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const listItems = container.querySelectorAll('li');
    expect(listItems).toHaveLength(2);
  });
});
