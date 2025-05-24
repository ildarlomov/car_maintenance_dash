import React from 'react';

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout: React.FC<LayoutProps> = ({ children }) => {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#F5F5F5',
        padding: '0 16px',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '16px 0',
        }}
      >
        {children}
      </div>
    </div>
  );
}; 