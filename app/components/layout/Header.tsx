'use client';

import React, { useState, useEffect } from 'react';

interface HeaderProps {
  title: string;
  currentTime: string;
  onAddBoard?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, currentTime, onAddBoard }) => {
  const [mounted, setMounted] = useState(false);
  const [time, setTime] = useState(currentTime);

  useEffect(() => {
    setMounted(true);
    const timer = setInterval(() => {
      setTime(new Date().toLocaleTimeString('en-US', {
        hour12: false,
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }));
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  if (!mounted) {
    return (
      <header className="flex items-center justify-between p-4 bg-white shadow-sm">
        <h1 className="text-2xl font-bold">{title}</h1>
        <div className="flex items-center gap-4">
          <span className="text-gray-600">{currentTime}</span>
          {onAddBoard && (
            <button
              onClick={onAddBoard}
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Board
            </button>
          )}
        </div>
      </header>
    );
  }

  return (
    <header className="flex items-center justify-between p-4 bg-white shadow-sm">
      <h1 className="text-2xl font-bold">{title}</h1>
      <div className="flex items-center gap-4">
        <span className="text-gray-600">{time}</span>
        {onAddBoard && (
          <button
            onClick={onAddBoard}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Add Board
          </button>
        )}
      </div>
    </header>
  );
}; 