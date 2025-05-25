import React from 'react';
import { Board, Task } from '@/app/types';
import { Card, CardHeader, CardContent, CardFooter } from '@/app/components/ui/Card';
import { Button } from '@/app/components/ui/Button';
import { calculateBoardHealthScore } from '@/app/utils/analytics';
import { hapticFeedback } from '@/app/utils/telegram';
import { TaskCard } from '../tasks/TaskCard';

interface BoardCardProps {
  board: Board;
  tasks: Task[];
  onEdit: (boardId: string) => void;
  onDelete: (boardId: string) => void;
  onAddTask: (boardId: string) => void;
  onTaskStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onTaskEdit?: (taskId: string) => void;
  onTaskDelete?: (taskId: string) => void;
}

export const BoardCard: React.FC<BoardCardProps> = ({
  board,
  tasks,
  onEdit,
  onDelete,
  onAddTask,
  onTaskStatusChange,
  onTaskEdit,
  onTaskDelete,
}) => {
  const boardTasks = tasks.filter(task => task.boardId === board.id);
  const healthScore = calculateBoardHealthScore(boardTasks);

  const getHealthColor = () => {
    if (healthScore >= 80) return '#4CAF50';
    if (healthScore >= 50) return '#FF9800';
    return '#F44336';
  };

  const handleEdit = () => {
    hapticFeedback.light();
    onEdit(board.id);
  };

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete(board.id);
  };

  const handleAddTask = () => {
    hapticFeedback.medium();
    onAddTask(board.id);
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h2
            style={{
              margin: 0,
              fontSize: '24px',
              fontWeight: 600,
            }}
          >
            {board.name}
          </h2>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
            }}
          >
            <div
              style={{
                width: '60px',
                height: '4px',
                backgroundColor: '#E0E0E0',
                borderRadius: '2px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${healthScore}%`,
                  height: '100%',
                  backgroundColor: getHealthColor(),
                  transition: 'width 0.3s ease-in-out',
                }}
              />
            </div>
            <span
              style={{
                color: getHealthColor(),
                fontSize: '14px',
                fontWeight: 600,
              }}
            >
              {healthScore}%
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#666666', fontSize: '14px' }}>
              Total tasks:
            </span>
            <span style={{ color: '#000000', fontSize: '14px', fontWeight: 600 }}>
              {boardTasks.length}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#666666', fontSize: '14px' }}>
              Active tasks:
            </span>
            <span style={{ color: '#000000', fontSize: '14px', fontWeight: 600 }}>
              {boardTasks.filter((task) => task.status !== 'inactive').length}
            </span>
          </div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <span style={{ color: '#666666', fontSize: '14px' }}>
              Created:
            </span>
            <span style={{ color: '#000000', fontSize: '14px' }}>
              {new Date(board.createdAt).toLocaleDateString()}
            </span>
          </div>
          {boardTasks.length > 0 && (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              {boardTasks.map((task) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onStatusChange={onTaskStatusChange}
                  onEdit={onTaskEdit}
                  onDelete={onTaskDelete}
                />
              ))}
            </div>
          )}
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          size="small"
          onClick={handleAddTask}
        >
          Add Task
        </Button>
        <Button
          variant="secondary"
          size="small"
          onClick={handleEdit}
        >
          Edit
        </Button>
        <Button
          variant="error"
          size="small"
          onClick={handleDelete}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}; 