import React, { useState, useRef, useEffect } from 'react';
import { Board as BoardType, Task } from '../../types';
import { TaskCard } from '../tasks/TaskCard';
import { TaskModal } from '../tasks/TaskModal';

interface BoardProps {
  board: BoardType;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (taskId: string) => void;
  onTaskCreate: (task: Partial<Task>) => void;
}

export const Board: React.FC<BoardProps> = ({
  board,
  onTaskUpdate,
  onTaskDelete,
  onTaskCreate,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>();
  const [modalPosition, setModalPosition] = useState<{ x: number; y: number } | undefined>();
  const boardRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleTaskClick = (taskId: string) => {
    const task = board.tasks.find(t => t.id === taskId);
    if (task) {
      setIsModalOpen(true);
      setEditingTask(task);
    }
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = board.tasks.find(t => t.id === taskId);
    if (task) {
      onTaskUpdate({ ...task, status: newStatus });
    }
  };

  const handleTaskLongPress = (task: Task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setEditingTask(undefined);
    setModalPosition(undefined);
  };

  const handleModalSubmit = (task: Partial<Task>) => {
    if (editingTask) {
      onTaskUpdate({
        ...editingTask,
        ...task,
      });
    } else {
      onTaskCreate({
        ...task,
        id: Date.now().toString(),
        createdAt: Date.now(),
        lastInteraction: Date.now(),
        status: 'active',
      });
    }
    handleModalClose();
  };

  const handleAddTask = () => {
    if (boardRef.current && mounted) {
      const rect = boardRef.current.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.scrollY || window.pageYOffset;
      
      setModalPosition({
        x: rect.left + rect.width / 2 + scrollX,
        y: rect.top + rect.height / 2 + scrollY,
      });
    }
    setIsModalOpen(true);
  };

  if (!mounted) return null;

  return (
    <div className="flex-1 min-w-0" ref={boardRef}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold">{board.name}</h2>
        <button
          onClick={handleAddTask}
          className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
        >
          Add Task
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {board.tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onStatusChange={handleTaskStatusChange}
            onEdit={handleTaskClick}
            onDelete={onTaskDelete}
          />
        ))}
      </div>
      <TaskModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        onSubmit={handleModalSubmit}
        task={editingTask}
        boardId={board.id}
        position={modalPosition}
      />
    </div>
  );
}; 