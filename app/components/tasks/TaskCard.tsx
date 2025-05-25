'use client';

import React from 'react';
import { Task } from '../../types';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';

interface TaskCardProps {
  task: Task;
  onStatusChange?: (taskId: string, newStatus: Task['status']) => void;
  onEdit?: (taskId: string) => void;
  onDelete?: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onStatusChange, onEdit, onDelete }) => {
  const [isPressed, setIsPressed] = React.useState(false);
  const pressTimer = React.useRef<NodeJS.Timeout>();

  const handlePressStart = () => {
    pressTimer.current = setTimeout(() => {
      setIsPressed(true);
      if (onEdit) onEdit(task.id);
    }, 500);
  };

  const handlePressEnd = () => {
    if (pressTimer.current) {
      clearTimeout(pressTimer.current);
    }
    if (!isPressed && onStatusChange) {
      const newStatus = task.status === 'active' ? 'warning' : 
                       task.status === 'warning' ? 'critical' : 
                       task.status === 'critical' ? 'completed' : 'active';
      onStatusChange(task.id, newStatus);
    }
    setIsPressed(false);
  };

  const getStatusColor = (status: Task['status']) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'warning':
        return 'bg-yellow-500';
      case 'critical':
        return 'bg-red-500';
      case 'completed':
        return 'bg-gray-500';
      default:
        return 'bg-gray-500';
    }
  };

  const IconComponent = React.useMemo(() => {
    if (!task.iconName) return FaIcons.FaCar;
    switch (task.iconLibrary) {
      case 'fa':
        return FaIcons[task.iconName as keyof typeof FaIcons] || FaIcons.FaCar;
      case 'md':
        return MdIcons[task.iconName as keyof typeof MdIcons] || MdIcons.MdDashboard;
      case 'io':
        return IoIcons[task.iconName as keyof typeof IoIcons] || IoIcons.IoCarSport;
      case 'bi':
        return BiIcons[task.iconName as keyof typeof BiIcons] || BiIcons.BiCar;
      case 'hi':
        return HiIcons[task.iconName as keyof typeof HiIcons] || HiIcons.HiOutlineHome;
      default:
        return FaIcons.FaCar;
    }
  }, [task.iconLibrary, task.iconName]);

  const lastInteraction = new Date(task.lastInteraction);
  const hoursSinceLastInteraction = Math.floor(
    (Date.now() - task.lastInteraction) / (1000 * 60 * 60)
  );

  return (
    <div
      className={`p-4 rounded-lg shadow-md bg-white cursor-pointer transition-transform ${
        isPressed ? 'scale-95' : 'hover:scale-105'
      }`}
      onMouseDown={handlePressStart}
      onMouseUp={handlePressEnd}
      onMouseLeave={handlePressEnd}
      onTouchStart={handlePressStart}
      onTouchEnd={handlePressEnd}
    >
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-full ${getStatusColor(task.status)}`}>
          {React.createElement(IconComponent, { size: 24, className: 'text-white' })}
        </div>
        <div className="flex-1">
          <h3 className="font-medium">{task.title}</h3>
          <p className="text-sm text-gray-600">{task.description}</p>
        </div>
      </div>
      <div className="mt-2 text-xs text-gray-500">
        Last interaction: {lastInteraction.toLocaleString()}
        {hoursSinceLastInteraction > 0 && (
          <span className="ml-2">
            ({hoursSinceLastInteraction} hours ago)
          </span>
        )}
      </div>
    </div>
  );
}; 