'use client';

import { useState, KeyboardEvent } from 'react';
import { Todo } from './TodoApp';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, newText: string) => void;
}

export default function TodoItem({ todo, onToggle, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(todo.text);

  const handleSave = () => {
    if (editText.trim()) {
      onEdit(todo.id, editText.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditText(todo.text);
    setIsEditing(false);
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSave();
    } else if (e.key === 'Escape') {
      handleCancel();
    }
  };

  return (
    <li
      className={`flex items-center gap-3 p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-all hover:shadow-md ${
        todo.completed ? 'opacity-60' : ''
      }`}
    >
      {isEditing ? (
        <>
          <input
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onKeyDown={handleKeyPress}
            autoFocus
            className="flex-1 px-3 py-2 border-2 border-purple-500 rounded-md focus:outline-none text-gray-800"
          />
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors text-sm font-medium"
          >
            保存
          </button>
          <button
            onClick={handleCancel}
            className="px-4 py-2 bg-gray-400 text-white rounded-md hover:bg-gray-500 transition-colors text-sm font-medium"
          >
            キャンセル
          </button>
        </>
      ) : (
        <>
          <input
            type="checkbox"
            checked={todo.completed}
            onChange={() => onToggle(todo.id)}
            className="w-5 h-5 cursor-pointer accent-purple-600"
          />
          <span
            className={`flex-1 text-gray-800 ${
              todo.completed ? 'line-through text-gray-500' : ''
            }`}
          >
            {todo.text}
          </span>
          <button
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors text-sm font-medium"
          >
            編集
          </button>
          <button
            onClick={() => onDelete(todo.id)}
            className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors text-sm font-medium"
          >
            削除
          </button>
        </>
      )}
    </li>
  );
}
