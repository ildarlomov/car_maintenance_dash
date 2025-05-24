import React from 'react';
import { Layout } from '../components/layout/Layout';
import { BoardCard } from '../components/boards/BoardCard';
import { BoardModal } from '../components/boards/BoardModal';
import { Button } from '../components/ui/Button';
import { Input } from '../components/ui/Input';
import { useAppState } from '../utils/hooks';
import { hapticFeedback } from '../utils/telegram';
import { showConfirmationDialog } from '../utils/notifications';
import { calculateSystemHealthScore } from '../utils/analytics';
import { Board } from '../types';

export default function Dashboard() {
  const { state, setState, isLoading } = useAppState();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isBoardModalOpen, setIsBoardModalOpen] = React.useState(false);
  const [editingBoard, setEditingBoard] = React.useState<Board | undefined>();

  const systemHealthScore = React.useMemo(() => {
    if (!state?.boards) return 100;
    return calculateSystemHealthScore(state.boards);
  }, [state?.boards]);

  const filteredBoards = React.useMemo(() => {
    if (!state?.boards) return [];
    if (!searchTerm) return state.boards;
    return state.boards.filter((board) =>
      board.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [state?.boards, searchTerm]);

  const handleCreateBoard = () => {
    hapticFeedback.medium();
    setEditingBoard(undefined);
    setIsBoardModalOpen(true);
  };

  const handleEditBoard = (boardId: string) => {
    hapticFeedback.light();
    const board = state?.boards.find((b) => b.id === boardId);
    if (board) {
      setEditingBoard(board);
      setIsBoardModalOpen(true);
    }
  };

  const handleDeleteBoard = async (boardId: string) => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete this board? All tasks will be deleted as well.'
    );
    if (confirmed && state) {
      const updatedBoards = state.boards.filter((board) => board.id !== boardId);
      setState({
        ...state,
        boards: updatedBoards,
      });
    }
  };

  const handleAddTask = (boardId: string) => {
    hapticFeedback.medium();
    // TODO: Implement task creation modal
  };

  const handleResetData = async () => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to reset all data? This action cannot be undone.'
    );
    if (confirmed && state) {
      setState({
        ...state,
        boards: [],
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
        createdAt: now,
      };

      setState({
        ...state,
        boards: [...state.boards, newBoard],
      });
    }
  };

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
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          padding: '16px 0',
        }}
      >
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '32px',
              fontWeight: 600,
            }}
          >
            Dashboard
          </h1>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              variant="secondary"
              onClick={handleResetData}
            >
              Reset Data
            </Button>
            <Button
              variant="primary"
              onClick={handleCreateBoard}
            >
              Create Board
            </Button>
          </div>
        </div>

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
            <Input
              placeholder="Search boards..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ maxWidth: '300px' }}
            />
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  fontSize: '14px',
                  color: '#666666',
                }}
              >
                System Health:
              </span>
              <div
                style={{
                  width: '100px',
                  height: '8px',
                  backgroundColor: '#E0E0E0',
                  borderRadius: '4px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    width: `${systemHealthScore}%`,
                    height: '100%',
                    backgroundColor:
                      systemHealthScore >= 80
                        ? '#4CAF50'
                        : systemHealthScore >= 50
                        ? '#FFA726'
                        : '#F44336',
                    transition: 'width 0.3s ease-in-out',
                  }}
                />
              </div>
              <span
                style={{
                  fontSize: '14px',
                  fontWeight: 600,
                  color:
                    systemHealthScore >= 80
                      ? '#4CAF50'
                      : systemHealthScore >= 50
                      ? '#FFA726'
                      : '#F44336',
                }}
              >
                {Math.round(systemHealthScore)}%
              </span>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredBoards.map((board) => (
              <BoardCard
                key={board.id}
                board={board}
                onEdit={handleEditBoard}
                onDelete={handleDeleteBoard}
                onAddTask={handleAddTask}
              />
            ))}
          </div>
        </div>

        <BoardModal
          isOpen={isBoardModalOpen}
          onClose={() => setIsBoardModalOpen(false)}
          board={editingBoard}
          onSubmit={handleBoardSubmit}
        />
      </div>
    </Layout>
  );
} 