import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, Task, Board } from '../types';
import { loadState, saveState } from './storage';
import { showTelegramAlert } from './telegram';
import { ERROR_MESSAGES } from './constants';
import { createInitialBoards, createInitialTasks } from './initialData';

const STORAGE_KEY = 'car_maintenance_state';

const initialBoards: Board[] = [
  {
    id: '1',
    name: 'Maintenance',
    tasks: [
      {
        id: '1',
        title: 'Oil Change',
        description: 'Change engine oil and filter',
        status: 'active',
        lastInteraction: Date.now(),
        createdAt: Date.now(),
        boardId: '1',
        warningHours: 24,
        criticalHours: 48,
        iconName: 'FaOilCan',
        iconLibrary: 'fa',
      },
      {
        id: '2',
        title: 'Tire Rotation',
        description: 'Rotate tires and check pressure',
        status: 'active',
        lastInteraction: Date.now(),
        createdAt: Date.now(),
        boardId: '1',
        warningHours: 24,
        criticalHours: 48,
        iconName: 'FaTachometerAlt',
        iconLibrary: 'fa',
      },
    ],
    order: 0,
    createdAt: Date.now(),
  },
  {
    id: '2',
    name: 'Inspections',
    tasks: [
      {
        id: '3',
        title: 'Brake Check',
        description: 'Inspect brake pads and rotors',
        status: 'active',
        lastInteraction: Date.now(),
        createdAt: Date.now(),
        boardId: '2',
        warningHours: 24,
        criticalHours: 48,
        iconName: 'FaBrakeSystem',
        iconLibrary: 'fa',
      },
    ],
    order: 1,
    createdAt: Date.now(),
  },
];

const initialState: AppState = {
  boards: initialBoards,
  currentTime: Date.now(),
};

// Hook for managing local storage state
export const useLocalStorage = <T>(key: string, initialValue: T) => {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch (error) {
      console.error(error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((val: T) => T)) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.localStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (error) {
      console.error(error);
    }
  };

  return [storedValue, setValue] as const;
};

// Hook for managing app state
export const useAppState = () => {
  const [state, setState] = useState<AppState>(() => {
    if (typeof window === 'undefined') return initialState;
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : initialState;
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
    setIsLoading(false);
  }, [state]);

  useEffect(() => {
    const timer = setInterval(() => {
      setState(prevState => {
        const currentTime = Date.now();
        const updatedBoards = prevState.boards.map(board => ({
          ...board,
          tasks: board.tasks.map(task => {
            const hoursSinceLastInteraction = Math.floor(
              (currentTime - task.lastInteraction) / (1000 * 60 * 60)
            );

            let newStatus = task.status;
            if (task.status === 'active' && hoursSinceLastInteraction >= task.warningHours) {
              newStatus = 'warning';
              console.log(`Task "${task.title}" moved to warning state`);
            }
            if (task.status === 'warning' && hoursSinceLastInteraction >= task.criticalHours) {
              newStatus = 'critical';
              console.log(`Task "${task.title}" moved to critical state`);
            }

            return {
              ...task,
              status: newStatus,
            };
          }),
        }));

        return {
          ...prevState,
          boards: updatedBoards,
          currentTime,
        };
      });
    }, 60000); // Check every minute

    return () => clearInterval(timer);
  }, []);

  const createBoard = (name: string) => {
    setState(prevState => ({
      ...prevState,
      boards: [
        ...prevState.boards,
        {
          id: Date.now().toString(),
          name,
          tasks: [],
        },
      ],
    }));
  };

  const updateBoard = (boardId: string, updates: Partial<Board>) => {
    setState(prevState => ({
      ...prevState,
      boards: prevState.boards.map(board =>
        board.id === boardId ? { ...board, ...updates } : board
      ),
    }));
  };

  const deleteBoard = (boardId: string) => {
    setState(prevState => ({
      ...prevState,
      boards: prevState.boards.filter(board => board.id !== boardId),
    }));
  };

  const createTask = (task: Partial<Task>) => {
    setState(prevState => ({
      ...prevState,
      boards: prevState.boards.map(board =>
        board.id === task.boardId
          ? {
              ...board,
              tasks: [
                ...board.tasks,
                {
                  ...task,
                  id: Date.now().toString(),
                  createdAt: Date.now(),
                  lastInteraction: Date.now(),
                  status: 'active',
                } as Task,
              ],
            }
          : board
      ),
    }));
  };

  const updateTask = (task: Task) => {
    setState(prevState => ({
      ...prevState,
      boards: prevState.boards.map(board =>
        board.id === task.boardId
          ? {
              ...board,
              tasks: board.tasks.map(t =>
                t.id === task.id ? { ...t, ...task } : t
              ),
            }
          : board
      ),
    }));
  };

  const deleteTask = (boardId: string, taskId: string) => {
    setState(prevState => ({
      ...prevState,
      boards: prevState.boards.map(board =>
        board.id === boardId
          ? {
              ...board,
              tasks: board.tasks.filter(task => task.id !== taskId),
            }
          : board
      ),
    }));
  };

  return {
    state,
    setState,
    isLoading,
    createBoard,
    updateBoard,
    deleteBoard,
    createTask,
    updateTask,
    deleteTask,
  };
};

// Hook for managing window dimensions
export const useWindowDimensions = () => {
  const [dimensions, setDimensions] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return dimensions;
};

// Hook for managing click outside
export const useClickOutside = (callback: () => void) => {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        callback();
      }
    };

    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [callback]);

  return ref;
};

// Hook for managing keyboard shortcuts
export const useKeyboardShortcut = (
  key: string,
  callback: (event: KeyboardEvent) => void,
  deps: any[] = []
) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === key) {
        callback(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [key, callback, ...deps]);
};

// Hook for managing debounced values
export const useDebounce = <T>(value: T, delay: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

// Hook for managing loading states
export const useLoading = (initialState = false) => {
  const [isLoading, setIsLoading] = useState(initialState);

  const withLoading = useCallback(async <T>(promise: Promise<T>): Promise<T> => {
    try {
      setIsLoading(true);
      const result = await promise;
      return result;
    } finally {
      setIsLoading(false);
    }
  }, []);

  return { isLoading, setIsLoading, withLoading };
}; 