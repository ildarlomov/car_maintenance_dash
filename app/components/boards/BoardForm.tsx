import React from 'react';
import { Board } from '../../types';
import { Input } from '../ui/Input';
import { Button } from '../ui/Button';

interface BoardFormProps {
  board?: Board;
  onSubmit: (boardData: Omit<Board, 'id' | 'createdAt'>) => void;
  onCancel: () => void;
}

export const BoardForm: React.FC<BoardFormProps> = ({
  board,
  onSubmit,
  onCancel,
}) => {
  const [name, setName] = React.useState(board?.name || '');
  const [error, setError] = React.useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Board name is required');
      return;
    }
    onSubmit({
      name: name.trim(),
      order: board?.order || 0,
      tasks: [],
    });
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
        label="Board Name"
        value={name}
        onChange={(e) => {
          setName(e.target.value);
          setError('');
        }}
        error={error}
        autoFocus
      />

      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '8px',
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
          {board ? 'Save Changes' : 'Create Board'}
        </Button>
      </div>
    </form>
  );
}; 