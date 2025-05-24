import React from 'react';
import { Task, TaskStatus } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';
import { validateTask } from '../../utils/validation';
import { hapticFeedback } from '../../utils/telegram';

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
  const [description, setDescription] = React.useState(task?.description || '');
  const [iconName, setIconName] = React.useState(task?.iconName || '');
  const [iconLibrary, setIconLibrary] = React.useState(task?.iconLibrary || '');
  const [warningHours, setWarningHours] = React.useState(task?.warningHours || 24);
  const [criticalHours, setCriticalHours] = React.useState(task?.criticalHours || 48);
  const [status, setStatus] = React.useState<TaskStatus>(task?.status || 'INACTIVE');
  const [isActive, setIsActive] = React.useState(task?.isActive ?? true);
  const [errors, setErrors] = React.useState<Record<string, string>>({});

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback.medium();

    const taskData = {
      name,
      description,
      iconName,
      iconLibrary,
      boardId,
      warningHours,
      criticalHours,
      status,
      isActive,
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
      <Input
        label="Description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        error={errors.description}
      />
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '16px',
        }}
      >
        <Input
          label="Icon Name"
          value={iconName}
          onChange={(e) => setIconName(e.target.value)}
          error={errors.iconName}
          required
        />
        <Input
          label="Icon Library"
          value={iconLibrary}
          onChange={(e) => setIconLibrary(e.target.value)}
          error={errors.iconLibrary}
          required
        />
      </div>
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
            variant={status === 'INACTIVE' ? 'primary' : 'secondary'}
            onClick={() => setStatus('INACTIVE')}
          >
            Inactive
          </Button>
          <Button
            type="button"
            variant={status === 'WARNING' ? 'warning' : 'secondary'}
            onClick={() => setStatus('WARNING')}
          >
            Warning
          </Button>
          <Button
            type="button"
            variant={status === 'CRITICAL' ? 'error' : 'secondary'}
            onClick={() => setStatus('CRITICAL')}
          >
            Critical
          </Button>
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <input
          type="checkbox"
          id="isActive"
          checked={isActive}
          onChange={(e) => setIsActive(e.target.checked)}
          style={{
            width: '16px',
            height: '16px',
          }}
        />
        <label
          htmlFor="isActive"
          style={{
            fontSize: '14px',
            color: '#666666',
          }}
        >
          Active
        </label>
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