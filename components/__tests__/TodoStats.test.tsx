import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TodoStats from '../TodoStats';

describe('TodoStats', () => {
  it('should display all zero counts when stats are empty', () => {
    const stats = { total: 0, active: 0, completed: 0 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    expect(totalElement).toHaveTextContent('0');
    expect(activeElement).toHaveTextContent('0');
    expect(completedElement).toHaveTextContent('0');
  });

  it('should display correct total count', () => {
    const stats = { total: 5, active: 3, completed: 2 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    expect(totalElement).toHaveTextContent('5');
  });

  it('should display correct active count', () => {
    const stats = { total: 5, active: 3, completed: 2 };
    render(<TodoStats stats={stats} />);

    const activeElement = screen.getByText('未完了').previousElementSibling;
    expect(activeElement).toHaveTextContent('3');
  });

  it('should display correct completed count', () => {
    const stats = { total: 5, active: 3, completed: 2 };
    render(<TodoStats stats={stats} />);

    const completedElement = screen.getByText('完了').previousElementSibling;
    expect(completedElement).toHaveTextContent('2');
  });

  it('should handle when all tasks are active', () => {
    const stats = { total: 10, active: 10, completed: 0 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    expect(totalElement).toHaveTextContent('10');
    expect(activeElement).toHaveTextContent('10');
    expect(completedElement).toHaveTextContent('0');
  });

  it('should handle when all tasks are completed', () => {
    const stats = { total: 8, active: 0, completed: 8 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    expect(totalElement).toHaveTextContent('8');
    expect(activeElement).toHaveTextContent('0');
    expect(completedElement).toHaveTextContent('8');
  });

  it('should display large numbers correctly', () => {
    const stats = { total: 999, active: 500, completed: 499 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    expect(totalElement).toHaveTextContent('999');
    expect(activeElement).toHaveTextContent('500');
    expect(completedElement).toHaveTextContent('499');
  });

  it('should verify that total equals active plus completed', () => {
    const stats = { total: 15, active: 9, completed: 6 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    const totalValue = parseInt(totalElement?.textContent || '0');
    const activeValue = parseInt(activeElement?.textContent || '0');
    const completedValue = parseInt(completedElement?.textContent || '0');

    expect(totalValue).toBe(activeValue + completedValue);
  });

  it('should apply correct styling classes to count elements', () => {
    const stats = { total: 5, active: 3, completed: 2 };
    render(<TodoStats stats={stats} />);

    const totalElement = screen.getByText('全体').previousElementSibling;
    const activeElement = screen.getByText('未完了').previousElementSibling;
    const completedElement = screen.getByText('完了').previousElementSibling;

    expect(totalElement).toHaveClass('text-gray-800');
    expect(activeElement).toHaveClass('text-blue-600');
    expect(completedElement).toHaveClass('text-green-600');
  });
});
