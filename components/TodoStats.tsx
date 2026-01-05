'use client';

interface TodoStatsProps {
  stats: {
    total: number;
    active: number;
    completed: number;
  };
}

export default function TodoStats({ stats }: TodoStatsProps) {
  return (
    <div className="flex justify-around p-4 bg-gray-50 rounded-lg">
      <div className="text-center">
        <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
        <p className="text-sm text-gray-600">全体</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-blue-600">{stats.active}</p>
        <p className="text-sm text-gray-600">未完了</p>
      </div>
      <div className="text-center">
        <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
        <p className="text-sm text-gray-600">完了</p>
      </div>
    </div>
  );
}
