'use client';

import { useState, useEffect } from 'react';
import TodoInput from './TodoInput';
import TodoList from './TodoList';
import TodoFilter from './TodoFilter';
import TodoStats from './TodoStats';

export interface Todo {
  id: number;
  text: string;
  completed: boolean;
  createdAt: string;
}

export type FilterType = 'all' | 'active' | 'completed';

export default function TodoApp() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [filter, setFilter] = useState<FilterType>('all');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const saved = localStorage.getItem('todos');
    if (saved) {
      setTodos(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    if (mounted) {
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }, [todos, mounted]);

  const addTodo = (text: string) => {
    const newTodo: Todo = {
      id: Date.now(),
      text,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    setTodos([...todos, newTodo]);
  };

  const toggleTodo = (id: number) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const editTodo = (id: number, newText: string) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, text: newText } : todo
    ));
  };

  const getFilteredTodos = () => {
    switch (filter) {
      case 'active':
        return todos.filter(todo => !todo.completed);
      case 'completed':
        return todos.filter(todo => todo.completed);
      default:
        return todos;
    }
  };

  if (!mounted) {
    return null;
  }

  const filteredTodos = getFilteredTodos();
  const stats = {
    total: todos.length,
    active: todos.filter(todo => !todo.completed).length,
    completed: todos.filter(todo => todo.completed).length,
  };

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-2xl overflow-hidden">
      <div className="p-8">
        <h1 className="text-4xl font-bold text-gray-800 text-center mb-8">
          TODO アプリ
        </h1>

        <TodoInput onAdd={addTodo} />

        <TodoFilter currentFilter={filter} onFilterChange={setFilter} />

        <TodoList
          todos={filteredTodos}
          onToggle={toggleTodo}
          onDelete={deleteTodo}
          onEdit={editTodo}
        />

        <TodoStats stats={stats} />
      </div>
    </div>
  );
}
