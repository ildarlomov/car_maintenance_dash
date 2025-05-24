import { showTelegramAlert, showTelegramConfirm, showTelegramPopup } from './telegram';
import { hapticFeedback } from './telegram';
import { ERROR_MESSAGES, SUCCESS_MESSAGES } from './constants';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';

interface NotificationOptions {
  type?: NotificationType;
  duration?: number;
  showHaptic?: boolean;
}

const defaultOptions: NotificationOptions = {
  type: 'info',
  duration: 3000,
  showHaptic: true,
};

const getHapticFeedback = (type: NotificationType) => {
  switch (type) {
    case 'success':
      hapticFeedback.success();
      break;
    case 'error':
      hapticFeedback.error();
      break;
    case 'warning':
      hapticFeedback.warning();
      break;
    default:
      hapticFeedback.light();
  }
};

export const showNotification = async (
  message: string,
  options: NotificationOptions = {}
): Promise<void> => {
  const mergedOptions = { ...defaultOptions, ...options };
  const { type, showHaptic } = mergedOptions;

  if (showHaptic) {
    getHapticFeedback(type!);
  }

  await showTelegramAlert(message);
};

export const showSuccessNotification = async (
  message: string = SUCCESS_MESSAGES.TASK_CREATED,
  options: NotificationOptions = {}
): Promise<void> => {
  await showNotification(message, { ...options, type: 'success' });
};

export const showErrorNotification = async (
  message: string = ERROR_MESSAGES.UNKNOWN_ERROR,
  options: NotificationOptions = {}
): Promise<void> => {
  await showNotification(message, { ...options, type: 'error' });
};

export const showWarningNotification = async (
  message: string,
  options: NotificationOptions = {}
): Promise<void> => {
  await showNotification(message, { ...options, type: 'warning' });
};

export const showInfoNotification = async (
  message: string,
  options: NotificationOptions = {}
): Promise<void> => {
  await showNotification(message, { ...options, type: 'info' });
};

export const showConfirmationDialog = async (
  message: string,
  confirmText: string = 'Confirm',
  cancelText: string = 'Cancel'
): Promise<boolean> => {
  return await showTelegramConfirm(message);
};

export const showActionDialog = async (
  message: string,
  actions: Array<{
    id: string;
    text: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
  }>
): Promise<string | null> => {
  return await showTelegramPopup({
    message,
    buttons: actions,
  });
};

// Task-specific notifications
export const taskNotifications = {
  created: () => showSuccessNotification(SUCCESS_MESSAGES.TASK_CREATED),
  updated: () => showSuccessNotification(SUCCESS_MESSAGES.TASK_UPDATED),
  deleted: () => showSuccessNotification(SUCCESS_MESSAGES.TASK_DELETED),
  error: (message?: string) => showErrorNotification(message),
};

// Board-specific notifications
export const boardNotifications = {
  created: () => showSuccessNotification(SUCCESS_MESSAGES.BOARD_CREATED),
  updated: () => showSuccessNotification(SUCCESS_MESSAGES.BOARD_UPDATED),
  deleted: () => showSuccessNotification(SUCCESS_MESSAGES.BOARD_DELETED),
  error: (message?: string) => showErrorNotification(message),
};

// Tag-specific notifications
export const tagNotifications = {
  created: () => showSuccessNotification(SUCCESS_MESSAGES.TAG_CREATED),
  updated: () => showSuccessNotification(SUCCESS_MESSAGES.TAG_UPDATED),
  deleted: () => showSuccessNotification(SUCCESS_MESSAGES.TAG_DELETED),
  error: (message?: string) => showErrorNotification(message),
}; 