import { v4 as uuidv4 } from 'uuid';
import { Board, Task } from '../types';
import { getRandomIcon } from './iconCategories';

const createInitialTask = (
  name: string,
  boardId: string,
  warningHours: number,
  criticalHours: number,
  status: 'inactive' | 'warning' | 'critical' = 'inactive'
): Task => {
  const now = new Date();
  const randomIcon = getRandomIcon();
  
  return {
    id: uuidv4(),
    name,
    boardId,
    description: '',
    iconName: randomIcon.name,
    iconLibrary: 'fa',
    warningHours,
    criticalHours,
    status,
    lastInteraction: now,
    createdAt: now,
  };
};

export const createInitialBoards = (): Board[] => {
  const now = new Date();
  
  const healthBoard: Board = {
    id: uuidv4(),
    name: 'Health',
    order: 0,
    createdAt: now,
  };

  const selfCareBoard: Board = {
    id: uuidv4(),
    name: 'Self Care',
    order: 1,
    createdAt: now,
  };

  const homeBoard: Board = {
    id: uuidv4(),
    name: 'Home',
    order: 2,
    createdAt: now,
  };

  const sportBoard: Board = {
    id: uuidv4(),
    name: 'Sports',
    order: 3,
    createdAt: now,
  };

  return [healthBoard, selfCareBoard, homeBoard, sportBoard];
};

export const createInitialTasks = (boards: Board[]): Task[] => {
  const tasks: Task[] = [];
  
  // Health tasks
  const healthBoard = boards.find(b => b.name === 'Health');
  if (healthBoard) {
    tasks.push(
      createInitialTask('Dental Cleaning', healthBoard.id, 24 * 7, 24 * 7),
      createInitialTask('Eye Check-up', healthBoard.id, 24 * 30, 24 * 30),
      createInitialTask('Blood Tests', healthBoard.id, 24 * 14, 24 * 14),
      createInitialTask('Vitamins', healthBoard.id, 24 * 3, 24 * 3)
    );
  }

  // Self Care tasks
  const selfCareBoard = boards.find(b => b.name === 'Self Care');
  if (selfCareBoard) {
    tasks.push(
      createInitialTask('Haircut', selfCareBoard.id, 24 * 7, 24 * 7),
      createInitialTask('Manicure', selfCareBoard.id, 24 * 3, 24 * 3),
      createInitialTask('Cosmetics Shopping', selfCareBoard.id, 24 * 7, 24 * 7),
      createInitialTask('Skin Care', selfCareBoard.id, 24, 24)
    );
  }

  // Home tasks
  const homeBoard = boards.find(b => b.name === 'Home');
  if (homeBoard) {
    tasks.push(
      createInitialTask('Deep Cleaning', homeBoard.id, 24, 24),
      createInitialTask('Bedding Change', homeBoard.id, 24 * 2, 24 * 2),
      createInitialTask('Fridge Cleaning', homeBoard.id, 24 * 7, 24 * 7),
      createInitialTask('Laundry', homeBoard.id, 24, 24)
    );
  }

  // Sports tasks
  const sportBoard = boards.find(b => b.name === 'Sports');
  if (sportBoard) {
    tasks.push(
      createInitialTask('Upper Body Workout', sportBoard.id, 24 * 2, 24 * 2),
      createInitialTask('Cardio', sportBoard.id, 24 * 3, 24 * 3),
      createInitialTask('Stretching/Yoga', sportBoard.id, 12, 12),
      createInitialTask('Swimming', sportBoard.id, 24 * 2, 24 * 2)
    );
  }

  return tasks;
}; 