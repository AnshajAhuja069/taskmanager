import { useState } from 'react';
import { X, ChevronDown } from 'lucide-react';
import { Task } from '../types/task';

interface MultiSelectActionsProps {
  selectedCount: number;
  onClear: () => void;
  onStatusChange: (status: Task['status']) => void;
  onDelete: () => void;
}

export function MultiSelectActions({ 
  selectedCount, 
  onClear, 
  onStatusChange,
  onDelete 
}: MultiSelectActionsProps) {
  const [isStatusOpen, setIsStatusOpen] = useState(false);

  return (
    <div className="fixed bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <span>{selectedCount} tasks selected</span>
      <button
        onClick={onClear}
        className="p-1 hover:bg-gray-800 rounded"
      >
        <X className="h-4 w-4" />
      </button>
      <div className="h-4 w-px bg-gray-700 mx-2" />
      <div className="relative">
        <button
          onClick={() => setIsStatusOpen(!isStatusOpen)}
          className="px-3 py-1 text-sm rounded hover:bg-gray-800 flex items-center gap-1"
        >
          Status
          <ChevronDown className="h-4 w-4" />
        </button>
        {isStatusOpen && (
          <div className="absolute bottom-full left-0 mb-1 w-40 bg-gray-800 rounded-lg shadow-lg py-1">
            <button
              onClick={() => {
                onStatusChange('TO-DO');
                setIsStatusOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
            >
              To Do
            </button>
            <button
              onClick={() => {
                onStatusChange('IN-PROGRESS');
                setIsStatusOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
            >
              In Progress
            </button>
            <button
              onClick={() => {
                onStatusChange('COMPLETED');
                setIsStatusOpen(false);
              }}
              className="w-full px-4 py-2 text-sm text-left hover:bg-gray-700"
            >
              Completed
            </button>
          </div>
        )}
      </div>
      <div className="h-4 w-px bg-gray-700 mx-2" />
      <button
        onClick={onDelete}
        className="px-3 py-1 text-sm text-red-500 rounded hover:bg-gray-800"
      >
        Delete
      </button>
    </div>
  );
}