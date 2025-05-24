import React from 'react';
import { Board } from '../../types';
import { Modal } from '../ui/Modal';
import { BoardForm } from './BoardForm';
import { hapticFeedback } from '../../utils/telegram';

interface BoardModalProps {
  isOpen: boolean;
  onClose: () => void;
  board?: Board;
  onSubmit: (boardData: Omit<Board, 'id' | 'createdAt'>) => void;
}

export const BoardModal: React.FC<BoardModalProps> = ({
  isOpen,
  onClose,
  board,
  onSubmit,
}) => {
  const handleClose = () => {
    hapticFeedback.light();
    onClose();
  };

  const handleSubmit = (boardData: Omit<Board, 'id' | 'createdAt'>) => {
    hapticFeedback.medium();
    onSubmit(boardData);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title={board ? 'Edit Board' : 'Create Board'}
    >
      <BoardForm
        board={board}
        onSubmit={handleSubmit}
        onCancel={handleClose}
      />
    </Modal>
  );
}; 