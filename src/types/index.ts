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
  BodyRegionDetail: { region: BodyRegion };
};

export type MainTabParamList = {
  Dashboard: undefined;
  DigitalTwin: undefined;
  Devices: undefined;
  Profile: undefined;
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
