declare global {
  interface Window {
    Telegram: {
      WebApp: {
        initData: string;
        initDataUnsafe: {
          user?: {
            id: number;
            first_name: string;
            last_name?: string;
            username?: string;
            language_code?: string;
          };
          query_id?: string;
          auth_date?: number;
          hash?: string;
        };
        ready: () => void;
        expand: () => void;
        close: () => void;
        showPopup: (params: {
          title?: string;
          message: string;
          buttons?: Array<{
            id: string;
            type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
            text: string;
          }>;
        }) => void;
        showAlert: (message: string, callback?: () => void) => void;
        showConfirm: (message: string, callback?: (confirmed: boolean) => void) => void;
        MainButton: {
          text: string;
          color: string;
          textColor: string;
          isVisible: boolean;
          isActive: boolean;
          isProgressVisible: boolean;
          setText: (text: string) => void;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
          enable: () => void;
          disable: () => void;
          showProgress: (leaveActive: boolean) => void;
          hideProgress: () => void;
        };
        BackButton: {
          isVisible: boolean;
          onClick: (callback: () => void) => void;
          show: () => void;
          hide: () => void;
        };
        HapticFeedback: {
          impactOccurred: (style: 'light' | 'medium' | 'heavy' | 'rigid' | 'soft') => void;
          notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
          selectionChanged: () => void;
        };
      };
    };
  }
}

export const initTelegramWebApp = (): void => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.ready();
    window.Telegram.WebApp.expand();
  }
};

export const showTelegramAlert = (message: string): void => {
  if (window.Telegram?.WebApp) {
    window.Telegram.WebApp.showAlert(message);
  }
};

export const showTelegramConfirm = (message: string): Promise<boolean> => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showConfirm(message, (confirmed) => {
        resolve(confirmed);
      });
    } else {
      resolve(false);
    }
  });
};

export const showTelegramPopup = (params: {
  title?: string;
  message: string;
  buttons?: Array<{
    id: string;
    type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
    text: string;
  }>;
}): Promise<string | null> => {
  return new Promise((resolve) => {
    if (window.Telegram?.WebApp) {
      window.Telegram.WebApp.showPopup({
        ...params,
        buttons: params.buttons?.map((button) => ({
          ...button,
          onClick: () => resolve(button.id),
        })),
      });
    } else {
      resolve(null);
    }
  });
};

export const getTelegramUser = () => {
  return window.Telegram?.WebApp?.initDataUnsafe?.user;
};

export const hapticFeedback = {
  light: () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('light');
    }
  },
  medium: () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('medium');
    }
  },
  heavy: () => {
    if (window.Telegram?.WebApp?.HapticFeedback) {
      window.Telegram.WebApp.HapticFeedback.impactOccurred('heavy');
    }
  },
  success: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('success'),
  error: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('error'),
  warning: () => window.Telegram?.WebApp?.HapticFeedback?.notificationOccurred('warning'),
  selection: () => window.Telegram?.WebApp?.HapticFeedback?.selectionChanged(),
}; 