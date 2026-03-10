import { create } from 'zustand';

export interface Exercise {
  id: number;
  name: string;
  muscle: string;
  equipment: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  emoji: string;
}

export interface WorkoutHistoryItem {
  id: number;
  name: string;
  date: string;
  duration: number;
  calories: number;
  exercises: number;
  volume: number;
}

export interface PersonalRecord {
  exercise: string;
  weight: number;
  date: string;
}

export type ActivityType = 'Run' | 'Ride' | 'Swim' | 'IceSkate' | 'Walk' | 'Hike' | 'Workout' | 'Rowing' | 'Elliptical' | 'StairStepper' | 'WeightTraining' | 'Yoga' | 'CrossFit' | 'RockClimbing' | 'Ski' | 'Snowboard' | 'Kayaking' | 'Canoeing' | 'Sailing' | 'Windsurf' | 'Surfing' | 'Kiteboarding' | 'Wakeboarding' | 'WaterSkiing' | 'Tubing' | 'Rowing' | 'DragonBoat' | 'StandUpPaddle' | 'Inline' | 'RockClimbing' | 'RollerSki' | 'Snowshoe' | 'MountainBike' | 'Cyclocross' | 'Track' | 'Triathlon' | 'Duathlon' | 'Aquathlon' | 'SwimRun';

export interface StravaActivity {
  id: number;
  name: string;
  type: ActivityType;
  distance: number;
  time: string;
  pace: string;
  heartRate: number;
  calories: number;
  elevation: number;
  date: string;
  startTime: string;
}

export interface FitnessState {
  exercises: Exercise[];
  history: WorkoutHistoryItem[];
  prs: PersonalRecord[];
  activities: StravaActivity[];
  activeWorkout: {
    name: string;
    exercises: number[];
    startTime: number;
  } | null;
  timer: number;
  isRunning: boolean;
  startWorkout: (name: string, exerciseIds: number[]) => void;
  endWorkout: () => void;
  setTimer: (time: number) => void;
  setRunning: (running: boolean) => void;
  addToHistory: (workout: Omit<WorkoutHistoryItem, 'id'>) => void;
  addActivity: (activity: Omit<StravaActivity, 'id'>) => void;
}

const EXERCISES: Exercise[] = [
  { id: 1, name: 'Barbell Squat', muscle: 'Legs', equipment: 'Barbell', difficulty: 'Intermediate', emoji: '🦵' },
  { id: 2, name: 'Bench Press', muscle: 'Chest', equipment: 'Barbell', difficulty: 'Intermediate', emoji: '💪' },
  { id: 3, name: 'Deadlift', muscle: 'Back', equipment: 'Barbell', difficulty: 'Advanced', emoji: '🏋️' },
  { id: 4, name: 'Pull-ups', muscle: 'Back', equipment: 'Bodyweight', difficulty: 'Intermediate', emoji: '💪' },
  { id: 5, name: 'Push-ups', muscle: 'Chest', equipment: 'Bodyweight', difficulty: 'Beginner', emoji: '🤸' },
  { id: 6, name: 'Overhead Press', muscle: 'Shoulders', equipment: 'Barbell', difficulty: 'Intermediate', emoji: '🏋️' },
  { id: 7, name: 'Lunges', muscle: 'Legs', equipment: 'Bodyweight', difficulty: 'Beginner', emoji: '🦵' },
  { id: 8, name: 'Plank', muscle: 'Core', equipment: 'Bodyweight', difficulty: 'Beginner', emoji: '🤸' },
  { id: 9, name: 'Burpees', muscle: 'Full Body', equipment: 'Bodyweight', difficulty: 'Intermediate', emoji: '🔥' },
  { id: 10, name: 'Mountain Climbers', muscle: 'Core', equipment: 'Bodyweight', difficulty: 'Intermediate', emoji: '⛰️' },
  { id: 11, name: 'Bicep Curl', muscle: 'Arms', equipment: 'Dumbbell', difficulty: 'Beginner', emoji: '💪' },
  { id: 12, name: 'Tricep Dip', muscle: 'Arms', equipment: 'Bodyweight', difficulty: 'Intermediate', emoji: '💪' },
];

