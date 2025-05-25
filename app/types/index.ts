export type IconLibrary = 'fa' | 'md' | 'io' | 'bi' | 'hi';

export interface Task {
  id: string;
  title: string;
  description: string;
  status: 'active' | 'warning' | 'critical' | 'completed';
  boardId: string;
  createdAt: number;
  lastInteraction: number;
  warningHours: number;
  criticalHours: number;
  iconLibrary: IconLibrary;
  iconName: string;
}

export interface Board {
  id: string;
  name: string;
  tasks: Task[];
}

export interface StatusChangeLog {
  id: string;
  taskId: string;
  taskName: string;
  oldStatus: Task['status'];
  newStatus: Task['status'];
  timestamp: Date;
  userId?: string;
}

export interface AppState {
  boards: Board[];
  currentTime: number;
} 