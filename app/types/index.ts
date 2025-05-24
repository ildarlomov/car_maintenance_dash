export interface Board {
  id: string;
  name: string;
  order: number;
  createdAt: Date;
}

export interface Task {
  id: string;
  boardId: string;
  name: string;
  description: string;
  status: 'inactive' | 'warning' | 'critical';
  warningHours: number;
  criticalHours: number;
  lastInteraction: Date;
  createdAt: Date;
  iconName?: string;
  iconLibrary?: string;
}

export interface StatusChangeLog {
  id: string;
  taskId: string;
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