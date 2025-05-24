import React from 'react';
import { Task } from '../../types';
import { Card, CardHeader, CardContent, CardFooter } from '../ui/Card';
import { Button } from '../ui/Button';
import { getRelativeTimeString } from '../../utils/date';
import { calculateTaskHealthScore } from '../../utils/analytics';
import { hapticFeedback } from '../../utils/telegram';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: Task['status']) => void;
  onEdit: (taskId: string) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({
  task,
  onStatusChange,
  onEdit,
  onDelete,
}) => {
  const healthScore = calculateTaskHealthScore(task);
  const timeSinceLastInteraction = getRelativeTimeString(new Date(task.lastInteraction));

  const getStatusColor = () => {
    switch (task.status) {
      case 'INACTIVE':
        return '#9E9E9E';
      case 'WARNING':
        return '#FF9800';
      case 'CRITICAL':
        return '#F44336';
      default:
        return '#2196F3';
    }
  };

  const getHealthColor = () => {
    if (healthScore >= 80) return '#4CAF50';
    if (healthScore >= 50) return '#FF9800';
    return '#F44336';
  };

  const handleStatusChange = (newStatus: Task['status']) => {
    hapticFeedback.medium();
    onStatusChange(task.id, newStatus);
  };

  const handleEdit = () => {
    hapticFeedback.light();
    onEdit(task.id);
  };

  const handleDelete = () => {
    hapticFeedback.heavy();
    onDelete(task.id);
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
          <h3
            style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 600,
            }}
          >
            {task.name}
          </h3>
          <div
            style={{
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              backgroundColor: getStatusColor(),
            }}
          />
        </div>
      </CardHeader>
      <CardContent>
        {task.description && (
          <p
            style={{
              margin: '0 0 16px 0',
              color: '#666666',
              fontSize: '14px',
            }}
          >
            {task.description}
          </p>
        )}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
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
              Last interaction:
            </span>
            <span style={{ color: '#000000', fontSize: '14px' }}>
              {timeSinceLastInteraction}
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
              Health score:
            </span>
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
        </div>
      </CardContent>
      <CardFooter>
        <Button
          variant="primary"
          size="small"
          onClick={() => handleStatusChange('INACTIVE')}
          disabled={task.status === 'INACTIVE'}
        >
          Mark Inactive
        </Button>
        <Button
          variant="warning"
          size="small"
          onClick={() => handleStatusChange('WARNING')}
          disabled={task.status === 'WARNING'}
        >
          Mark Warning
        </Button>
        <Button
          variant="error"
          size="small"
          onClick={() => handleStatusChange('CRITICAL')}
          disabled={task.status === 'CRITICAL'}
        >
          Mark Critical
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