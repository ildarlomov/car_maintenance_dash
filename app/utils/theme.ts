export const colors = {
  primary: {
    light: '#4A90E2',
    main: '#2196F3',
    dark: '#1976D2',
  },
  secondary: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  success: {
    light: '#81C784',
    main: '#4CAF50',
    dark: '#388E3C',
  },
  error: {
    light: '#E57373',
    main: '#F44336',
    dark: '#D32F2F',
  },
  warning: {
    light: '#FFB74D',
    main: '#FF9800',
    dark: '#F57C00',
  },
  info: {
    light: '#64B5F6',
    main: '#2196F3',
    dark: '#1976D2',
  },
  grey: {
    50: '#FAFAFA',
    100: '#F5F5F5',
    200: '#EEEEEE',
    300: '#E0E0E0',
    400: '#BDBDBD',
    500: '#9E9E9E',
    600: '#757575',
    700: '#616161',
    800: '#424242',
    900: '#212121',
  },
  text: {
    primary: 'rgba(0, 0, 0, 0.87)',
    secondary: 'rgba(0, 0, 0, 0.6)',
    disabled: 'rgba(0, 0, 0, 0.38)',
  },
  background: {
    default: '#FFFFFF',
    paper: '#F5F5F5',
  },
  divider: 'rgba(0, 0, 0, 0.12)',
};

export const getStatusColor = (status: string): string => {
  switch (status.toLowerCase()) {
    case 'todo':
      return colors.grey[500];
    case 'in_progress':
      return colors.info.main;
    case 'in_review':
      return colors.warning.main;
    case 'done':
      return colors.success.main;
    case 'blocked':
      return colors.error.main;
    default:
      return colors.grey[500];
  }
};

export const getPriorityColor = (priority: string): string => {
  switch (priority.toLowerCase()) {
    case 'low':
      return colors.success.main;
    case 'medium':
      return colors.warning.main;
    case 'high':
      return colors.error.main;
    default:
      return colors.grey[500];
  }
};

export const getTagColor = (tag: string): string => {
  // Generate a consistent color based on the tag name
  const hash = tag.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);

  const hue = Math.abs(hash % 360);
  return `hsl(${hue}, 70%, 50%)`;
};

export const getContrastText = (backgroundColor: string): string => {
  // Convert hex to RGB
  const hex = backgroundColor.replace('#', '');
  const r = parseInt(hex.substr(0, 2), 16);
  const g = parseInt(hex.substr(2, 2), 16);
  const b = parseInt(hex.substr(4, 2), 16);

  // Calculate relative luminance
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

  // Return black or white based on luminance
  return luminance > 0.5 ? colors.text.primary : '#FFFFFF';
}; 