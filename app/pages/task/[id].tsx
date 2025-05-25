import React from 'react';
import { useRouter } from 'next/router';
import { Layout } from '../../components/layout/Layout';
import { TaskModal } from '../../components/tasks/TaskModal';
import { Button } from '../../components/ui/Button';
import { Card, CardHeader, CardContent } from '../../components/ui/Card';
import { useAppState } from '../../utils/hooks';
import { hapticFeedback } from '../../utils/telegram';
import { showConfirmationDialog } from '../../utils/notifications';
import { Task, TaskStatus } from '../../types';
import { calculateTaskHealthScore } from '../../utils/analytics';
import { getRelativeTimeString } from '../../utils/date';

export default function TaskDetail() {
  const router = useRouter();
  const { id } = router.query;
  const { state, setState, isLoading } = useAppState();
  const [isTaskModalOpen, setIsTaskModalOpen] = React.useState(false);

  const task = React.useMemo(() => {
    if (!state?.boards || !id) return null;
    for (const board of state.boards) {
      const foundTask = board.tasks.find((t) => t.id === id);
      if (foundTask) return { ...foundTask, boardName: board.name };
    }
    return null;
  }, [state?.boards, id]);

  const statusChangeLogs = React.useMemo(() => {
    if (!state?.statusChangeLogs || !id) return [];
    return state.statusChangeLogs
      .filter((log) => log.taskId === id)
      .sort((a, b) => b.timestamp - a.timestamp);
  }, [state?.statusChangeLogs, id]);

  const healthScore = React.useMemo(() => {
    if (!task) return 100;
    return calculateTaskHealthScore(task);
  }, [task]);

  const handleBack = () => {
    hapticFeedback.light();
    router.back();
  };

  const handleEdit = () => {
    hapticFeedback.medium();
    setIsTaskModalOpen(true);
  };

  const handleDelete = async () => {
    hapticFeedback.heavy();
    const confirmed = await showConfirmationDialog(
      'Are you sure you want to delete this task?'
    );
    if (confirmed && state && task) {
      const updatedBoards = state.boards.map((board) =>
        board.tasks.some((t) => t.id === task.id)
          ? {
              ...board,
              tasks: board.tasks.filter((t) => t.id !== task.id),
            }
          : board
      );

      setState({
        ...state,
        boards: updatedBoards,
      });
      router.push('/');
    }
  };

  const handleStatusChange = (newStatus: TaskStatus) => {
    if (!state || !task) return;

    const now = Date.now();
    const updatedBoards = state.boards.map((board) =>
      board.tasks.some((t) => t.id === task.id)
        ? {
            ...board,
            tasks: board.tasks.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    status: newStatus,
                    lastInteraction: now,
                    lastStatusChange: now,
                  }
                : t
            ),
          }
        : board
    );

    setState({
      ...state,
      boards: updatedBoards,
      statusChangeLogs: [
        ...state.statusChangeLogs,
        {
          id: crypto.randomUUID(),
          taskId: task.id,
          taskName: task.title,
          oldStatus: task.status,
          newStatus,
          timestamp: now,
          userId: 'USER',
        },
      ],
    });
  };

  const handleTaskSubmit = (taskData: Partial<Task>) => {
    if (!state || !task) return;

    const now = Date.now();
    const updatedBoards = state.boards.map((board) =>
      board.tasks.some((t) => t.id === task.id)
        ? {
            ...board,
            tasks: board.tasks.map((t) =>
              t.id === task.id
                ? {
                    ...t,
                    ...taskData,
                    lastInteraction: now,
                  }
                : t
            ),
          }
        : board
    );

    setState({
      ...state,
      boards: updatedBoards,
    });
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

  if (!task) {
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
            Task not found
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
              {task.title}
            </h1>
          </div>
          <div
            style={{
              display: 'flex',
              gap: '8px',
            }}
          >
            <Button
              variant="secondary"
              onClick={handleEdit}
            >
              Edit
            </Button>
            <Button
              variant="error"
              onClick={handleDelete}
            >
              Delete
            </Button>
          </div>
        </div>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '24px',
          }}
        >
          <Card>
            <CardHeader>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                Task Details
              </h2>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Board
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                    }}
                  >
                    {task.boardName}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Description
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                      whiteSpace: 'pre-wrap',
                    }}
                  >
                    {task.description || 'No description provided'}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Created
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                    }}
                  >
                    {getRelativeTimeString(new Date(task.createdAt))}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Last Interaction
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                    }}
                  >
                    {getRelativeTimeString(new Date(task.lastInteraction))}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Health Score
                  </span>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginTop: '4px',
                    }}
                  >
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
                          width: `${healthScore}%`,
                          height: '100%',
                          backgroundColor:
                            healthScore >= 80
                              ? '#4CAF50'
                              : healthScore >= 50
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
                          healthScore >= 80
                            ? '#4CAF50'
                            : healthScore >= 50
                            ? '#FFA726'
                            : '#F44336',
                      }}
                    >
                      {Math.round(healthScore)}%
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                Status
              </h2>
            </CardHeader>
            <CardContent>
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
                    gap: '8px',
                  }}
                >
                  <Button
                    variant={task.status === 'active' ? 'primary' : 'secondary'}
                    onClick={() => handleStatusChange('active')}
                  >
                    Active
                  </Button>
                  <Button
                    variant={task.status === 'warning' ? 'warning' : 'secondary'}
                    onClick={() => handleStatusChange('warning')}
                  >
                    Warning
                  </Button>
                  <Button
                    variant={task.status === 'critical' ? 'error' : 'secondary'}
                    onClick={() => handleStatusChange('critical')}
                  >
                    Critical
                  </Button>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Current Status
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                      color:
                        task.status === 'active'
                          ? '#4CAF50'
                          : task.status === 'warning'
                          ? '#FFA726'
                          : '#F44336',
                      fontWeight: 600,
                    }}
                  >
                    {task.status}
                  </p>
                </div>
                <div>
                  <span
                    style={{
                      fontSize: '14px',
                      color: '#666666',
                    }}
                  >
                    Last Status Change
                  </span>
                  <p
                    style={{
                      margin: '4px 0 0',
                      fontSize: '16px',
                    }}
                  >
                    {getRelativeTimeString(new Date(task.lastStatusChange))}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h2
                style={{
                  margin: 0,
                  fontSize: '20px',
                  fontWeight: 600,
                }}
              >
                Status History
              </h2>
            </CardHeader>
            <CardContent>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '16px',
                }}
              >
                {statusChangeLogs.length === 0 ? (
                  <p
                    style={{
                      margin: 0,
                      color: '#666666',
                    }}
                  >
                    No status changes recorded
                  </p>
                ) : (
                  statusChangeLogs.map((log) => (
                    <div
                      key={log.id}
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '4px',
                        padding: '12px',
                        backgroundColor: '#F5F5F5',
                        borderRadius: '8px',
                      }}
                    >
                      <div
                        style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center',
                        }}
                      >
                        <span
                          style={{
                            fontSize: '14px',
                            fontWeight: 600,
                          }}
                        >
                          {log.oldStatus} → {log.newStatus}
                        </span>
                        <span
                          style={{
                            fontSize: '12px',
                            color: '#666666',
                          }}
                        >
                          {getRelativeTimeString(new Date(log.timestamp))}
                        </span>
                      </div>
                      <span
                        style={{
                          fontSize: '12px',
                          color: '#666666',
                        }}
                      >
                        Changed by {log.userId}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <TaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          boardId={task.boardId}
          task={task}
          onSubmit={handleTaskSubmit}
        />
      </div>
    </Layout>
  );
} 