import React from 'react';
import { Task, IconLibrary } from '../../types';
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
  const [title, setTitle] = React.useState(task?.title || '');
  const [warningHours, setWarningHours] = React.useState(task?.warningHours || 24);
  const [criticalHours, setCriticalHours] = React.useState(task?.criticalHours || 48);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback.medium();

    const taskData = {
      title,
      description: '', // Empty description as it's no longer needed
      iconName: 'FaCar',
      iconLibrary: 'fa' as IconLibrary,
      boardId,
      warningHours,
      criticalHours,
      status: 'active' as const,
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
        label="Task Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        error={errors.title}
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