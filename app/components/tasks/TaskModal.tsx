'use client';

import React, { useState, useEffect } from 'react';
import { Task, IconLibrary } from '../../types';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi2';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (task: Partial<Task>) => void;
  task?: Task;
  boardId: string;
  position?: { x: number; y: number };
}

const iconLibraries = [
  { name: 'Font Awesome', value: 'fa' as IconLibrary, icons: FaIcons },
  { name: 'Material Design', value: 'md' as IconLibrary, icons: MdIcons },
  { name: 'Ionicons', value: 'io' as IconLibrary, icons: IoIcons },
  { name: 'Bootstrap', value: 'bi' as IconLibrary, icons: BiIcons },
  { name: 'Heroicons', value: 'hi' as IconLibrary, icons: HiIcons },
];

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
  boardId,
  position,
}) => {
  const [mounted, setMounted] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>('fa');
  const [iconName, setIconName] = useState('FaCar');
  const [warningHours, setWarningHours] = useState(24);
  const [criticalHours, setCriticalHours] = useState(48);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description);
      setIconLibrary(task.iconLibrary);
      setIconName(task.iconName);
      setWarningHours(task.warningHours);
      setCriticalHours(task.criticalHours);
    } else {
      setTitle('');
      setDescription('');
      setIconLibrary('fa');
      setIconName('FaCar');
      setWarningHours(24);
      setCriticalHours(48);
    }
  }, [task]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      iconLibrary,
      iconName,
      warningHours,
      criticalHours,
      boardId,
      status: task?.status || 'active',
      lastInteraction: Date.now(),
    });
    onClose();
  };

  if (!isOpen || !mounted) return null;

  const currentLibrary = iconLibraries.find(lib => lib.value === iconLibrary)?.icons || FaIcons;
  const IconComponent = currentLibrary[iconName as keyof typeof currentLibrary] || FaIcons.FaCar;

  const iconOptions = Object.keys(currentLibrary)
    .filter((key) => key.startsWith('Fa') || key.startsWith('Md') || key.startsWith('Io') || key.startsWith('Bi') || key.startsWith('Hi'))
    .map((key) => ({
      value: key,
      label: key,
    }));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg p-6 w-full max-w-md transform transition-transform"
        style={{
          position: 'fixed',
          left: position ? `${position.x}px` : '50%',
          top: position ? `${position.y}px` : '50%',
          transform: 'translate(-50%, -50%)',
        }}
      >
        <h2 className="text-xl font-bold mb-4">
          {task ? 'Edit Task' : 'Create Task'}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title
            </label>
            <input
              type="text"
              value={title}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border rounded-md"
              required
            />
          </div>
          <div className="mb-4">
            <Textarea
              label="Description"
              value={description}
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              rows={3}
            />
          </div>
          <div className="mb-4">
            <Select
              label="Icon Library"
              value={iconLibrary}
              onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
                const value = e.target.value as IconLibrary;
                setIconLibrary(value);
                const library = iconLibraries.find(lib => lib.value === value);
                if (library) {
                  const firstIcon = Object.keys(library.icons)
                    .find(key => key.startsWith('Fa') || key.startsWith('Md') || key.startsWith('Io') || key.startsWith('Bi') || key.startsWith('Hi'));
                  if (firstIcon) {
                    setIconName(firstIcon);
                  }
                }
              }}
              options={iconLibraries.map((lib) => ({
                value: lib.value,
                label: lib.name,
              }))}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Icon
            </label>
            <div className="flex items-center gap-2">
              <Select
                value={iconName}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIconName(e.target.value)}
                options={iconOptions}
              />
              <div className="p-2 bg-gray-100 rounded-md">
                {React.createElement(IconComponent, { size: 24 })}
              </div>
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Warning Hours
            </label>
            <input
              type="number"
              value={warningHours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setWarningHours(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min="1"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Critical Hours
            </label>
            <input
              type="number"
              value={criticalHours}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCriticalHours(Number(e.target.value))}
              className="w-full px-3 py-2 border rounded-md"
              min={warningHours + 1}
              required
            />
          </div>
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600 hover:text-gray-800"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              {task ? 'Save' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}; 