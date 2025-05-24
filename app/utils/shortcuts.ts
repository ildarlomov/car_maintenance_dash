import { useEffect } from 'react';

type ShortcutHandler = (event: KeyboardEvent) => void;

interface ShortcutOptions {
  ctrl?: boolean;
  alt?: boolean;
  shift?: boolean;
  meta?: boolean;
  preventDefault?: boolean;
  stopPropagation?: boolean;
}

interface Shortcut {
  key: string;
  handler: ShortcutHandler;
  options?: ShortcutOptions;
}

const defaultOptions: ShortcutOptions = {
  ctrl: false,
  alt: false,
  shift: false,
  meta: false,
  preventDefault: true,
  stopPropagation: true,
};

const checkModifiers = (event: KeyboardEvent, options: ShortcutOptions): boolean => {
  const { ctrl, alt, shift, meta } = options;
  return (
    (!ctrl || event.ctrlKey) &&
    (!alt || event.altKey) &&
    (!shift || event.shiftKey) &&
    (!meta || event.metaKey)
  );
};

export const useShortcuts = (shortcuts: Shortcut[]) => {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      const shortcut = shortcuts.find(
        (s) =>
          s.key.toLowerCase() === event.key.toLowerCase() &&
          checkModifiers(event, { ...defaultOptions, ...s.options })
      );

      if (shortcut) {
        if (shortcut.options?.preventDefault) {
          event.preventDefault();
        }
        if (shortcut.options?.stopPropagation) {
          event.stopPropagation();
        }
        shortcut.handler(event);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [shortcuts]);
};

// Common shortcuts
export const commonShortcuts = {
  // Navigation
  goBack: {
    key: 'Escape',
    handler: () => window.history.back(),
  },
  goHome: {
    key: 'h',
    options: { meta: true },
    handler: () => window.location.href = '/',
  },
  refresh: {
    key: 'r',
    options: { meta: true },
    handler: () => window.location.reload(),
  },

  // Task management
  createTask: {
    key: 'n',
    options: { meta: true },
    handler: () => {
      // Implement task creation logic
    },
  },
  saveTask: {
    key: 's',
    options: { meta: true },
    handler: () => {
      // Implement task saving logic
    },
  },
  deleteTask: {
    key: 'Backspace',
    options: { meta: true },
    handler: () => {
      // Implement task deletion logic
    },
  },

  // Board management
  createBoard: {
    key: 'b',
    options: { meta: true, shift: true },
    handler: () => {
      // Implement board creation logic
    },
  },
  deleteBoard: {
    key: 'd',
    options: { meta: true, shift: true },
    handler: () => {
      // Implement board deletion logic
    },
  },

  // Search
  focusSearch: {
    key: '/',
    handler: () => {
      const searchInput = document.querySelector('input[type="search"]');
      if (searchInput instanceof HTMLElement) {
        searchInput.focus();
      }
    },
  },

  // Help
  showHelp: {
    key: '?',
    handler: () => {
      // Implement help display logic
    },
  },
};

// Helper function to create a shortcut
export const createShortcut = (
  key: string,
  handler: ShortcutHandler,
  options?: ShortcutOptions
): Shortcut => ({
  key,
  handler,
  options: { ...defaultOptions, ...options },
});

// Helper function to check if a shortcut is pressed
export const isShortcutPressed = (
  event: KeyboardEvent,
  key: string,
  options?: ShortcutOptions
): boolean => {
  const mergedOptions = { ...defaultOptions, ...options };
  return (
    event.key.toLowerCase() === key.toLowerCase() &&
    checkModifiers(event, mergedOptions)
  );
}; 