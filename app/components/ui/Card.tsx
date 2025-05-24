import React from 'react';
import { getHoverStyles, getActiveStyles } from '../../utils/animations';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  onClick?: () => void;
  style?: React.CSSProperties;
}

export const Card: React.FC<CardProps> = ({
  children,
  variant = 'default',
  onClick,
  style,
}) => {
  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          border: 'none',
        };
      case 'outlined':
        return {
          boxShadow: 'none',
          border: '1px solid #E0E0E0',
        };
      default:
        return {
          boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)',
          border: 'none',
        };
    }
  };

  return (
    <div
      style={{
        backgroundColor: '#FFFFFF',
        borderRadius: '12px',
        padding: '16px',
        transition: 'all 0.2s ease-in-out',
        cursor: onClick ? 'pointer' : 'default',
        ...getVariantStyles(),
        ...(onClick ? { ...getHoverStyles(), ...getActiveStyles() } : {}),
        ...style,
      }}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

interface CardHeaderProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardHeader: React.FC<CardHeaderProps> = ({ children, style }) => (
  <div
    style={{
      marginBottom: '16px',
      ...style,
    }}
  >
    {children}
  </div>
);

interface CardContentProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardContent: React.FC<CardContentProps> = ({ children, style }) => (
  <div
    style={{
      ...style,
    }}
  >
    {children}
  </div>
);

interface CardFooterProps {
  children: React.ReactNode;
  style?: React.CSSProperties;
}

export const CardFooter: React.FC<CardFooterProps> = ({ children, style }) => (
  <div
    style={{
      marginTop: '16px',
      display: 'flex',
      justifyContent: 'flex-end',
      gap: '8px',
      ...style,
    }}
  >
    {children}
  </div>
); 