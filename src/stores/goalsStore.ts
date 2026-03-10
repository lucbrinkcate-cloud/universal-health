import { create } from 'zustand';

export interface Goal {
  id: number;
  name: string;
  current: number;
  target: number;
  unit: string;
  type: 'weight' | 'fitness' | 'activity' | 'nutrition';
  deadline: string;
  onTrack: boolean;
}

export interface GoalState {
  goals: Goal[];
  addGoal: (goal: Omit<Goal, 'id'>) => void;
  updateGoal: (id: number, updates: Partial<Goal>) => void;
  removeGoal: (id: number) => void;
}

const DEFAULT_GOALS: Goal[] = [
  { id: 1, name: 'Lose 5kg', current: 77.2, target: 72, unit: 'kg', type: 'weight', deadline: '2025-06-30', onTrack: true },
  { id: 2, name: 'Run 5K < 25min', current: 27.5, target: 25, unit: 'min', type: 'fitness', deadline: '2025-05-01', onTrack: true },
  { id: 3, name: '10,000 Daily Steps', current: 8420, target: 10000, unit: 'steps', type: 'activity', deadline: '2025-04-01', onTrack: false },
];

export const useGoalsStore = create<GoalState>((set) => ({
  goals: DEFAULT_GOALS,

  addGoal: (goal) => {
    set((state) => ({
      goals: [...state.goals, { ...goal, id: Date.now() }],
    }));
  },

  updateGoal: (id, updates) => {
    set((state) => ({
      goals: state.goals.map((goal) =>
        goal.id === id ? { ...goal, ...updates } : goal
      ),
    }));
  },

  removeGoal: (id) => {
    set((state) => ({
      goals: state.goals.filter((goal) => goal.id !== id),
    }));
  },
}));

export default useGoalsStore;
