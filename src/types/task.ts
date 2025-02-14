export type TaskStatus = 'TO-DO' | 'IN-PROGRESS' | 'COMPLETED';
export type TaskCategory = 'WORK' | 'PERSONAL';

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: TaskStatus;
  category: TaskCategory;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
  userId: string;
  attachments?: {
    name: string;
    url: string;
  }[];
  order: number;
}

export interface TaskActivity {
  id: string;
  taskId: string;
  type: 'CREATE' | 'UPDATE' | 'DELETE' | 'STATUS_CHANGE' | 'ATTACHMENT_ADDED' | 'ATTACHMENT_REMOVED';
  timestamp: Date;
  userId: string;
  details: {
    before?: Partial<Task>;
    after?: Partial<Task>;
  };
}