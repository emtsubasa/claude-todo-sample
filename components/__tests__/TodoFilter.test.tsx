import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TodoFilter from '../TodoFilter';
import { FilterType } from '../TodoApp';

describe('TodoFilter', () => {
  it('should render all three filter buttons', () => {
    const mockOnFilterChange = vi.fn();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    expect(screen.getByRole('button', { name: 'すべて' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '未完了' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: '完了済み' })).toBeInTheDocument();
  });

  it('should highlight the "すべて" button when currentFilter is "all"', () => {
    const mockOnFilterChange = vi.fn();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    const activeButton = screen.getByRole('button', { name: '未完了' });
    const completedButton = screen.getByRole('button', { name: '完了済み' });

    expect(allButton).toHaveClass('bg-purple-600');
    expect(activeButton).not.toHaveClass('bg-purple-600');
    expect(completedButton).not.toHaveClass('bg-purple-600');
  });

  it('should highlight the "未完了" button when currentFilter is "active"', () => {
    const mockOnFilterChange = vi.fn();
    render(<TodoFilter currentFilter="active" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    const activeButton = screen.getByRole('button', { name: '未完了' });
    const completedButton = screen.getByRole('button', { name: '完了済み' });

    expect(allButton).not.toHaveClass('bg-purple-600');
    expect(activeButton).toHaveClass('bg-purple-600');
    expect(completedButton).not.toHaveClass('bg-purple-600');
  });

  it('should highlight the "完了済み" button when currentFilter is "completed"', () => {
    const mockOnFilterChange = vi.fn();
    render(<TodoFilter currentFilter="completed" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    const activeButton = screen.getByRole('button', { name: '未完了' });
    const completedButton = screen.getByRole('button', { name: '完了済み' });

    expect(allButton).not.toHaveClass('bg-purple-600');
    expect(activeButton).not.toHaveClass('bg-purple-600');
    expect(completedButton).toHaveClass('bg-purple-600');
  });

  it('should call onFilterChange with "all" when "すべて" button is clicked', async () => {
    const mockOnFilterChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilter currentFilter="active" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    await user.click(allButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('should call onFilterChange with "active" when "未完了" button is clicked', async () => {
    const mockOnFilterChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    const activeButton = screen.getByRole('button', { name: '未完了' });
    await user.click(activeButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('active');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('should call onFilterChange with "completed" when "完了済み" button is clicked', async () => {
    const mockOnFilterChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    const completedButton = screen.getByRole('button', { name: '完了済み' });
    await user.click(completedButton);

    expect(mockOnFilterChange).toHaveBeenCalledWith('completed');
    expect(mockOnFilterChange).toHaveBeenCalledTimes(1);
  });

  it('should handle switching between filters multiple times', async () => {
    const mockOnFilterChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });
    const activeButton = screen.getByRole('button', { name: '未完了' });
    const completedButton = screen.getByRole('button', { name: '完了済み' });

    await user.click(activeButton);
    await user.click(completedButton);
    await user.click(allButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(3);
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(1, 'active');
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(2, 'completed');
    expect(mockOnFilterChange).toHaveBeenNthCalledWith(3, 'all');
  });

  it('should allow clicking the same filter multiple times', async () => {
    const mockOnFilterChange = vi.fn();
    const user = userEvent.setup();
    render(<TodoFilter currentFilter="all" onFilterChange={mockOnFilterChange} />);

    const allButton = screen.getByRole('button', { name: 'すべて' });

    await user.click(allButton);
    await user.click(allButton);

    expect(mockOnFilterChange).toHaveBeenCalledTimes(2);
    expect(mockOnFilterChange).toHaveBeenCalledWith('all');
  });
});
