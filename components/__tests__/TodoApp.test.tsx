import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import TodoApp from '../TodoApp';

describe('TodoApp', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.clearAllMocks();
  });

  afterEach(() => {
    localStorage.clear();
  });

  it('should render the main components', () => {
    render(<TodoApp />);

    expect(screen.getByText('TODO アプリ')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('新しいタスクを入力...')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '追加' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完了済み' })).toBeInTheDocument();
    expect(screen.getByLabelText('並び替え')).toBeInTheDocument();
  });

  it('should add a new todo when user submits input', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Buy groceries');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Buy groceries')).toBeInTheDocument();
    });
  });

  it('should update stats when todos are added', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Task 1');
    await user.click(addButton);

    await user.type(input, 'Task 2');
    await user.click(addButton);

    await waitFor(() => {
      const stats = screen.getAllByText('全体');
      const totalElement = stats[0].previousElementSibling;
      const activeStats = screen.getAllByText('未完了');
      const activeElement = activeStats[activeStats.length - 1].previousElementSibling;
      expect(totalElement).toHaveTextContent('2');
      expect(activeElement).toHaveTextContent('2');
    });
  });

  it('should toggle todo completion status', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Completable task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Completable task')).toBeInTheDocument();
    });

    const checkbox = screen.getByRole('checkbox');
    await user.click(checkbox);

    await waitFor(() => {
      expect(checkbox).toBeChecked();
      const completedStats = screen.getAllByText('完了');
      const completedElement = completedStats[completedStats.length - 1].previousElementSibling;
      expect(completedElement).toHaveTextContent('1');
    });
  });

  it('should delete a todo when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Task to delete');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Task to delete')).toBeInTheDocument();
    });

    const deleteButton = screen.getByRole('button', { name: '削除' });
    await user.click(deleteButton);

    await waitFor(() => {
      expect(screen.queryByText('Task to delete')).not.toBeInTheDocument();
      expect(screen.getByText('タスクがありません')).toBeInTheDocument();
    });
  });

  it('should edit a todo text', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Original text');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Original text')).toBeInTheDocument();
    });

    const editButton = screen.getByRole('button', { name: '編集' });
    await user.click(editButton);

    const textboxes = screen.getAllByRole('textbox');
    const editInput = textboxes[textboxes.length - 1]; // Get the edit input, not the add input
    await user.clear(editInput);
    await user.type(editInput, 'Updated text');

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Updated text')).toBeInTheDocument();
      expect(screen.queryByText('Original text')).not.toBeInTheDocument();
    });
  });

  it('should filter todos by "未完了"', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Active task');
    await user.click(addButton);

    await user.type(input, 'Completed task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });

    // Find checkbox for "Completed task" specifically
    const completedTaskElement = screen.getByText('Completed task');
    const completedTaskCheckbox = completedTaskElement.closest('div')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(completedTaskCheckbox);

    const activeFilterButton = screen.getByRole('button', { name: '未完了' });
    await user.click(activeFilterButton);

    await waitFor(() => {
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.queryByText('Completed task')).not.toBeInTheDocument();
    });
  });

  it('should filter todos by "完了済み"', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Active task');
    await user.click(addButton);

    await user.type(input, 'Completed task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });

    // Find checkbox for "Completed task" specifically
    const completedTaskElement = screen.getByText('Completed task');
    const completedTaskCheckbox = completedTaskElement.closest('div')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(completedTaskCheckbox);

    const completedFilterButton = screen.getByRole('button', { name: '完了済み' });
    await user.click(completedFilterButton);

    await waitFor(() => {
      expect(screen.queryByText('Active task')).not.toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });
  });

  it('should show all todos when "すべて" filter is selected', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Active task');
    await user.click(addButton);

    await user.type(input, 'Completed task');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });

    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    const completedFilterButton = screen.getByRole('button', { name: '完了済み' });
    await user.click(completedFilterButton);

    const allFilterButton = screen.getByRole('button', { name: 'すべて' });
    await user.click(allFilterButton);

    await waitFor(() => {
      expect(screen.getByText('Active task')).toBeInTheDocument();
      expect(screen.getByText('Completed task')).toBeInTheDocument();
    });
  });

  it('should persist todos to localStorage', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Persistent task');
    await user.click(addButton);

    await waitFor(() => {
      const savedData = localStorage.getItem('todos');
      expect(savedData).not.toBeNull();
      const todos = JSON.parse(savedData!);
      expect(todos).toHaveLength(1);
      expect(todos[0].text).toBe('Persistent task');
    });
  });

  it('should load todos from localStorage on mount', async () => {
    const initialTodos = [
      {
        id: 1,
        text: 'Loaded task',
        completed: false,
        createdAt: new Date().toISOString(),
      },
    ];

    localStorage.setItem('todos', JSON.stringify(initialTodos));

    render(<TodoApp />);

    await waitFor(() => {
      expect(screen.getByText('Loaded task')).toBeInTheDocument();
    });
  });

  it('should handle complete workflow: add, complete, filter, edit, delete', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    // Add multiple tasks
    await user.type(input, 'Task 1');
    await user.click(addButton);

    await user.type(input, 'Task 2');
    await user.click(addButton);

    await user.type(input, 'Task 3');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    // Complete one task
    const checkboxes = screen.getAllByRole('checkbox');
    await user.click(checkboxes[1]);

    // Filter by completed
    const completedFilterButton = screen.getByRole('button', { name: '完了済み' });
    await user.click(completedFilterButton);

    await waitFor(() => {
      expect(screen.queryByText('Task 1')).not.toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
    });

    // Go back to all
    const allFilterButton = screen.getByRole('button', { name: 'すべて' });
    await user.click(allFilterButton);

    await waitFor(() => {
      expect(screen.getByText('Task 1')).toBeInTheDocument();
      expect(screen.getByText('Task 2')).toBeInTheDocument();
      expect(screen.getByText('Task 3')).toBeInTheDocument();
    });

    // Edit a task
    const editButtons = screen.getAllByRole('button', { name: '編集' });
    await user.click(editButtons[0]);

    const textboxes = screen.getAllByRole('textbox');
    const editInput = textboxes[textboxes.length - 1]; // Get the edit input, not the add input
    await user.clear(editInput);
    await user.type(editInput, 'Task 1 - Edited');

    const saveButton = screen.getByRole('button', { name: '保存' });
    await user.click(saveButton);

    await waitFor(() => {
      expect(screen.getByText('Task 1 - Edited')).toBeInTheDocument();
    });

    // Delete a task
    const deleteButtons = screen.getAllByRole('button', { name: '削除' });
    await user.click(deleteButtons[deleteButtons.length - 1]);

    await waitFor(() => {
      expect(screen.queryByText('Task 3')).not.toBeInTheDocument();
      const stats = screen.getAllByText('全体');
      const totalElement = stats[0].previousElementSibling;
      expect(totalElement).toHaveTextContent('2');
    });
  });

  it('should sort todos by newest first (default)', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'First task');
    await user.click(addButton);

    await user.type(input, 'Second task');
    await user.click(addButton);

    await user.type(input, 'Third task');
    await user.click(addButton);

    await waitFor(() => {
      const tasks = screen.getAllByText(/task/i);
      expect(tasks[0]).toHaveTextContent('Third task');
      expect(tasks[1]).toHaveTextContent('Second task');
      expect(tasks[2]).toHaveTextContent('First task');
    });
  });

  it('should sort todos by oldest first', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'First task');
    await user.click(addButton);

    await user.type(input, 'Second task');
    await user.click(addButton);

    await user.type(input, 'Third task');
    await user.click(addButton);

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'oldest');

    await waitFor(() => {
      const tasks = screen.getAllByText(/task/i);
      expect(tasks[0]).toHaveTextContent('First task');
      expect(tasks[1]).toHaveTextContent('Second task');
      expect(tasks[2]).toHaveTextContent('Third task');
    });
  });

  it('should sort todos by name ascending', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Zebra task');
    await user.click(addButton);

    await user.type(input, 'Apple task');
    await user.click(addButton);

    await user.type(input, 'Mango task');
    await user.click(addButton);

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'name-asc');

    await waitFor(() => {
      const tasks = screen.getAllByText(/task/i);
      expect(tasks[0]).toHaveTextContent('Apple task');
      expect(tasks[1]).toHaveTextContent('Mango task');
      expect(tasks[2]).toHaveTextContent('Zebra task');
    });
  });

  it('should sort todos by name descending', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Zebra task');
    await user.click(addButton);

    await user.type(input, 'Apple task');
    await user.click(addButton);

    await user.type(input, 'Mango task');
    await user.click(addButton);

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'name-desc');

    await waitFor(() => {
      const tasks = screen.getAllByText(/task/i);
      expect(tasks[0]).toHaveTextContent('Zebra task');
      expect(tasks[1]).toHaveTextContent('Mango task');
      expect(tasks[2]).toHaveTextContent('Apple task');
    });
  });

  it('should sort todos with active first', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Active task 1');
    await user.click(addButton);

    await user.type(input, 'Completed task');
    await user.click(addButton);

    await user.type(input, 'Active task 2');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
    });

    // Complete the "Completed task"
    const completedTaskElement = screen.getByText('Completed task');
    const completedTaskCheckbox = completedTaskElement.closest('div')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(completedTaskCheckbox);

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'active-first');

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      // Active tasks should come before completed tasks
      expect(checkboxes[0]).not.toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).toBeChecked();
    });
  });

  it('should sort todos with completed first', async () => {
    const user = userEvent.setup();
    render(<TodoApp />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const addButton = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Active task 1');
    await user.click(addButton);

    await user.type(input, 'Completed task');
    await user.click(addButton);

    await user.type(input, 'Active task 2');
    await user.click(addButton);

    await waitFor(() => {
      expect(screen.getByText('Active task 1')).toBeInTheDocument();
    });

    // Complete the "Completed task"
    const completedTaskElement = screen.getByText('Completed task');
    const completedTaskCheckbox = completedTaskElement.closest('div')?.querySelector('input[type="checkbox"]') as HTMLInputElement;
    await user.click(completedTaskCheckbox);

    const sortSelect = screen.getByRole('combobox');
    await user.selectOptions(sortSelect, 'completed-first');

    await waitFor(() => {
      const checkboxes = screen.getAllByRole('checkbox');
      // Completed tasks should come before active tasks
      expect(checkboxes[0]).toBeChecked();
      expect(checkboxes[1]).not.toBeChecked();
      expect(checkboxes[2]).not.toBeChecked();
    });
  });
});
