import { Task, TaskStatus } from '../types/task';
import { format } from 'date-fns';
import { Button } from './ui/Button';
import { Edit, Trash2, Plus, MoreVertical, GripVertical, Paperclip } from 'lucide-react';
import { useState } from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface TaskListProps {
  status: TaskStatus;
  tasks: Task[];
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
  selectedTasks: string[];
  onToggleSelect: (taskId: string) => void;
}

function TaskItem({ 
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

  const [showActions, setShowActions] = useState(false);

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`group flex items-center gap-3 px-4 py-3 bg-white hover:bg-gray-50 border-b last:border-b-0 ${
        selected ? 'bg-purple-50' : ''
      }`}
    >
      <input
        type="checkbox"
        checked={selected}
        onChange={() => onToggleSelect(task.id)}
        className="h-4 w-4 rounded border-gray-300 text-purple-600 focus:ring-purple-500"
      />
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-100 rounded"
      >
        <GripVertical className="h-4 w-4 text-gray-400" />
      </div>
      <div className="flex-1 min-w-0">
        <h4 className={`text-sm font-medium text-gray-900 ${task.status === 'COMPLETED' ? 'line-through text-gray-500' : ''}`}>
          {task.title}
        </h4>
        {task.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {task.description}
          </p>
        )}
        {task.attachments && task.attachments.length > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Paperclip className="h-4 w-4 text-gray-400" />
            <div className="flex flex-wrap gap-2">
              {task.attachments.map((attachment, index) => (
                <a
                  key={index}
                  href={attachment.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-purple-600 hover:text-purple-700 flex items-center gap-1"
                >
                  {attachment.name}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-gray-500">
          {format(new Date(task.dueDate), 'MMM d, yyyy')}
        </span>
        <div className="relative">
          <button
            onClick={() => setShowActions(!showActions)}
            className="p-1 hover:bg-gray-100 rounded-full"
          >
            <MoreVertical className="h-4 w-4 text-gray-400" />
          </button>
          {showActions && (
            <div className="absolute right-0 mt-1 w-36 bg-white rounded-lg shadow-lg border py-1 z-[100]">
              <button
                onClick={() => {
                  onEdit(task);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-gray-700 hover:bg-gray-100 flex items-center gap-2"
              >
                <Edit className="h-4 w-4" />
                Edit
              </button>
              <button
                onClick={() => {
                  onDelete(task.id);
                  setShowActions(false);
                }}
                className="w-full px-4 py-2 text-sm text-left text-red-600 hover:bg-gray-100 flex items-center gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          )}
        </div>
        <span className="px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600">
          {task.status}
        </span>
        <span className={`px-2 py-1 rounded-full text-xs ${
          task.category === 'WORK' 
            ? 'bg-purple-100 text-purple-700' 
            : 'bg-blue-100 text-blue-700'
        }`}>
          {task.category}
        </span>
      </div>
    </div>
  );
}

export function TaskList({ 
  status, 
  tasks, 
  onEdit, 
  onDelete,
  selectedTasks,
  onToggleSelect
}: TaskListProps) {
  const [isExpanded, setIsExpanded] = useState(true);
  const [showAddTask, setShowAddTask] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const statusColors = {
    'TO-DO': 'bg-pink-100',
    'IN-PROGRESS': 'bg-blue-100',
    'COMPLETED': 'bg-green-100'
  };

  const statusTitles = {
    'TO-DO': 'Todo',
    'IN-PROGRESS': 'In-Progress',
    'COMPLETED': 'Completed'
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden">
      <div 
        className={`px-4 py-3 flex items-center justify-between ${statusColors[status]}`}
      >
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1 hover:bg-white/10 rounded"
          >
            <span className="text-xs">{isExpanded ? '▼' : '▶'}</span>
          </button>
          <h3 className="font-medium text-gray-900">
            {statusTitles[status]} ({tasks.length})
          </h3>
        </div>
      </div>

      {isExpanded && (
        <>
          {showAddTask ? (
            <div className="p-4 border-b">
              <div className="flex items-center gap-3">
                <input
                  type="text"
                  placeholder="What needs to be done?"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-purple-500 focus:ring-purple-500"
                  autoFocus
                />
                <Button 
                  size="sm"
                  onClick={() => {
                    if (newTaskTitle.trim()) {
                      onEdit({
                        id: Math.random().toString(36).substr(2, 9),
                        title: newTaskTitle,
                        status,
                        category: 'WORK',
                        dueDate: new Date(),
                        createdAt: new Date(),
                        updatedAt: new Date(),
                        order: tasks.length,
                        userId: ''
                      });
                      setNewTaskTitle('');
                      setShowAddTask(false);
                      
                    }
                  }}
                >
                  Add
                </Button>
                <Button 
                  variant="secondary" 
                  size="sm"
                  onClick={() => {
                    setNewTaskTitle('');
                    setShowAddTask(false);
                  }}
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <div className="px-4 py-2 border-b">
              <button
                onClick={() => setShowAddTask(true)}
                className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-900"
              >
                <Plus className="h-4 w-4" />
                ADD TASK
              </button>
            </div>
          )}

          <div>
            {tasks.map((task) => (
              <TaskItem
                key={task.id}
                task={task}
                onEdit={onEdit}
                onDelete={onDelete}
                selected={selectedTasks.includes(task.id)}
                onToggleSelect={onToggleSelect}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}