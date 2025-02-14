import { Task } from '../types/task';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Edit, Trash2, Plus, GripVertical } from 'lucide-react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskBoardProps {
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  selectedTasks: string[];
  onToggleSelect: (taskId: string) => void;
}

function TaskCard({ 
  task, 
  onEdit, 
  onDelete,
  selected,
  onToggleSelect
}: { 
  task: Task; 
  onEdit: (task: Task) => void; 
  onDelete: (taskId: string) => void;
  selected: boolean;
  onToggleSelect: (taskId: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white rounded-lg p-4 shadow-sm cursor-grab active:cursor-grabbing ${
        selected ? 'ring-2 ring-purple-500' : ''
      }`}
    >
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onToggleSelect(task.id)}
          className="mt-1 h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
        />
        <div
          {...attributes}
          {...listeners}
          className="p-1 hover:bg-gray-100 rounded cursor-grab"
        >
          <GripVertical className="h-4 w-4 text-gray-400" />
        </div>
        <div className="flex-1">
          <h4 className={`font-medium text-gray-900 ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
            {task.title}
          </h4>
          {task.description && (
            <p className="mt-1 text-sm text-gray-500 line-clamp-2">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex items-center gap-2 text-sm text-gray-500">
            <span className={`px-2 py-0.5 rounded-full text-xs ${
              task.category === 'WORK' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'
            }`}>
              {task.category}
            </span>
            <span>•</span>
            <span>{format(new Date(task.dueDate), 'PP')}</span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onEdit(task)}
          >
            <Edit className="h-4 w-4" />
          </Button>
          <Button
            variant="danger"
            size="sm"
            onClick={() => onDelete(task.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function TaskBoard({ 
  tasks, 
  onEdit, 
  onDelete,
  selectedTasks,
  onToggleSelect
}: TaskBoardProps) {
  const statusColors = {
    'TO-DO': 'bg-pink-100',
    'IN-PROGRESS': 'bg-blue-100',
    'COMPLETED': 'bg-green-100',
  };

  const columns = [
    { status: 'TO-DO' as const, title: 'To Do' },
    { status: 'IN-PROGRESS' as const, title: 'In Progress' },
    { status: 'COMPLETED' as const, title: 'Completed' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {columns.map(({ status, title }) => (
        <div key={status} className={`rounded-lg p-4 ${statusColors[status]}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-900">{title}</h3>
              <span className={`px-2 py-1 rounded-full text-xs ${statusColors[status]}`}>
                {tasks.filter(task => task.status === status).length}
              </span>
            </div>
            <Button
              size="sm"
              variant="secondary"
              onClick={() => onEdit({
                id: Math.random().toString(36).substr(2, 9),
                title: '',
                status,
                category: 'WORK',
                dueDate: new Date(),
                createdAt: new Date(),
                updatedAt: new Date(),
                order: tasks.length,
                userId: ''
              })}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <div className="space-y-3">
            {tasks
              .filter(task => task.status === status)
              .map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  selected={selectedTasks.includes(task.id)}
                  onToggleSelect={onToggleSelect}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  );
}
