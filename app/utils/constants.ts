export const TASK_STATUSES = {
  TODO: 'todo',
  IN_PROGRESS: 'in_progress',
  IN_REVIEW: 'in_review',
  DONE: 'done',
  BLOCKED: 'blocked',
} as const;

export const TASK_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
} as const;

export const TASK_STATUS_LABELS = {
  [TASK_STATUSES.TODO]: 'To Do',
  [TASK_STATUSES.IN_PROGRESS]: 'In Progress',
  [TASK_STATUSES.IN_REVIEW]: 'In Review',
  [TASK_STATUSES.DONE]: 'Done',
  [TASK_STATUSES.BLOCKED]: 'Blocked',
} as const;

export const TASK_PRIORITY_LABELS = {
  [TASK_PRIORITIES.LOW]: 'Low',
  [TASK_PRIORITIES.MEDIUM]: 'Medium',
  [TASK_PRIORITIES.HIGH]: 'High',
} as const;

export const TASK_STATUS_ORDER = [
  TASK_STATUSES.TODO,
  TASK_STATUSES.IN_PROGRESS,
  TASK_STATUSES.IN_REVIEW,
  TASK_STATUSES.DONE,
  TASK_STATUSES.BLOCKED,
] as const;

export const TASK_PRIORITY_ORDER = [
  TASK_PRIORITIES.LOW,
  TASK_PRIORITIES.MEDIUM,
  TASK_PRIORITIES.HIGH,
] as const;

export const DEFAULT_TASK_STATUS = TASK_STATUSES.TODO;
export const DEFAULT_TASK_PRIORITY = TASK_PRIORITIES.MEDIUM;

export const MAX_TASK_TITLE_LENGTH = 100;
export const MAX_TASK_DESCRIPTION_LENGTH = 1000;
export const MAX_BOARD_NAME_LENGTH = 50;
export const MAX_TAG_NAME_LENGTH = 20;
export const MIN_TASK_TITLE_LENGTH = 3;
export const MIN_BOARD_NAME_LENGTH = 3;
export const MIN_TAG_NAME_LENGTH = 2;

export const STORAGE_KEYS = {
  APP_STATE: 'car_maintenance_dash_state',
  USER_PREFERENCES: 'car_maintenance_dash_preferences',
} as const;

export const API_ENDPOINTS = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  BOARDS: '/boards',
  TASKS: '/tasks',
  TAGS: '/tags',
  USERS: '/users',
} as const;

export const TELEGRAM_WEBAPP_CONFIG = {
  MAIN_BUTTON: {
    TEXT: {
      CREATE_TASK: 'Create Task',
      SAVE_CHANGES: 'Save Changes',
      CONFIRM: 'Confirm',
      CANCEL: 'Cancel',
    },
    COLOR: {
      PRIMARY: '#2196F3',
      SUCCESS: '#4CAF50',
      WARNING: '#FF9800',
      ERROR: '#F44336',
    },
  },
} as const;

export const ERROR_MESSAGES = {
  REQUIRED_FIELD: 'This field is required',
  INVALID_EMAIL: 'Invalid email address',
  INVALID_URL: 'Invalid URL',
  INVALID_DATE: 'Invalid date',
  INVALID_DATE_RANGE: 'Start date must be before end date',
  NETWORK_ERROR: 'Network error occurred',
  SERVER_ERROR: 'Server error occurred',
  UNKNOWN_ERROR: 'An unknown error occurred',
} as const;

export const SUCCESS_MESSAGES = {
  TASK_CREATED: 'Task created successfully',
  TASK_UPDATED: 'Task updated successfully',
  TASK_DELETED: 'Task deleted successfully',
  BOARD_CREATED: 'Board created successfully',
  BOARD_UPDATED: 'Board updated successfully',
  BOARD_DELETED: 'Board deleted successfully',
  TAG_CREATED: 'Tag created successfully',
  TAG_UPDATED: 'Tag updated successfully',
  TAG_DELETED: 'Tag deleted successfully',
} as const; 