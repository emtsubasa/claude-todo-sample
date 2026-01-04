import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TodoInput from '../TodoInput';

describe('TodoInput', () => {
  it('should render an input field and a button', () => {
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    expect(input).toBeInTheDocument();
    expect(button).toBeInTheDocument();
  });

  it('should update input value when user types', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    await user.type(input, 'Buy groceries');

    expect(input).toHaveValue('Buy groceries');
  });

  it('should call onAdd with trimmed text when button is clicked', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, '  Clean the house  ');
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledWith('Clean the house');
    expect(mockOnAdd).toHaveBeenCalledTimes(1);
  });

  it('should clear input after adding a task', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Read a book');
    await user.click(button);

    expect(input).toHaveValue('');
  });

  it('should not call onAdd when input is empty', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const button = screen.getByRole('button', { name: '追加' });
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should not call onAdd when input contains only whitespace', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, '   ');
    await user.click(button);

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should call onAdd when Enter key is pressed', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');

    await user.type(input, 'Write tests{Enter}');

    expect(mockOnAdd).toHaveBeenCalledWith('Write tests');
    expect(input).toHaveValue('');
  });

  it('should not call onAdd when Enter is pressed with empty input', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');

    await user.type(input, '{Enter}');

    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('should handle multiple tasks being added sequentially', async () => {
    const mockOnAdd = vi.fn();
    const user = userEvent.setup();
    render(<TodoInput onAdd={mockOnAdd} />);

    const input = screen.getByPlaceholderText('新しいタスクを入力...');
    const button = screen.getByRole('button', { name: '追加' });

    await user.type(input, 'Task 1');
    await user.click(button);

    await user.type(input, 'Task 2');
    await user.click(button);

    await user.type(input, 'Task 3');
    await user.click(button);

    expect(mockOnAdd).toHaveBeenCalledTimes(3);
    expect(mockOnAdd).toHaveBeenNthCalledWith(1, 'Task 1');
    expect(mockOnAdd).toHaveBeenNthCalledWith(2, 'Task 2');
    expect(mockOnAdd).toHaveBeenNthCalledWith(3, 'Task 3');
  });
});