const DEFAULT_HISTORY: WorkoutHistoryItem[] = [
  { id: 1, name: 'Full Body A', date: 'Today', duration: 52, calories: 380, exercises: 6, volume: 4200 },
  { id: 2, name: 'HIIT Session', date: 'Yesterday', duration: 25, calories: 310, exercises: 5, volume: 0 },
  { id: 3, name: 'Upper Body', date: '2 days ago', duration: 48, calories: 340, exercises: 7, volume: 5100 },
];

const DEFAULT_PRS: PersonalRecord[] = [
  { exercise: 'Bench Press', weight: 90, date: '1 week ago' },
  { exercise: 'Squat', weight: 110, date: '3 days ago' },
  { exercise: 'Deadlift', weight: 130, date: '2 weeks ago' },
];

const DEFAULT_ACTIVITIES: StravaActivity[] = [
  { id: 1, name: 'Morning Run', type: 'Run', distance: 5.2, time: '28:14', pace: '5:25/km', heartRate: 152, calories: 420, elevation: 45, date: 'Today', startTime: '6:30 AM' },
  { id: 2, name: 'Evening Ride', type: 'Ride', distance: 15.8, time: '42:30', pace: '22.3 km/h', heartRate: 138, calories: 380, elevation: 120, date: 'Yesterday', startTime: '5:45 PM' },
  { id: 3, name: 'Long Run Sunday', type: 'Run', distance: 10.4, time: '58:22', pace: '5:37/km', heartRate: 148, calories: 820, elevation: 85, date: 'Sun', startTime: '7:00 AM' },
  { id: 4, name: 'Interval Session', type: 'Run', distance: 7.1, time: '35:48', pace: '5:02/km', heartRate: 168, calories: 540, elevation: 32, date: 'Fri', startTime: '6:15 AM' },
  { id: 5, name: 'Trail Hike', type: 'Hike', distance: 8.3, time: '1:45:00', pace: '12:39/km', heartRate: 125, calories: 520, elevation: 450, date: 'Sat', startTime: '8:00 AM' },
  { id: 6, name: 'Ice Skating Practice', type: 'IceSkate', distance: 4.5, time: '35:00', pace: '7:47/km', heartRate: 142, calories: 320, elevation: 0, date: 'Thu', startTime: '4:00 PM' },
  { id: 7, name: 'Mountain Bike Ride', type: 'MountainBike', distance: 22.1, time: '1:32:00', pace: '4:11/km', heartRate: 155, calories: 890, elevation: 580, date: 'Wed', startTime: '9:00 AM' },
  { id: 8, name: 'Swim Laps', type: 'Swim', distance: 1.5, time: '45:00', pace: '30:00/km', heartRate: 135, calories: 480, elevation: 0, date: 'Mon', startTime: '12:00 PM' },
  { id: 9, name: 'Morning Walk', type: 'Walk', distance: 3.2, time: '38:00', pace: '11:52/km', heartRate: 98, calories: 145, elevation: 15, date: 'Today', startTime: '7:30 AM' },
  { id: 10, name: 'Yoga Session', type: 'Yoga', distance: 0, time: '45:00', pace: '--', heartRate: 75, calories: 120, elevation: 0, date: 'Yesterday', startTime: '6:00 PM' },
  { id: 11, name: 'Weight Training', type: 'WeightTraining', distance: 0, time: '52:00', pace: '--', heartRate: 120, calories: 380, elevation: 0, date: 'Today', startTime: '5:30 PM' },
  { id: 12, name: 'Race Cycling', type: 'Ride', distance: 35.6, time: '1:15:00', pace: '28.5 km/h', heartRate: 158, calories: 720, elevation: 280, date: 'Sun', startTime: '8:00 AM' },
  { id: 13, name: 'Track Intervals', type: 'Track', distance: 8.0, time: '38:00', pace: '4:45/km', heartRate: 172, calories: 620, elevation: 0, date: 'Fri', startTime: '6:00 AM' },
  { id: 14, name: 'Indoor Rowing', type: 'Rowing', distance: 5.0, time: '28:00', pace: '5:36/km', heartRate: 145, calories: 350, elevation: 0, date: 'Wed', startTime: '7:00 AM' },
  { id: 15, name: 'Elliptical Session', type: 'Elliptical', distance: 3.8, time: '30:00', pace: '7:53/km', heartRate: 130, calories: 240, elevation: 0, date: 'Tue', startTime: '6:30 AM' },
  { id: 16, name: 'Stair Climber', type: 'StairStepper', distance: 2.1, time: '25:00', pace: '11:54/km', heartRate: 148, calories: 280, elevation: 180, date: 'Mon', startTime: '5:00 PM' },
  { id: 17, name: 'CrossFit WOD', type: 'CrossFit', distance: 0, time: '45:00', pace: '--', heartRate: 165, calories: 520, elevation: 0, date: 'Thu', startTime: '7:00 AM' },
  { id: 18, name: 'Rock Climbing', type: 'RockClimbing', distance: 0, time: '1:15:00', pace: '--', heartRate: 138, calories: 420, elevation: 200, date: 'Sat', startTime: '10:00 AM' },
  { id: 19, name: 'Skiing', type: 'Ski', distance: 12.5, time: '1:30:00', pace: '7:12/km', heartRate: 142, calories: 680, elevation: 850, date: 'Sun', startTime: '9:00 AM' },
  { id: 20, name: 'Kayaking', type: 'Kayaking', distance: 6.8, time: '55:00', pace: '8:05/km', heartRate: 115, calories: 320, elevation: 0, date: 'Fri', startTime: '2:00 PM' },
];

