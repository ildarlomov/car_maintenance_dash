import React from 'react';
import { Task } from '../../types';
import { Modal } from '../ui/Modal';
import { TaskForm } from './TaskForm';
import { hapticFeedback } from '../../utils/telegram';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  boardId: string;
  task?: Task;
  onSubmit: (task: Omit<Task, 'id' | 'createdAt' | 'lastStatusChange' | 'lastInteraction'>) => void;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  boardId,
  task,
  onSubmit,
}) => {
  const handleClose = () => {
    hapticFeedback.light();
    onClose();
  };

  const handleSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'lastStatusChange' | 'lastInteraction'>) => {
    hapticFeedback.medium();
    onSubmit(taskData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={task ? 'Edit Task' : 'Create Task'}
    >
      <TaskForm
        boardId={boardId}
        task={task}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}; 