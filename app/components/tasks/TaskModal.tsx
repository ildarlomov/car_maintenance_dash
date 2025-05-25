import React, { useState } from 'react';
import { Task } from '../../types';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Textarea } from '../ui/Textarea';
import { Select } from '../ui/Select';
import * as FaIcons from 'react-icons/fa';
import * as MdIcons from 'react-icons/md';
import * as IoIcons from 'react-icons/io5';
import * as BiIcons from 'react-icons/bi';
import * as HiIcons from 'react-icons/hi';
import { hapticFeedback } from '../../utils/telegram';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskData: Omit<Task, 'id' | 'lastInteraction' | 'lastStatusChange'>) => void;
  task?: Task;
}

type IconLibrary = Task['iconLibrary'];

const iconLibraries: { value: IconLibrary; label: string }[] = [
  { value: 'fa', label: 'Font Awesome' },
  { value: 'md', label: 'Material Design' },
  { value: 'io', label: 'Ionicons' },
  { value: 'bi', label: 'Bootstrap' },
  { value: 'hi', label: 'Heroicons' },
];

const getIconOptions = (library: IconLibrary) => {
  switch (library) {
    case 'fa':
      return Object.keys(FaIcons).map(name => ({ value: name, label: name }));
    case 'md':
      return Object.keys(MdIcons).map(name => ({ value: name, label: name }));
    case 'io':
      return Object.keys(IoIcons).map(name => ({ value: name, label: name }));
    case 'bi':
      return Object.keys(BiIcons).map(name => ({ value: name, label: name }));
    case 'hi':
      return Object.keys(HiIcons).map(name => ({ value: name, label: name }));
    default:
      return [];
  }
};

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
  task,
}) => {
  const [name, setName] = useState(task?.name || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState<Task['status']>(task?.status || 'inactive');
  const [iconLibrary, setIconLibrary] = useState<IconLibrary>(task?.iconLibrary || 'fa');
  const [iconName, setIconName] = useState(task?.iconName || 'FaCar');

  const handleClose = () => {
    hapticFeedback.light();
    onClose();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    hapticFeedback.medium();
    onSubmit({
      name,
      description,
      status,
      iconLibrary,
      iconName,
    });
    onClose();
  };

  const IconComponent = React.useMemo(() => {
    switch (iconLibrary) {
      case 'fa':
        return FaIcons[iconName as keyof typeof FaIcons] || FaIcons.FaCar;
      case 'md':
        return MdIcons[iconName as keyof typeof MdIcons] || MdIcons.MdDashboard;
      case 'io':
        return IoIcons[iconName as keyof typeof IoIcons] || IoIcons.IoCarSport;
      case 'bi':
        return BiIcons[iconName as keyof typeof BiIcons] || BiIcons.BiCar;
      case 'hi':
        return HiIcons[iconName as keyof typeof HiIcons] || HiIcons.HiOutlineHome;
      default:
        return FaIcons.FaCar;
    }
  }, [iconLibrary, iconName]);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={task ? 'Edit Task' : 'Create Task'}>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <Input
            label="Name"
            value={name}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
            required
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Textarea
            label="Description"
            value={description}
            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Select
            label="Status"
            value={status}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setStatus(e.target.value as Task['status'])}
            options={[
              { value: 'inactive', label: 'Inactive' },
              { value: 'warning', label: 'Warning' },
              { value: 'critical', label: 'Critical' },
            ]}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Select
            label="Icon Library"
            value={iconLibrary}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => {
              const newLibrary = e.target.value as IconLibrary;
              setIconLibrary(newLibrary);
              const options = getIconOptions(newLibrary);
              setIconName(options[0]?.value || 'FaCar');
            }}
            options={iconLibraries}
          />
        </div>
        <div style={{ marginBottom: '16px' }}>
          <Select
            label="Icon"
            value={iconName}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setIconName(e.target.value)}
            options={getIconOptions(iconLibrary)}
          />
          <div style={{ marginTop: '8px', textAlign: 'center' }}>
            <IconComponent style={{ fontSize: '32px' }} />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
          <Button variant="secondary" onClick={handleClose}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            {task ? 'Save' : 'Create'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}; 