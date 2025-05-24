import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  style,
  ...props
}) => {
  const baseStyle: React.CSSProperties = {
    width: '100%',
    padding: '8px 12px',
    borderRadius: '8px',
    border: error ? '1px solid #F44336' : '1px solid #E0E0E0',
    fontSize: '14px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    ...style,
  };

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '4px',
      }}
    >
      {label && (
        <label
          style={{
            fontSize: '14px',
            fontWeight: 500,
            color: '#666666',
          }}
        >
          {label}
        </label>
      )}
      <input
        style={baseStyle}
        {...props}
      />
      {error && (
        <span
          style={{
            fontSize: '12px',
            color: '#F44336',
          }}
        >
          {error}
        </span>
      )}
    </div>
  );
}; 