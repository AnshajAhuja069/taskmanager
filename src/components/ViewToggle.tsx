import { LayoutList, LayoutGrid } from 'lucide-react';

interface ViewToggleProps {
  view: 'list' | 'board';
  onChange: (view: 'list' | 'board') => void;
}

export function ViewToggle({ view, onChange }: ViewToggleProps) {
  return (
    <div className="flex items-center gap-2">
      <button
        onClick={() => onChange('list')}
        className={`px-4 py-1 text-sm font-medium rounded-md ${
          view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600'
        }`}
      >
        List
      </button>
      <button
        onClick={() => onChange('board')}
        className={`px-4 py-1 text-sm font-medium rounded-md ${
          view === 'board' ? 'bg-gray-900 text-white' : 'text-gray-600'
        }`}
      >
        Board
      </button>
    </div>
  );
}