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

export interface TerraActivity {
  id: string;
  source: string;
  sourceData: Record<string, unknown>;
  startTime: string;
  endTime: string;
  metrics: TerraMetrics;
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
};

export type MainTabParamList = {
  Dashboard: undefined;
  Devices: undefined;
  Profile: undefined;
};
