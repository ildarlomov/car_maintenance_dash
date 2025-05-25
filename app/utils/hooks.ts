import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState } from '../types';
import { loadState, saveState } from './storage';
import { showTelegramAlert } from './telegram';
import { ERROR_MESSAGES } from './constants';
import { createInitialBoards, createInitialTasks } from './initialData';

const initialBoards = createInitialBoards();
const initialState: AppState = {
  boards: initialBoards,
  tasks: createInitialTasks(initialBoards),
  statusChangeLogs: [],
  defaultTaskSettings: {
    warningHours: 24,
    criticalHours: 48,
    defaultStatus: 'inactive',
  },
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
    if (typeof window !== 'undefined') {
      const savedState = localStorage.getItem('appState');
      if (savedState) {
        try {
          const parsedState = JSON.parse(savedState);
          // Convert string dates back to Date objects and ensure boards have tasks array
          parsedState.boards = parsedState.boards.map((board: any) => ({
            ...board,
            createdAt: new Date(board.createdAt),
            tasks: board.tasks || [], // Ensure tasks array exists
          }));
          parsedState.tasks = parsedState.tasks.map((task: any) => ({
            ...task,
            createdAt: new Date(task.createdAt),
            lastInteraction: new Date(task.lastInteraction),
            lastStatusChange: new Date(task.lastStatusChange),
          }));
          parsedState.statusChangeLogs = parsedState.statusChangeLogs.map((log: any) => ({
            ...log,
            timestamp: new Date(log.timestamp),
          }));
          return parsedState;
        } catch (error) {
          console.error('Error parsing saved state:', error);
          return initialState;
        }
      }
      return initialState;
    }
    return initialState;
  });

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('appState', JSON.stringify(state));
    }
    setIsLoading(false);
  }, [state]);

  const updateState = useCallback((newState: AppState) => {
    try {
      setState(newState);
      saveState(newState);
      setError(null);
    } catch (err) {
      setError(ERROR_MESSAGES.UNKNOWN_ERROR);
      showTelegramAlert(ERROR_MESSAGES.UNKNOWN_ERROR);
    }
  }, []);

  return { state, setState: updateState, isLoading, error };
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