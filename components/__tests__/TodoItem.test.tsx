import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TodoItem from '../TodoItem';
import { Todo } from '../TodoApp';

describe('TodoItem', () => {
  const mockTodo: Todo = {
    id: 1,
    text: 'Test task',
    completed: false,
    createdAt: '2024-01-01T00:00:00.000Z',
  };

  it('should render todo text', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByText('Test task')).toBeInTheDocument();
  });

  it('should render checkbox, edit button, and delete button', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    expect(screen.getByRole('checkbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '編集' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '削除' })).toBeInTheDocument();
  });

  it('should have unchecked checkbox when todo is not completed', () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).not.toBeChecked();
  });

  it('should have checked checkbox when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    expect(checkbox).toBeChecked();
  });

  it('should apply line-through style when todo is completed', () => {
    const completedTodo: Todo = { ...mockTodo, completed: true };
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();

    render(
      <TodoItem
        todo={completedTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const text = screen.getByText('Test task');
    expect(text).toHaveClass('line-through');
  });

  it('should call onToggle with todo id when checkbox is clicked', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    expect(mockOnToggle).toHaveBeenCalledWith(1);
    expect(mockOnToggle).toHaveBeenCalledTimes(1);
  });

  it('should call onDelete with todo id when delete button is clicked', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const deleteButton = screen.getByRole('button', { name: '削除' });
    await user.click(deleteButton);

    expect(mockOnDelete).toHaveBeenCalledWith(1);
    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('should enter edit mode when edit button is clicked', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    expect(screen.getByRole('textbox')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '保存' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'キャンセル' })).toBeInTheDocument();
  });

  it('should populate edit input with current todo text', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Test task');
  });

  it('should call onEdit with new text when save button is clicked', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Updated task');

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    expect(mockOnEdit).toHaveBeenCalledWith(1, 'Updated task');
  });

  it('should trim whitespace when saving edited text', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, '  Updated task  ');

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    expect(mockOnEdit).toHaveBeenCalledWith(1, 'Updated task');
  });

  it('should not call onEdit when saving empty text', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    expect(mockOnEdit).not.toHaveBeenCalled();
  });

  it('should exit edit mode and revert text when cancel button is clicked', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Modified text');

    const cancelButton = screen.getByRole('button', { name: 'キャンセル' });
    await user.click(cancelButton);

    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Test task')).toBeInTheDocument();
    expect(screen.queryByRole('textbox')).not.toBeInTheDocument();
  });

  it('should save edit when Enter key is pressed in edit input', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Quick edit{Enter}');

    expect(mockOnEdit).toHaveBeenCalledWith(1, 'Quick edit');
  });

  it('should cancel edit when Escape key is pressed in edit input', async () => {
    const mockOnToggle = vi.fn();
    const mockOnDelete = vi.fn();
    const mockOnEdit = vi.fn();
    const user = userEvent.setup();

    render(
      <TodoItem
        todo={mockTodo}
        onToggle={mockOnToggle}
        onDelete={mockOnDelete}
        onEdit={mockOnEdit}
      />
    );

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const input = screen.getByRole('textbox');
    await user.clear(input);
    await user.type(input, 'Will be cancelled{Escape}');

    expect(mockOnEdit).not.toHaveBeenCalled();
    expect(screen.getByText('Test task')).toBeInTheDocument();
  });
});
