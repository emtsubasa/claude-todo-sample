import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import TodoSort, { SortType } from '../TodoSort';

describe('TodoSort', () => {
  it('should render sort select with label', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    expect(screen.getByLabelText('並び替え')).toBeInTheDocument();
    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('should display all sort options', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const sortOptions = [
      '新しい順',
      '古い順',
      '名前（昇順）',
      '名前（降順）',
      '未完了優先',
      '完了済み優先',
    ];

    sortOptions.forEach((option) => {
      expect(screen.getByText(option)).toBeInTheDocument();
    });
  });

  it('should show current sort as selected', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="oldest" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('oldest');
  });

  it('should call onSortChange when sort option is changed', async () => {
    const user = userEvent.setup();
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    await user.selectOptions(select, 'oldest');

    expect(mockOnSortChange).toHaveBeenCalledWith('oldest');
  });

  it('should call onSortChange with correct value for each option', async () => {
    const user = userEvent.setup();
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');

    const sortValues: SortType[] = [
      'oldest',
      'name-asc',
      'name-desc',
      'active-first',
      'completed-first',
    ];

    for (const value of sortValues) {
      await user.selectOptions(select, value);
      expect(mockOnSortChange).toHaveBeenCalledWith(value);
    }
  });

  it('should have proper styling classes', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toHaveClass('w-full');
    expect(select).toHaveClass('px-4');
    expect(select).toHaveClass('py-2');
    expect(select).toHaveClass('border');
    expect(select).toHaveClass('rounded-lg');
  });

  it('should render label with correct for attribute', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const label = screen.getByText('並び替え');
    expect(label).toHaveAttribute('for', 'sort-select');

    const select = screen.getByRole('combobox');
    expect(select).toHaveAttribute('id', 'sort-select');
  });

  it('should update when currentSort prop changes', () => {
    const mockOnSortChange = vi.fn();
    const { rerender } = render(
      <TodoSort currentSort="newest" onSortChange={mockOnSortChange} />
    );

    let select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('newest');

    rerender(<TodoSort currentSort="name-asc" onSortChange={mockOnSortChange} />);

    select = screen.getByRole('combobox') as HTMLSelectElement;
    expect(select.value).toBe('name-asc');
  });

  it('should have accessible select element', () => {
    const mockOnSortChange = vi.fn();
    render(<TodoSort currentSort="newest" onSortChange={mockOnSortChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeVisible();
    expect(screen.getByLabelText('並び替え')).toBe(select);
  });
});
