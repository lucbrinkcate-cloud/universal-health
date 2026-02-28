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