import { AppState } from '../types';

const STORAGE_KEY = 'car_maintenance_dash_state';

export const saveState = (state: AppState): void => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, serializedState);
  } catch (error) {
    console.error('Error saving state:', error);
  }
};

export const loadState = (): AppState | null => {
  try {
    const serializedState = localStorage.getItem(STORAGE_KEY);
    if (serializedState === null) {
      return null;
    }
    const state = JSON.parse(serializedState);
    // Convert string dates back to Date objects
    state.boards.forEach((board: any) => {
      board.createdAt = new Date(board.createdAt);
      board.tasks.forEach((task: any) => {
        task.createdAt = new Date(task.createdAt);
        task.lastStatusChange = new Date(task.lastStatusChange);
        task.lastInteraction = new Date(task.lastInteraction);
      });
    });
    state.statusChangeLogs.forEach((log: any) => {
      log.changedAt = new Date(log.changedAt);
    });
    return state;
  } catch (error) {
    console.error('Error loading state:', error);
    return null;
  }
};

export const exportState = (): string => {
  try {
    const state = loadState();
    if (!state) {
      throw new Error('No state to export');
    }
    return JSON.stringify(state, null, 2);
  } catch (error) {
    console.error('Error exporting state:', error);
    throw error;
  }
};

export const importState = (jsonString: string): void => {
  try {
    const state = JSON.parse(jsonString);
    saveState(state);
  } catch (error) {
    console.error('Error importing state:', error);
    throw error;
  }
}; 