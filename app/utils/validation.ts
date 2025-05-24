import { Task } from '../types';

export const validateRequired = (value: any): string | null => {
  if (value === undefined || value === null || value === '') {
    return 'This field is required';
  }
  return null;
};

export const validateMinLength = (value: string, minLength: number): string | null => {
  if (value.length < minLength) {
    return `Minimum length is ${minLength} characters`;
  }
  return null;
};

export const validateMaxLength = (value: string, maxLength: number): string | null => {
  if (value.length > maxLength) {
    return `Maximum length is ${maxLength} characters`;
  }
  return null;
};

export const validateEmail = (value: string): string | null => {
  const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i;
  if (!emailRegex.test(value)) {
    return 'Invalid email address';
  }
  return null;
};

export const validateUrl = (value: string): string | null => {
  try {
    new URL(value);
    return null;
  } catch {
    return 'Invalid URL';
  }
};

export const validateNumeric = (value: string): string | null => {
  if (!/^\d+$/.test(value)) {
    return 'Must be a number';
  }
  return null;
};

export const validateMinValue = (value: number, min: number): string | null => {
  if (value < min) {
    return `Minimum value is ${min}`;
  }
  return null;
};

export const validateMaxValue = (value: number, max: number): string | null => {
  if (value > max) {
    return `Maximum value is ${max}`;
  }
  return null;
};

export const validateDate = (value: string): string | null => {
  const date = new Date(value);
  if (isNaN(date.getTime())) {
    return 'Invalid date';
  }
  return null;
};

export const validateDateRange = (startDate: string, endDate: string): string | null => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  if (isNaN(start.getTime()) || isNaN(end.getTime())) {
    return 'Invalid date range';
  }
  
  if (start > end) {
    return 'Start date must be before end date';
  }
  
  return null;
};

export const validateTaskTitle = (value: string): string | null => {
  const required = validateRequired(value);
  if (required) return required;
  
  const minLength = validateMinLength(value, 3);
  if (minLength) return minLength;
  
  const maxLength = validateMaxLength(value, 100);
  if (maxLength) return maxLength;
  
  return null;
};

export const validateTaskDescription = (value: string): string | null => {
  if (!value) return null; // Description is optional
  
  const maxLength = validateMaxLength(value, 1000);
  if (maxLength) return maxLength;
  
  return null;
};

export const validateBoardName = (value: string): string | null => {
  const required = validateRequired(value);
  if (required) return required;
  
  const minLength = validateMinLength(value, 3);
  if (minLength) return minLength;
  
  const maxLength = validateMaxLength(value, 50);
  if (maxLength) return maxLength;
  
  return null;
};

export const validateTagName = (value: string): string | null => {
  const required = validateRequired(value);
  if (required) return required;
  
  const minLength = validateMinLength(value, 2);
  if (minLength) return minLength;
  
  const maxLength = validateMaxLength(value, 20);
  if (maxLength) return maxLength;
  
  // Only allow alphanumeric characters and underscores
  if (!/^[a-zA-Z0-9_]+$/.test(value)) {
    return 'Only letters, numbers, and underscores are allowed';
  }
  
  return null;
};

export const validateTask = (
  task: Omit<Task, 'id' | 'createdAt' | 'lastStatusChange' | 'lastInteraction'>
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!task.name.trim()) {
    errors.name = 'Task name is required';
  }

  if (!task.iconName.trim()) {
    errors.iconName = 'Icon name is required';
  }

  if (!task.iconLibrary.trim()) {
    errors.iconLibrary = 'Icon library is required';
  }

  if (task.warningHours < 1) {
    errors.warningHours = 'Warning hours must be at least 1';
  }

  if (task.criticalHours < 1) {
    errors.criticalHours = 'Critical hours must be at least 1';
  }

  if (task.criticalHours <= task.warningHours) {
    errors.criticalHours = 'Critical hours must be greater than warning hours';
  }

  return errors;
}; 