export const QUICK_STARTS = [
  { name: 'Full Body', duration: '30 min', calories: 280, emoji: '🏋️' },
  { name: 'HIIT', duration: '20 min', calories: 320, emoji: '🔥' },
  { name: 'Core', duration: '15 min', calories: 120, emoji: '🎯' },
  { name: 'Yoga', duration: '25 min', calories: 100, emoji: '🧘' },
  { name: 'Strength', duration: '45 min', calories: 380, emoji: '💪' },
  { name: 'Stretch', duration: '10 min', calories: 50, emoji: '🤸' },
];

export const useFitnessStore = create<FitnessState>((set) => ({
  exercises: EXERCISES,
  history: DEFAULT_HISTORY,
  prs: DEFAULT_PRS,
  activities: DEFAULT_ACTIVITIES,
  activeWorkout: null,
  timer: 0,
  isRunning: false,

  startWorkout: (name, exerciseIds) => {
    set({
      activeWorkout: {
        name,
        exercises: exerciseIds,
        startTime: Date.now(),
      },
      timer: 0,
      isRunning: true,
    });
  },

  endWorkout: () => {
    set((state) => {
      if (!state.activeWorkout) return state;
      
      const duration = Math.round((Date.now() - state.activeWorkout.startTime) / 60000);
      const newWorkout: WorkoutHistoryItem = {
        id: Date.now(),
        name: state.activeWorkout.name,
        date: 'Today',
        duration,
        calories: Math.round(duration * 7),
        exercises: state.activeWorkout.exercises.length,
        volume: Math.round(duration * 80),
      };

      return {
        activeWorkout: null,
        timer: 0,
        isRunning: false,
        history: [newWorkout, ...state.history],
      };
    });
  },

  setTimer: (time) => set({ timer: time }),
  setRunning: (running) => set({ isRunning: running }),

  addToHistory: (workout) => {
    set((state) => ({
      history: [{ ...workout, id: Date.now() }, ...state.history],
    }));
  },

  addActivity: (activity) => {
    set((state) => ({
      activities: [{ ...activity, id: Date.now() }, ...state.activities],
    }));
  },
}));

export default useFitnessStore;
