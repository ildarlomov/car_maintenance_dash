"use client";

import React, { useState } from 'react';
import { useSwipeable } from 'react-swipeable';
import { Layout } from '@/app/components/layout/Layout';
import { Header } from '@/app/components/layout/Header';
import { BoardCard } from '@/app/components/boards/BoardCard';
import { BoardModal } from '@/app/components/boards/BoardModal';
import { Button } from '@/app/components/ui/Button';
import { Input } from '@/app/components/ui/Input';
import { useAppState } from '@/app/utils/hooks';
import { hapticFeedback } from '@/app/utils/telegram';
import { showConfirmationDialog } from '@/app/utils/notifications';
import { calculateSystemHealthScore } from '@/app/utils/analytics';
import { createInitialBoards, createInitialTasks } from '@/app/utils/initialData';
import { Board, Task } from '@/app/types';
import { TaskModal } from '@/app/components/tasks/TaskModal';
import { Board as BoardComponent } from '@/app/components/boards/Board';

const formatTime = () => {
  return new Date().toLocaleTimeString('en-US', {
    hour12: false,
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit'
  });
};

export default function Dashboard() {
  const { state, setState, isLoading, createBoard, updateBoard, deleteBoard, createTask, updateTask, deleteTask } = useAppState();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isBoardModalOpen, setIsBoardModalOpen] = React.useState(false);
  const [editingBoard, setEditingBoard] = React.useState<Board | undefined>();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [selectedBoardId, setSelectedBoardId] = React.useState<string | null>(null);
  const [currentBoardIndex, setCurrentBoardIndex] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [editingBoardName, setEditingBoardName] = useState('');

  const systemHealthScore = React.useMemo(() => {
    if (!state?.boards) return 100;
    const allTasks = state.boards.flatMap(board => board.tasks);
    return calculateSystemHealthScore(allTasks);
  }, [state?.boards]);

  const filteredBoards = React.useMemo(() => {
    if (!state?.boards) return [];
    if (!searchTerm) return state.boards;
    return state.boards.filter((board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [state?.boards, searchTerm]);

  const handlers = useSwipeable({
    onSwipedLeft: () => {
      if (currentBoardIndex < state.boards.length - 1) {
        setCurrentBoardIndex(prev => prev + 1);
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }
    },
    onSwipedRight: () => {
      if (currentBoardIndex > 0) {
        setCurrentBoardIndex(prev => prev - 1);
        if (typeof window !== 'undefined' && window.navigator.vibrate) {
          window.navigator.vibrate(50);
        }
      }
    },
    preventScrollOnSwipe: true,
    trackMouse: true,
  });

  const handleCreateBoard = () => {
    hapticFeedback.medium();
    setEditingBoard(undefined);
    setIsBoardModalOpen(true);
  };

  const handleEditBoard = (boardId: string, currentName: string) => {
    hapticFeedback.light();
    setIsEditing(true);
    setEditingBoardName(currentName);
  };

  const handleDeleteBoard = async (boardId: string) => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete this board? All tasks will be deleted as well.'
    );
    if (confirmed && state) {
      deleteBoard(boardId);
      if (currentBoardIndex >= state.boards.length - 1) {
        setCurrentBoardIndex(Math.max(0, state.boards.length - 2));
      }
    }
  };

  const handleAddTask = (boardId: string) => {
    hapticFeedback.medium();
    setSelectedBoardId(boardId);
    setIsTaskModalOpen(true);
  };

  const handleResetData = async () => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to reset all data? This action cannot be undone.'
    );
    if (confirmed && state) {
      const initialBoards = createInitialBoards();
      setState({
        ...state,
        boards: initialBoards,
        tasks: createInitialTasks(initialBoards),
        statusChangeLogs: [],
      });
    }
  };

  const handleBoardSubmit = (boardData: Omit<Board, 'id' | 'createdAt'>) => {
    if (!state) return;

    const now = new Date();
    if (editingBoard) {
      // Update existing board
      const updatedBoards = state.boards.map((b) =>
        b.id === editingBoard.id
          ? {
              ...b,
              ...boardData,
            }
          : b
      );

      setState({
        ...state,
        boards: updatedBoards,
      });
    } else {
      // Create new board
      const newBoard: Board = {
        ...boardData,
        id: crypto.randomUUID(),
        createdAt: now.getTime(),
        tasks: [], // Initialize empty tasks array
      };

      setState({
        ...state,
        boards: [...state.boards, newBoard],
      });
    }
  };

  const handleTaskSubmit = (taskData: Partial<Task>) => {
    if (!state || !selectedBoardId) return;

    const now = new Date();
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: now.getTime(),
      lastInteraction: now.getTime(),
      lastStatusChange: now.getTime(),
      status: taskData.status || 'active',
      boardId: selectedBoardId,
    } as Task;

    setState({
      ...state,
      tasks: [...state.tasks, newTask],
    });
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!state) return;

    const now = new Date();
    const updatedTasks = state.tasks.map((task) =>
      task.id === taskId
        ? {
            ...task,
            status: newStatus,
            lastInteraction: now.getTime(),
            lastStatusChange: now.getTime(),
          }
        : task
    );

    setState({
      ...state,
      tasks: updatedTasks,
      statusChangeLogs: [
        ...state.statusChangeLogs,
        {
          id: crypto.randomUUID(),
          taskId,
          taskName: state.tasks.find(t => t.id === taskId)?.title || '',
          oldStatus: state.tasks.find(t => t.id === taskId)?.status || 'active',
          newStatus,
          timestamp: now.getTime(),
          userId: 'USER',
        },
      ],
    });
  };

  const handleTaskEdit = (taskId: string) => {
    hapticFeedback.light();
    const task = state?.tasks.find((t) => t.id === taskId);
    if (task) {
      setSelectedBoardId(task.boardId);
      setIsTaskModalOpen(true);
    }
  };

  const handleTaskDelete = async (taskId: string) => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete this task?'
    );
    if (confirmed && state) {
      setState({
        ...state,
        tasks: state.tasks.filter((task) => task.id !== taskId),
      });
    }
  };

  const handleAddBoard = () => {
    hapticFeedback.medium();
    const name = prompt('Enter board name:');
    if (name) {
      createBoard(name);
      setCurrentBoardIndex(state.boards.length);
    }
  };

  const handleSaveBoardName = (boardId: string) => {
    if (editingBoardName.trim()) {
      updateBoard(boardId, { name: editingBoardName.trim() });
    }
    setIsEditing(false);
    setEditingBoardName('');
  };

  const currentBoard = state.boards[currentBoardIndex];

  if (isLoading) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          Loading...
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Header
        title="Car Maintenance"
        currentTime={formatTime()}
        onAddBoard={handleAddBoard}
      />
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setCurrentBoardIndex(prev => Math.max(0, prev - 1))}
              disabled={currentBoardIndex === 0}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50"
            >
              ←
            </button>
            <span className="text-lg font-medium">
              {currentBoardIndex + 1} / {state.boards.length}
            </span>
            <button
              onClick={() => setCurrentBoardIndex(prev => Math.min(state.boards.length - 1, prev + 1))}
              disabled={currentBoardIndex === state.boards.length - 1}
              className="p-2 rounded-full bg-white shadow hover:bg-gray-50 disabled:opacity-50"
            >
              →
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleEditBoard(state.boards[currentBoardIndex].id, state.boards[currentBoardIndex].name)}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteBoard(state.boards[currentBoardIndex].id)}
              className="px-4 py-2 text-red-600 hover:text-red-800"
            >
              Delete
            </button>
          </div>
        </div>
        <div {...handlers} className="relative">
          <div className="flex transition-transform duration-300 ease-in-out" style={{ transform: `translateX(-${currentBoardIndex * 100}%)` }}>
            {state.boards.map((board, index) => (
              <div key={board.id} className="w-full flex-shrink-0 px-4">
                {isEditing && index === currentBoardIndex ? (
                  <div className="flex items-center gap-2 mb-4">
                    <input
                      type="text"
                      value={editingBoardName}
                      onChange={(e) => setEditingBoardName(e.target.value)}
                      className="flex-1 px-3 py-2 border rounded-md"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveBoardName(board.id)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => {
                        setIsEditing(false);
                        setEditingBoardName('');
                      }}
                      className="px-4 py-2 text-gray-600 hover:text-gray-800"
                    >
                      Cancel
                    </button>
                  </div>
                ) : null}
                <BoardComponent
                  board={board}
                  onTaskUpdate={updateTask}
                  onTaskDelete={(taskId) => deleteTask(board.id, taskId)}
                  onTaskCreate={createTask}
                />
              </div>
            ))}
          </div>
        </div>
      </main>

      <BoardModal
        isOpen={isBoardModalOpen}
        onClose={() => setIsBoardModalOpen(false)}
        board={editingBoard}
        onSubmit={handleBoardSubmit}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        boardId={selectedBoardId || ''}
        onSubmit={handleTaskSubmit}
      />
    </Layout>
  );
}
