import React from 'react';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
}

export const Textarea: React.FC<TextareaProps> = ({ label, ...props }) => {
  return (
    <div>
      {label && (
        <label
          style={{
            display: 'block',
            marginBottom: '4px',
            fontSize: '14px',
            fontWeight: 500,
          }}
        >
          {label}
        </label>
      )}
      <textarea
        {...props}
        style={{
          width: '100%',
          minHeight: '100px',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #E0E0E0',
          fontSize: '14px',
          fontFamily: 'inherit',
          resize: 'vertical',
          ...props.style,
        }}
      />
    </div>
  );
}; 