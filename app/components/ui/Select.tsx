import React from 'react';

interface Option {
  value: string;
  label: string;
}

interface SelectProps extends Omit<React.SelectHTMLAttributes<HTMLSelectElement>, 'onChange'> {
  label?: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
}

export const Select: React.FC<SelectProps> = ({ label, options, ...props }) => {
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
      <select
        {...props}
        style={{
          width: '100%',
          padding: '8px 12px',
          borderRadius: '4px',
          border: '1px solid #E0E0E0',
          fontSize: '14px',
          fontFamily: 'inherit',
          backgroundColor: 'white',
          ...props.style,
        }}
      >
        {options.map(option => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}; 