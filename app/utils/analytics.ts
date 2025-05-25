import { Task, Board, StatusChangeLog } from '../types';

interface TaskStatistics {
  total: number;
  active: number;
  inactive: number;
  byStatus: Record<string, number>;
  averageWarningHours: number;
  averageCriticalHours: number;
  averageTimeToWarning: number;
  averageTimeToCritical: number;
}

interface BoardStatistics {
  total: number;
  totalTasks: number;
  averageTasksPerBoard: number;
  mostActiveBoard: {
    id: string;
    name: string;
    taskCount: number;
  };
  leastActiveBoard: {
    id: string;
    name: string;
    taskCount: number;
  };
}

interface StatusChangeStatistics {
  total: number;
  byStatus: Record<string, number>;
  byChangeType: {
    user: number;
    automatic: number;
  };
  averageTimeBetweenChanges: number;
  mostFrequentChanges: {
    taskId: string;
    taskName: string;
    count: number;
  }[];
}

export const calculateTaskStatistics = (tasks: Task[]): TaskStatistics => {
  const byStatus = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const activeTasks = tasks.filter((task) => task.status === 'active');

  const totalWarningHours = tasks.reduce((sum, task) => sum + task.warningHours, 0);
  const totalCriticalHours = tasks.reduce((sum, task) => sum + task.criticalHours, 0);

  const timeToWarning = tasks.map((task) => {
    const lastInteraction = new Date(task.lastInteraction);
    const warningTime = new Date(lastInteraction.getTime() + task.warningHours * 60 * 60 * 1000);
    return warningTime.getTime() - lastInteraction.getTime();
  });

  const timeToCritical = tasks.map((task) => {
    const lastInteraction = new Date(task.lastInteraction);
    const criticalTime = new Date(lastInteraction.getTime() + task.criticalHours * 60 * 60 * 1000);
    return criticalTime.getTime() - lastInteraction.getTime();
  });

  return {
    total: tasks.length,
    active: activeTasks.length,
    inactive: tasks.length - activeTasks.length,
    byStatus,
    averageWarningHours: totalWarningHours / tasks.length,
    averageCriticalHours: totalCriticalHours / tasks.length,
    averageTimeToWarning: timeToWarning.reduce((sum, time) => sum + time, 0) / timeToWarning.length,
    averageTimeToCritical: timeToCritical.reduce((sum, time) => sum + time, 0) / timeToCritical.length,
  };
};

export const calculateBoardStatistics = (boards: Board[], tasks: Task[]): BoardStatistics => {
  const totalTasks = tasks.length;

  const boardActivity = boards.map((board) => ({
    id: board.id,
    name: board.name,
    taskCount: tasks.filter(task => task.boardId === board.id).length,
  }));

  const sortedBoards = [...boardActivity].sort((a, b) => b.taskCount - a.taskCount);

  return {
    total: boards.length,
    totalTasks,
    averageTasksPerBoard: totalTasks / boards.length,
    mostActiveBoard: sortedBoards[0],
    leastActiveBoard: sortedBoards[sortedBoards.length - 1],
  };
};

export const calculateStatusChangeStatistics = (
  logs: StatusChangeLog[],
  tasks: Task[]
): StatusChangeStatistics => {
  const byStatus = logs.reduce((acc, log) => {
    acc[log.newStatus] = (acc[log.newStatus] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const byChangeType = {
    user: logs.filter(log => log.userId).length,
    automatic: logs.filter(log => !log.userId).length
  };

  const timeBetweenChanges = logs
    .sort((a, b) => a.timestamp - b.timestamp)
    .map((log, index, array) => {
      if (index === 0) return 0;
      return log.timestamp - array[index - 1].timestamp;
    })
    .filter((time) => time > 0);

  const taskChangeCounts = logs.reduce((acc, log) => {
    acc[log.taskId] = (acc[log.taskId] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const mostFrequentChanges = Object.entries(taskChangeCounts)
    .map(([taskId, count]) => {
      const task = tasks.find((t) => t.id === taskId);
      return {
        taskId,
        taskName: task?.title || 'Unknown',
        count,
      };
    })
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);

  return {
    total: logs.length,
    byStatus,
    byChangeType,
    averageTimeBetweenChanges:
      timeBetweenChanges.reduce((sum, time) => sum + time, 0) / timeBetweenChanges.length,
    mostFrequentChanges,
  };
};

export const calculateTaskHealthScore = (task: Task): number => {
  const now = new Date().getTime();
  const hoursSinceLastInteraction = (now - task.lastInteraction) / (1000 * 60 * 60);

  if (task.status === 'completed') return 100;
  if (task.status === 'critical') return 0;
  if (task.status === 'warning') return 50;
  if (hoursSinceLastInteraction >= task.criticalHours) return 0;
  if (hoursSinceLastInteraction >= task.warningHours) return 50;
  return 100;
};

export const calculateBoardHealthScore = (tasks: Task[]): number => {
  if (tasks.length === 0) return 100;

  const taskScores: number[] = tasks.map(calculateTaskHealthScore);
  return taskScores.reduce((sum, score) => sum + score, 0) / tasks.length;
};

export const calculateSystemHealthScore = (tasks: Task[]): number => {
  if (!tasks.length) return 100;

  const now = new Date().getTime();
  const taskScores: number[] = tasks.map((task) => {
    const hoursSinceLastInteraction = (now - task.lastInteraction) / (1000 * 60 * 60);
    
    if (task.status === 'critical') return 0;
    if (task.status === 'warning') return 50;
    if (hoursSinceLastInteraction >= task.criticalHours) return 0;
    if (hoursSinceLastInteraction >= task.warningHours) return 50;
    return 100;
  });

  return Math.floor(taskScores.reduce((sum, score) => sum + score, 0) / tasks.length);
}; 