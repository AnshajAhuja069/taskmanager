import { useState, useEffect } from 'react';
import { TaskList } from './components/TaskList';
import { TaskDialog } from './components/TaskDialog';
import { Task } from './types/task';
import { Button } from './components/ui/Button';
import { ClipboardList, Search, Plus, X, LogOut } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { TaskBoard } from './components/TaskBoard';
import { mockTasks } from './data/mockTasks';
import { Dropdown } from './components/Dropdown';
import { MultiSelectActions } from './components/MultiSelectActions';
import { useAuth } from './hooks/useAuth';
import {
  DndContext,
  DragEndEvent,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

function App() {
  const { user, signInWithGoogle, logout } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isTaskDialogOpen, setIsTaskDialogOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | undefined>();
  const [view, setView] = useState<'list' | 'board'>('list');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [dueDateFilter, setDueDateFilter] = useState('');

  useEffect(() => {
    if (user) {
      setTasks(mockTasks);
    } else {
      setTasks([]);
    }
  }, [user]);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setTasks((tasks) => {
        const oldIndex = tasks.findIndex((task) => task.id === active.id);
        const newIndex = tasks.findIndex((task) => task.id === over.id);

        return arrayMove(tasks, oldIndex, newIndex);
      });
    }
  };

  const handleEdit = (task: Task) => {
    setSelectedTask(task);
    setIsTaskDialogOpen(true);
  };

  const handleSubmit = async (data: Partial<Task>) => {
    if (selectedTask) {
      setTasks(tasks.map(task => 
        task.id === selectedTask.id ? { ...task, ...data } : task
      ));
    } else {
      const newTask: Task = {
        id: Math.random().toString(36).substr(2, 9),
        ...data as Omit<Task, 'id'>,
        createdAt: new Date(),
        updatedAt: new Date(),
        order: tasks.length,
      };
      setTasks([...tasks, newTask]);
    }
    setSelectedTask(undefined);
    setIsTaskDialogOpen(false);
  };

  const handleDelete = (taskId: string) => {
    setTasks(tasks.filter(task => task.id !== taskId));
    setSelectedTasks(selectedTasks.filter(id => id !== taskId));
  };

  const handleBulkStatusChange = (status: Task['status']) => {
    setTasks(tasks.map(task => 
      selectedTasks.includes(task.id) ? { ...task, status } : task
    ));
    setSelectedTasks([]);
  };

  const handleBulkDelete = () => {
    setTasks(tasks.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  const toggleTaskSelection = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || task.category === categoryFilter;
    const matchesDueDate = !dueDateFilter || (() => {
      const today = new Date();
      const taskDate = new Date(task.dueDate);
      
      switch (dueDateFilter) {
        case 'today':
          return taskDate.toDateString() === today.toDateString();
        case 'week':
          const weekEnd = new Date(today);
          weekEnd.setDate(today.getDate() + 7);
          return taskDate <= weekEnd;
        case 'month':
          return taskDate.getMonth() === today.getMonth() && 
                 taskDate.getFullYear() === today.getFullYear();
        default:
          return true;
      }
    })();

    return matchesSearch && matchesCategory && matchesDueDate;
  });


  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white flex items-center justify-center sm:justify-start lg:justify-start pl-12 sm:pl-8 p-4">
        <div className="flex items-center justify-between w-full ">
          {/* Existing div with task content */}
          <div className="max-w-md w-full rounded-2xl p-8 text-left">
            <div className="flex items-center gap-3 mb-8">
              <ClipboardList className="h-10 w-10 text-purple-600" />
              <h1 className="text-3xl font-bold text-purple-900" style={{ fontFamily: 'Poppins' }}>
                TaskBuddy
              </h1>
            </div>
            <p className="text-left text-gray-600 mb-8" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>
              Streamline your workflow and track progress effortlessly with our all-in-one task management app.
            </p>
            <button
              onClick={signInWithGoogle}
              className="w-full flex items-center justify-center gap-3 px-6 py-3 bg-black text-white font-medium hover:bg-gray-20 transition-colors rounded-lg"
            >
              <svg className="h-5 w-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="#FBBC05"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                />
              </svg>
              Continue with Google
            </button>
          </div>
    
          {/* New div with image, hidden on mobile view */}
          <div className="hidden lg:block w-full max-w-[60%] flex-shrink-0">
            <img src="src/img.png" alt="TaskBuddy" className="w-full h-full object-cover rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }
  
  
  

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <Toaster position="top-right" />
      
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <ClipboardList className="h-8 w-8 text-600" />
              <h1 className="text-xl  font-semibold text-gray-900" style={{ fontFamily: 'Poppins', fontWeight: 400 }}>TaskBuddy</h1>
            </div>
            
            <div className="flex items-center gap-2">
              <button
                onClick={() => setView('list')}
                className={`px-4 py-1 text-sm font-medium rounded-md ${
                  view === 'list' ? 'bg-gray-900 text-white' : 'text-gray-600'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setView('board')}
                className={`px-4 py-1 text-sm font-medium rounded-md ${
                  view === 'board' ? 'bg-gray-900 text-white' : 'text-gray-600'
                }`}
                
              >
                Board
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4 w-full md:w-auto">
            <div className="flex items-center gap-2 w-full md:w-auto">
              <Dropdown
                label="Category"
                options={[
                  { label: 'Work', value: 'WORK' },
                  { label: 'Personal', value: 'PERSONAL' }
                ]}
                value={categoryFilter}
                onChange={setCategoryFilter}
              />
              <Dropdown
                label="Due Date"
                options={[
                  { label: 'Today', value: 'today' },
                  { label: 'This Week', value: 'week' },
                  { label: 'This Month', value: 'month' }
                ]}
                value={dueDateFilter}
                onChange={setDueDateFilter}
              />
            </div>

            <div className="relative flex-1 md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-8 py-1.5 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full"
                >
                  <X className="h-3 w-3 text-gray-400" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                onClick={() => setIsTaskDialogOpen(true)} 
                className="bg-purple-600 hover:bg-purple-700 whitespace-nowrap"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Task
              </Button>

              <Button
                variant="secondary"
                onClick={logout}
                className="whitespace-nowrap"
              >
                <LogOut className="h-4 w-4 mr-1" />
                Logout
              </Button>
            </div>
          </div>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={tasks.map(task => task.id)}>
            {filteredTasks.length === 0 ? (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-gray-100">
                  <Search className="h-6 w-6 text-gray-400" />
                </div>
                <h3 className="mt-4 text-lg font-medium text-gray-900">No tasks found</h3>
                <p className="mt-1 text-sm text-gray-500">
                  {searchQuery 
                    ? `We couldn't find any tasks matching "${searchQuery}"`
                    : 'Get started by creating your first task'}
                </p>
              </div>
            ) : (
              view === 'list' ? (
                <div className="space-y-6">
                  <TaskList
                    status="TO-DO"
                    tasks={filteredTasks.filter(task => task.status === 'TO-DO')}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedTasks={selectedTasks}
                    onToggleSelect={toggleTaskSelection}
                  />
                  <TaskList
                    status="IN-PROGRESS"
                    tasks={filteredTasks.filter(task => task.status === 'IN-PROGRESS')}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedTasks={selectedTasks}
                    onToggleSelect={toggleTaskSelection}
                  />
                  <TaskList
                    status="COMPLETED"
                    tasks={filteredTasks.filter(task => task.status === 'COMPLETED')}
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                    selectedTasks={selectedTasks}
                    onToggleSelect={toggleTaskSelection}
                  />
                </div>
              ) : (
                <TaskBoard
                  tasks={filteredTasks}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                  selectedTasks={selectedTasks}
                  onToggleSelect={toggleTaskSelection}
                />
              )
            )}
          </SortableContext>
        </DndContext>
      </div>

      <TaskDialog
        isOpen={isTaskDialogOpen}
        onClose={() => {
          setIsTaskDialogOpen(false);
          setSelectedTask(undefined);
        }}
        onSubmit={handleSubmit}
        initialData={selectedTask}
      />

      {selectedTasks.length > 0 && (
        <MultiSelectActions
          selectedCount={selectedTasks.length}
          onClear={() => setSelectedTasks([])}
          onStatusChange={handleBulkStatusChange}
          onDelete={handleBulkDelete}
        />
      )}
    </div>
  );
}

export default App;