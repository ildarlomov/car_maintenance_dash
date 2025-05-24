import { CSSProperties } from 'react';

export const fadeIn: CSSProperties = {
  animation: 'fadeIn 0.3s ease-in-out',
};

export const fadeOut: CSSProperties = {
  animation: 'fadeOut 0.3s ease-in-out',
};

export const slideIn: CSSProperties = {
  animation: 'slideIn 0.3s ease-in-out',
};

export const slideOut: CSSProperties = {
  animation: 'slideOut 0.3s ease-in-out',
};

export const scaleIn: CSSProperties = {
  animation: 'scaleIn 0.3s ease-in-out',
};

export const scaleOut: CSSProperties = {
  animation: 'scaleOut 0.3s ease-in-out',
};

export const bounce: CSSProperties = {
  animation: 'bounce 0.5s ease-in-out',
};

export const shake: CSSProperties = {
  animation: 'shake 0.5s ease-in-out',
};

export const pulse: CSSProperties = {
  animation: 'pulse 1s ease-in-out infinite',
};

export const spin: CSSProperties = {
  animation: 'spin 1s linear infinite',
};

export const getTransitionStyles = (
  isVisible: boolean,
  type: 'fade' | 'slide' | 'scale' = 'fade'
): CSSProperties => {
  const baseStyles: CSSProperties = {
    opacity: isVisible ? 1 : 0,
    transition: 'all 0.3s ease-in-out',
  };

  switch (type) {
    case 'slide':
      return {
        ...baseStyles,
        transform: isVisible ? 'translateY(0)' : 'translateY(20px)',
      };
    case 'scale':
      return {
        ...baseStyles,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)',
      };
    default:
      return baseStyles;
  }
};

export const getHoverStyles = (
  scale: number = 1.05,
  duration: number = 0.2
): CSSProperties => ({
  transition: `transform ${duration}s ease-in-out`,
  transform: 'scale(1)',
});

export const getFocusStyles = (
  scale: number = 1.05,
  duration: number = 0.2
): CSSProperties => ({
  transition: `transform ${duration}s ease-in-out`,
  transform: 'scale(1)',
});

export const getActiveStyles = (
  scale: number = 0.95,
  duration: number = 0.1
): CSSProperties => ({
  transition: `transform ${duration}s ease-in-out`,
  transform: 'scale(1)',
});

export const getDisabledStyles = (): CSSProperties => ({
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
});

export const getLoadingStyles = (): CSSProperties => ({
  position: 'relative',
});

export const getSkeletonStyles = (): CSSProperties => ({
  backgroundColor: '#e0e0e0',
  animation: 'pulse 1.5s ease-in-out infinite',
});

export const getErrorStyles = (): CSSProperties => ({
  animation: 'shake 0.5s ease-in-out',
});

export const getSuccessStyles = (): CSSProperties => ({
  animation: 'bounce 0.5s ease-in-out',
}); 