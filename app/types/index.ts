export interface Board {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
  tasks: Task[];
}

export interface Task {
  id: string;
  name: string;
  description?: string;
  status: 'inactive' | 'warning' | 'critical';
  lastInteraction: Date;
  lastStatusChange: Date;
  iconName?: string;
  iconLibrary?: 'fa' | 'md' | 'io' | 'bi' | 'hi';
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
  tasks: Task[];
  statusChangeLogs: StatusChangeLog[];
  defaultTaskSettings?: {
    warningHours: number;
    criticalHours: number;
    defaultStatus: Task['status'];
    defaultIconName?: string;
    defaultIconLibrary?: string;
  };
} 