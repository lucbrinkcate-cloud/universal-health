export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

export interface HealthData {
  steps: number;
  heartRate: number;
  heartRateData: HeartRateReading[];
  sleepData: SleepData;
  lastUpdated: string;
}

export interface HeartRateReading {
  timestamp: string;
  value: number;
}

export interface SleepData {
  totalMinutes: number;
  deepMinutes: number;
  lightMinutes: number;
  remMinutes: number;
  awakeMinutes: number;
  score: number;
}

export interface Workout {
  id: string;
  name: string;
  type: string;
  startTime: string;
  endTime: string;
  duration: number;
  calories: number;
  distance?: number;
  averageHeartRate?: number;
  maxHeartRate?: number;
}

export interface BodyMetrics {
  weight?: number;
  height?: number;
  bmi?: number;
  bodyFat?: number;
  muscleMass?: number;
  waterPercentage?: number;
  boneMass?: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  heartRate?: number;
  temperature?: number;
  oxygenSaturation?: number;
}

export interface StravaActivity {
  id: string;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  timezone: string;
  utc_offset: number;
  average_speed: number;
  max_speed: number;
  has_heartrate: boolean;
  average_heartrate?: number;
  max_heartrate?: number;
  calories?: number;
}

export interface DeviceProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: "connected" | "disconnected" | "pending";
}

export interface TerraMetrics {
  steps?: number;
  calories?: number;
  distance?: number;
  heartRate?: {
    avg: number;
    max: number;
    min: number;
    readings: Array<{ timestamp: string; value: number }>;
  };
  sleep?: {
    totalMinutes: number;
    deepMinutes: number;
    lightMinutes: number;
    remMinutes: number;
    awakeMinutes: number;
    score?: number;
  };
}

export interface TerraProvider {
  id: string;
  name: string;
  logo: string;
  description: string;
  status: 'connected' | 'disconnected' | 'pending';
}

export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  Main: undefined;
  BodyRegionDetail: { region: BodyRegion };
};

export type MainTabParamList = {
  Dashboard: undefined;
  Gamification: undefined;
  Friends: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Dashboard: undefined;
  Biometrics: undefined;
};

export type ActivityStackParamList = {
  Gamification: undefined;
  Analytics: undefined;
  Leaderboard: undefined;
};

export type SocialStackParamList = {
  Friends: undefined;
};

export type ProfileStackParamList = {
  Profile: undefined;
  Devices: undefined;
  Notifications: undefined;
};

export type BodyRegion = 
  | 'cardiovascular'
  | 'respiratory'
  | 'musculoskeletal'
  | 'nervous'
  | 'digestive'
  | 'endocrine'
  | 'immune'
  | 'general';

export type HealthStatus = 'good' | 'warning' | 'alert';

export interface BodyRegionData {
  region: BodyRegion;
  name: string;
  status: HealthStatus;
  score: number;
  metrics: RegionMetric[];
}

export interface RegionMetric {
  key: string;
  label: string;
  value: number;
  unit: string;
  status: HealthStatus;
  score: number;
  range: {
    min: number;
    max: number;
    optimal: number;
  };
}

export interface ExtendedHealthData extends HealthData {
  spo2: number;
  stressLevel: number;
  hrv: number;
  respiratoryRate: number;
  bodyTemperature: number;
  bloodPressure?: {
    systolic: number;
    diastolic: number;
  };
  bodyRegionData: BodyRegionData[];
  overallHealthScore: number;
}

export interface UserProgress {
  level: number;
  xp: number;
  xpToNextLevel: number;
  totalXp: number;
  streak: number;
  lastActiveDate: string;
}

export interface Currency {
  coins: number;
  gems: number;
}

export type AchievementCategory = 
  | 'steps'
  | 'sleep'
  | 'heart'
  | 'streak'
  | 'social'
  | 'collection';

export type AchievementTier = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface Achievement {
  id: string;
  name: string;
  description: string;
  category: AchievementCategory;
  tier: AchievementTier;
  icon: string;
  requirement: number;
  reward: {
    xp: number;
    coins: number;
  };
  unlockedAt?: string;
  progress: number;
}

export interface AvatarState {
  mood: 'happy' | 'neutral' | 'tired' | 'sick' | 'energized';
  energy: number;
  health: number;
  lastFed: string;
  lastExercised: string;
  accessories: string[];
  evolutionStage: number;
}

export interface DailyChallenge {
  id: string;
  title: string;
  description: string;
  type: 'steps' | 'sleep' | 'heart' | 'hydration' | 'meditation';
  target: number;
  current: number;
  reward: {
    xp: number;
    coins: number;
  };
  completed: boolean;
  expiresAt: string;
}

export interface XPGain {
  amount: number;
  reason: string;
  timestamp: string;
}

export * from './notifications';
