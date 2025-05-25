export type IconLibrary = 'fa' | 'md' | 'io' | 'bi' | 'hi';

export type TaskStatus = 'active' | 'warning' | 'critical' | 'completed';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  boardId: string;
  createdAt: number;
  lastInteraction: number;
  lastStatusChange: number;
  warningHours: number;
  criticalHours: number;
  iconLibrary: IconLibrary;
  iconName: string;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
  order: number;
  createdAt: number;
}

export interface StatusChangeLog {
  id: string;
  taskId: string;
  taskName: string;
  oldStatus: Task['status'];
  newStatus: Task['status'];
  timestamp: number;
  userId?: string;
}

export interface AppState {
  boards: Board[];
  currentTime: number;
  tasks: Task[];
  statusChangeLogs: StatusChangeLog[];
} 