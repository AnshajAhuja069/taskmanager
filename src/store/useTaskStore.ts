import { create } from 'zustand';
import { Task, TaskStatus } from '../types/task';

interface TaskState {
  tasks: Task[];
  selectedTasks: string[];
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  deleteTask: (taskId: string) => void;
  toggleTaskSelection: (taskId: string) => void;
  clearSelectedTasks: () => void;
  updateTasksOrder: (tasks: Task[]) => void;
}

export const useTaskStore = create<TaskState>((set) => ({
  tasks: [],
  selectedTasks: [],
  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((task) =>
        task.id === taskId ? { ...task, ...updates } : task
      ),
    })),
  deleteTask: (taskId) =>
    set((state) => ({
      tasks: state.tasks.filter((task) => task.id !== taskId),
      selectedTasks: state.selectedTasks.filter((id) => id !== taskId),
    })),
  toggleTaskSelection: (taskId) =>
    set((state) => ({
      selectedTasks: state.selectedTasks.includes(taskId)
        ? state.selectedTasks.filter((id) => id !== taskId)
        : [...state.selectedTasks, taskId],
    })),
  clearSelectedTasks: () => set({ selectedTasks: [] }),
  updateTasksOrder: (tasks) => set({ tasks }),
}));