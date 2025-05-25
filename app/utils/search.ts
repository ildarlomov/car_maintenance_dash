import { Task, Board } from '../types';

interface SearchOptions {
  caseSensitive?: boolean;
  exactMatch?: boolean;
  searchInDescription?: boolean;
}

const defaultOptions: SearchOptions = {
  caseSensitive: false,
  exactMatch: false,
  searchInDescription: true,
};

const normalizeString = (str: string, caseSensitive: boolean): string => {
  return caseSensitive ? str : str.toLowerCase();
};

const matchesSearch = (
  text: string,
  searchTerm: string,
  options: SearchOptions
): boolean => {
  const normalizedText = normalizeString(text, options.caseSensitive!);
  const normalizedSearch = normalizeString(searchTerm, options.caseSensitive!);

  if (options.exactMatch) {
    return normalizedText === normalizedSearch;
  }

  return normalizedText.includes(normalizedSearch);
};

export const searchTasks = (
  tasks: Task[],
  searchTerm: string,
  options: SearchOptions = {}
): Task[] => {
  if (!searchTerm) return tasks;

  const mergedOptions = { ...defaultOptions, ...options };

  return tasks.filter((task) => {
    const nameMatch = matchesSearch(task.title, searchTerm, mergedOptions);
    if (nameMatch) return true;

    if (mergedOptions.searchInDescription && task.description) {
      const descriptionMatch = matchesSearch(
        task.description,
        searchTerm,
        mergedOptions
      );
      if (descriptionMatch) return true;
    }

    return false;
  });
};

export const searchBoards = (
  boards: Board[],
  searchTerm: string,
  options: SearchOptions = {}
): Board[] => {
  if (!searchTerm) return boards;

  const mergedOptions = { ...defaultOptions, ...options };

  return boards.filter((board) =>
    matchesSearch(board.name, searchTerm, mergedOptions)
  );
};

interface FilterOptions {
  status?: string[];
  isActive?: boolean;
  dateRange?: {
    start: Date;
    end: Date;
  };
}

export const filterTasks = (
  tasks: Task[],
  options: FilterOptions
): Task[] => {
  return tasks.filter((task) => {
    // Filter by status
    if (options.status && options.status.length > 0) {
      if (!options.status.includes(task.status)) return false;
    }

    // Filter by active state
    if (options.isActive !== undefined) {
      if ((task.status === 'active') !== options.isActive) return false;
    }

    // Filter by date range
    if (options.dateRange) {
      const taskDate = new Date(task.createdAt);
      if (
        taskDate < options.dateRange.start ||
        taskDate > options.dateRange.end
      ) {
        return false;
      }
    }

    return true;
  });
};

export const sortTasks = (
  tasks: Task[],
  sortBy: keyof Task,
  ascending: boolean = true
): Task[] => {
  return [...tasks].sort((a, b) => {
    const aValue = a[sortBy];
    const bValue = b[sortBy];

    if (typeof aValue === 'string' && typeof bValue === 'string') {
      return ascending
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }

    if (typeof aValue === 'number' && typeof bValue === 'number') {
      return ascending ? aValue - bValue : bValue - aValue;
    }

    if (typeof aValue === 'boolean' && typeof bValue === 'boolean') {
      return ascending ? (aValue === bValue ? 0 : aValue ? -1 : 1) : (aValue === bValue ? 0 : aValue ? 1 : -1);
    }

    return 0;
  });
};

export const groupTasksByStatus = (tasks: Task[]): Record<string, Task[]> => {
  return tasks.reduce((groups, task) => {
    const status = task.status;
    if (!groups[status]) {
      groups[status] = [];
    }
    groups[status].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
};

export const groupTasksByActiveState = (tasks: Task[]): Record<string, Task[]> => {
  return tasks.reduce((groups, task) => {
    const state = task.status === 'active' ? 'active' : 'inactive';
    if (!groups[state]) {
      groups[state] = [];
    }
    groups[state].push(task);
    return groups;
  }, {} as Record<string, Task[]>);
}; 