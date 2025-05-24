import React from 'react';
import { getHoverStyles, getActiveStyles, getDisabledStyles } from '../../utils/animations';
import { hapticFeedback } from '../../utils/telegram';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'medium',
  fullWidth = false,
  isLoading = false,
  leftIcon,
  rightIcon,
  disabled,
  onClick,
  style,
  ...props
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return {
          backgroundColor: '#2196F3',
          color: '#ffffff',
          ':hover': {
            backgroundColor: '#1976D2',
          },
        };
      case 'secondary':
        return {
          backgroundColor: '#E0E0E0',
          color: '#000000',
          ':hover': {
            backgroundColor: '#BDBDBD',
          },
        };
      case 'success':
        return {
          backgroundColor: '#4CAF50',
          color: '#ffffff',
        };
      case 'error':
        return {
          backgroundColor: '#F44336',
          color: '#ffffff',
        };
      case 'warning':
        return {
          backgroundColor: '#FFC107',
          color: '#000000',
        };
      default:
        return {
          backgroundColor: '#2196F3',
          color: '#ffffff',
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return {
          padding: '8px 16px',
          fontSize: '14px',
        };
      case 'large':
        return {
          padding: '16px 32px',
          fontSize: '18px',
        };
      default:
        return {
          padding: '12px 24px',
          fontSize: '16px',
        };
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    hapticFeedback.light();
    onClick?.(e);
  };

  return (
    <button
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        border: 'none',
        borderRadius: '8px',
        cursor: disabled || isLoading ? 'not-allowed' : 'pointer',
        transition: 'all 0.2s ease-in-out',
        width: fullWidth ? '100%' : 'auto',
        ...getVariantStyles(),
        ...getSizeStyles(),
        ...getHoverStyles(),
        ...getActiveStyles(),
        ...(disabled || isLoading ? getDisabledStyles() : {}),
        ...style,
      }}
      disabled={disabled || isLoading}
      onClick={handleClick}
      {...props}
    >
      {isLoading ? (
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid #ffffff',
            borderTop: '2px solid transparent',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
          }}
        />
      ) : (
        <>
          {leftIcon}
          {children}
          {rightIcon}
        </>
      )}
    </button>
  );
}; 