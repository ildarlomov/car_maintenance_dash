import React from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout/Layout';
import { TaskCard } from '../../components/tasks/TaskCard';
import { TaskModal } from '../../components/tasks/TaskModal';
import { Button } from '../../components/ui/Button';
import { Input } from '../../components/ui/Input';
import { useAppState } from '../../utils/hooks';
import { hapticFeedback } from '../../utils/telegram';
import { showConfirmationDialog } from '../../utils/notifications';
import { Task } from '../../types';
import { AppState } from '../../types';

export default function BoardDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state, setState, isLoading } = useAppState();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);
  const [editingTask, setEditingTask] = React.useState<Task | undefined>();

  const board = React.useMemo(() => {
    if (!state?.boards || !id) return null;
    return state.boards.find((board) => board.id === id);
  }, [state?.boards, id]);

  const filteredTasks = React.useMemo(() => {
    if (!board) return [];
    if (!searchTerm) return board.tasks;
    return board.tasks.filter((task) =>
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [board, searchTerm]);

  const handleBack = () => {
    hapticFeedback.light();
    router.push('/');
  };

  const handleAddTask = () => {
    hapticFeedback.medium();
    setEditingTask(undefined);
    setIsTaskModalOpen(true);
  };

  const handleTaskStatusChange = (taskId: string, newStatus: Task['status']) => {
    if (!state || !board) return;

    const now = Date.now();
    const task = board.tasks.find((t) => t.id === taskId);
    if (!task) return;

    const updatedTasks = board.tasks.map((t) =>
      t.id === taskId
        ? {
            ...t,
            status: newStatus,
            lastInteraction: now,
            lastStatusChange: now,
          }
        : t
    );

    const updatedBoards = state.boards.map((b) =>
      b.id === board.id
        ? {
            ...b,
            tasks: updatedTasks,
          }
        : b
    );

    setState({
      ...state,
      boards: updatedBoards,
      statusChangeLogs: [
        ...state.statusChangeLogs,
        {
          id: crypto.randomUUID(),
          taskId,
          taskName: task.title,
          oldStatus: task.status,
          newStatus,
          timestamp: now,
          userId: 'USER',
        },
      ],
    });
  };

  const handleEditTask = (taskId: string) => {
    hapticFeedback.light();
    const task = board?.tasks.find((t) => t.id === taskId);
    if (task) {
      setEditingTask(task);
      setIsTaskModalOpen(true);
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete this task?'
    );
    if (confirmed && state && board) {
      const updatedBoards = state.boards.map((b) =>
        b.id === board.id
          ? {
              ...b,
              tasks: b.tasks.filter((task) => task.id !== taskId),
            }
          : b
      );

      setState({
        ...state,
        boards: updatedBoards,
      });
    }
  };

  const handleTaskSubmit = (taskData: Partial<Task>) => {
    if (editingTask) {
      // Update existing task
      const updatedTasks = state.tasks.map(task =>
        task.id === editingTask.id
          ? {
              ...task,
              ...taskData,
              lastStatusChange: Date.now(),
            }
          : task
      );
      setState({
        ...state,
        tasks: updatedTasks,
      });
    } else {
      // Create new task
      const newTask: Task = {
        id: crypto.randomUUID(),
        ...taskData,
        lastInteraction: Date.now(),
        lastStatusChange: Date.now(),
        iconName: taskData.iconName || 'FaCar',
        iconLibrary: taskData.iconLibrary || 'fa',
        status: 'active',
      } as Task;
      setState({
        ...state,
        tasks: [...state.tasks, newTask],
      });
    }
    setIsTaskModalOpen(false);
    setEditingTask(undefined);
  };

  const handleStatusChange = (taskId: string, newStatus: Task['status']) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTasks = state.tasks.map(t =>
        t.id === taskId
          ? {
              ...t,
              status: newStatus,
              lastStatusChange: Date.now(),
            }
          : t
      );
      setState({
        ...state,
        tasks: updatedTasks,
        statusChangeLogs: [
          ...state.statusChangeLogs,
          {
            id: crypto.randomUUID(),
            taskId,
            taskName: task.title,
            oldStatus: task.status,
            newStatus,
            timestamp: Date.now(),
            userId: 'USER',
          },
        ],
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

  if (!board) {
    return (
      <Layout>
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '100vh',
            gap: '16px',
          }}
        >
          <h1
            style={{
              margin: 0,
              fontSize: '24px',
              color: '#666666',
            }}
          >
            Board not found
          </h1>
          <Button
            variant="primary"
            onClick={handleBack}
          >
            Back to Dashboard
          </Button>
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
            }}
          >
            <Button
              variant="secondary"
              onClick={handleBack}
            >
              ← Back
            </Button>
            <h1
              style={{
                margin: 0,
                fontSize: '32px',
                fontWeight: 600,
              }}
            >
              {board.name}
            </h1>
          </div>
          <Button
            variant="primary"
            onClick={handleAddTask}
          >
            Add Task
          </Button>
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '16px',
          }}
        >
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ maxWidth: '300px' }}
          />

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '16px',
            }}
          >
            {filteredTasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onStatusChange={handleTaskStatusChange}
                onEdit={handleEditTask}
                onDelete={handleDeleteTask}
              />
            ))}
          </div>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          boardId={board.id}
          task={editingTask}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </Layout>
  );
} 