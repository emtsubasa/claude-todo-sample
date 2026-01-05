'use client';

export type SortType = 'newest' | 'oldest' | 'name-asc' | 'name-desc' | 'active-first' | 'completed-first';

interface TodoSortProps {
  currentSort: SortType;
  onSortChange: (sort: SortType) => void;
}

export default function TodoSort({ currentSort, onSortChange }: TodoSortProps) {
  const sortOptions: { value: SortType; label: string }[] = [
    { value: 'newest', label: '新しい順' },
    { value: 'oldest', label: '古い順' },
    { value: 'name-asc', label: '名前（昇順）' },
    { value: 'name-desc', label: '名前（降順）' },
    { value: 'active-first', label: '未完了優先' },
    { value: 'completed-first', label: '完了済み優先' },
  ];

  return (
    <div className="mb-6">
      <label htmlFor="sort-select" className="block text-sm font-medium text-gray-700 mb-2">
        並び替え
      </label>
      <select
        id="sort-select"
        value={currentSort}
        onChange={(e) => onSortChange(e.target.value as SortType)}
        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-700"
      >
        {sortOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}
