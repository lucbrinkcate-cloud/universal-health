import { MuscleGroup, MuscleStatus } from '../stores/avatarStore';

export type WorkoutType = 
  | 'pushups'
  | 'pullups'
  | 'squats'
  | 'lunges'
  | 'plank'
  | 'running'
  | 'cycling'
  | 'swimming'
  | 'weights'
  | 'yoga'
  | 'boxing'
  | 'jump_rope';

interface MuscleActivation {
  muscleId: keyof Record<string, MuscleGroup>;
  intensity: number;
}

const WORKOUT_MUSCLE_MAP: Record<WorkoutType, MuscleActivation[]> = {
  pushups: [
    { muscleId: 'chest', intensity: 90 },
    { muscleId: 'shoulders', intensity: 60 },
    { muscleId: 'triceps', intensity: 80 },
    { muscleId: 'abs', intensity: 30 },
  ],
  pullups: [
    { muscleId: 'back', intensity: 90 },
    { muscleId: 'biceps', intensity: 80 },
    { muscleId: 'shoulders', intensity: 40 },
  ],
  squats: [
    { muscleId: 'quads', intensity: 90 },
    { muscleId: 'glutes', intensity: 85 },
    { muscleId: 'hamstrings', intensity: 50 },
    { muscleId: 'calves', intensity: 30 },
  ],
  lunges: [
    { muscleId: 'quads', intensity: 70 },
    { muscleId: 'glutes', intensity: 60 },
    { muscleId: 'hamstrings', intensity: 40 },
    { muscleId: 'calves', intensity: 30 },
  ],
  plank: [
    { muscleId: 'abs', intensity: 90 },
    { muscleId: 'shoulders', intensity: 50 },
    { muscleId: 'back', intensity: 40 },
  ],
  running: [
    { muscleId: 'quads', intensity: 80 },
    { muscleId: 'hamstrings', intensity: 60 },
    { muscleId: 'calves', intensity: 70 },
    { muscleId: 'glutes', intensity: 40 },
  ],
  cycling: [
    { muscleId: 'quads', intensity: 85 },
    { muscleId: 'calves', intensity: 60 },
    { muscleId: 'glutes', intensity: 40 },
  ],
  swimming: [
    { muscleId: 'back', intensity: 70 },
    { muscleId: 'shoulders', intensity: 80 },
    { muscleId: 'chest', intensity: 60 },
    { muscleId: 'abs', intensity: 50 },
  ],
  weights: [
    { muscleId: 'biceps', intensity: 70 },
    { muscleId: 'triceps', intensity: 70 },
    { muscleId: 'shoulders', intensity: 60 },
    { muscleId: 'chest', intensity: 50 },
    { muscleId: 'back', intensity: 50 },
  ],
  yoga: [
    { muscleId: 'abs', intensity: 30 },
    { muscleId: 'back', intensity: 30 },
    { muscleId: 'hamstrings', intensity: 20 },
  ],
  boxing: [
    { muscleId: 'shoulders', intensity: 80 },
    { muscleId: 'biceps', intensity: 60 },
    { muscleId: 'abs', intensity: 50 },
    { muscleId: 'calves', intensity: 40 },
  ],
  jump_rope: [
    { muscleId: 'calves', intensity: 90 },
    { muscleId: 'shoulders', intensity: 40 },
    { muscleId: 'abs', intensity: 30 },
  ],
};

const RECOVERY_TIME_MS = 48 * 60 * 60 * 1000;
const TRAINED_DURATION_MS = 12 * 60 * 60 * 1000;

export const getMusclesForWorkout = (workoutType: WorkoutType): MuscleActivation[] => {
  return WORKOUT_MUSCLE_MAP[workoutType] || [];
};

export const calculateMuscleStatus = (lastTrained?: string): MuscleStatus => {
  if (!lastTrained) return 'fresh';
  
  const now = Date.now();
  const trainedTime = new Date(lastTrained).getTime();
  const hoursSinceTrained = (now - trainedTime) / (1000 * 60 * 60);
  
  if (hoursSinceTrained < 12) return 'trained';
  if (hoursSinceTrained < 48) return 'recovering';
  return 'fresh';
};

export const getMuscleStatusColor = (status: MuscleStatus): string => {
  switch (status) {
    case 'trained':
      return '#4CAF50';
    case 'recovering':
      return '#FF9800';
    case 'fresh':
    default:
      return '#9E9E9E';
  }
};

export const getAllMuscleIds = (): string[] => {
  return Object.keys(WORKOUT_MUSCLE_MAP).reduce((acc, workout) => {
    const muscles = WORKOUT_MUSCLE_MAP[workout as WorkoutType];
    muscles.forEach(m => {
      if (!acc.includes(m.muscleId)) {
        acc.push(m.muscleId);
      }
    });
    return acc;
  }, [] as string[]);
};

export const calculateOverallMuscleHealth = (
  muscleGroups: Record<string, MuscleGroup>
): number => {
  const muscles = Object.values(muscleGroups);
  if (muscles.length === 0) return 100;
  
  const totalScore = muscles.reduce((acc, muscle) => {
    let score = 100;
    if (muscle.status === 'trained') score = 70;
    if (muscle.status === 'recovering') score = 40;
    return acc + score;
  }, 0);
  
  return Math.round(totalScore / muscles.length);
};

export const getRecommendedMuscles = (
  muscleGroups: Record<string, MuscleGroup>
): string[] => {
  const recovering: string[] = [];
  const fresh: string[] = [];
  
  Object.values(muscleGroups).forEach(muscle => {
    if (muscle.status === 'recovering') {
      recovering.push(muscle.name);
    } else if (muscle.status === 'fresh') {
      fresh.push(muscle.name);
    }
  });
  
  return fresh.length > 0 ? fresh : recovering;
};

export const getMuscleDisplayName = (muscleId: string): string => {
  const names: Record<string, string> = {
    chest: 'Chest',
    back: 'Back',
    shoulders: 'Shoulders',
    biceps: 'Biceps',
    triceps: 'Triceps',
    abs: 'Abs',
    quads: 'Quadriceps',
    hamstrings: 'Hamstrings',
    calves: 'Calves',
    glutes: 'Glutes',
  };
  return names[muscleId] || muscleId;
};
