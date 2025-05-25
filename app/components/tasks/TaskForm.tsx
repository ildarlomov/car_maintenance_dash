import React from 'react';
import { Task } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateTask } from '../../utils/validation';
import { hapticFeedback } from '../../utils/telegram';
import { FaCar } from 'react-icons/fa';

interface TaskFormProps {
  boardId: string;
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'lastStatusChange' | 'lastInteraction'>) => void;
  onCancel: () => void;
}

export const TaskForm: React.FC<TaskFormProps> = ({
  boardId,
  task,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = React.useState(task?.name || '');
  const [warningHours, setWarningHours] = React.useState(task?.warningHours || 24);
  const [criticalHours, setCriticalHours] = React.useState(task?.criticalHours || 48);
  const [status, setStatus] = React.useState<Task['status']>(task?.status || 'inactive');
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback.medium();

    const taskData = {
      name,
      description: '', // Empty description as it's no longer needed
      iconName: 'FaCar',
      iconLibrary: 'fa',
      boardId,
      warningHours,
      criticalHours,
      status,
    };

    const validationErrors = validateTask(taskData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    onSubmit(taskData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
      }}
    >
      <Input
        label="Task Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        error={errors.name}
        required
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <Input
          label="Warning Hours"
          type="number"
          value={warningHours}
          onChange={(e) => setWarningHours(Number(e.target.value))}
          error={errors.warningHours}
          required
          min={1}
        />
        <Input
          label="Critical Hours"
          type="number"
          value={criticalHours}
          onChange={(e) => setCriticalHours(Number(e.target.value))}
          error={errors.criticalHours}
          required
          min={1}
        />
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        <label
          style={{
            fontSize: '14px',
            color: '#666666',
          }}
        >
          Status
        </label>
        <div
          style={{
            display: 'flex',
            gap: '8px',
          }}
        >
          <Button
            type="button"
            variant={status === 'inactive' ? 'primary' : 'secondary'}
            onClick={() => setStatus('inactive')}
          >
            Inactive
          </Button>
          <Button
            type="button"
            variant={status === 'warning' ? 'warning' : 'secondary'}
            onClick={() => setStatus('warning')}
          >
            Warning
          </Button>
          <Button
            type="button"
            variant={status === 'critical' ? 'error' : 'secondary'}
            onClick={() => setStatus('critical')}
          >
            Critical
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
          marginTop: '16px',
        }}
      >
        <Button
          type="button"
          variant="secondary"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
        >
          {task ? 'Save Changes' : 'Create Task'}
        </Button>
      </div>
    </form>
  );
}; 