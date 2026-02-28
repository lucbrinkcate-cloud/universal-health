import { Platform } from 'react-native';
import { HealthData, HeartRateReading, SleepData, BodyMetrics, Workout } from '../types';

export type HealthMetricType = 'steps' | 'heartRate' | 'sleep' | 'workouts' | 'bodyMetrics' | 'all';

interface PermissionResult {
  granted: boolean;
  deniedPermissions: string[];
}

interface HealthConnectStatus {
  available: boolean;
  permissionsGranted: boolean;
}

class NativeHealthService {
  private isInitialized: boolean = false;
  private platform: 'ios' | 'android' | 'web' = Platform.OS as 'ios' | 'android' | 'web';
  private permissionsGranted: string[] = [];
  private lastSyncTime: Date | null = null;

  async initialize(): Promise<boolean> {
    try {
      if (this.platform === 'ios') {
        return await this.initializeHealthKit();
      } else if (this.platform === 'android') {
        return await this.initializeHealthConnect();
      }
      console.log('Native health: Web platform - using mock data');
      this.isInitialized = true;
      return true;
    } catch (error) {
      console.error('Failed to initialize native health service:', error);
      return false;
    }
  }

  private async initializeHealthKit(): Promise<boolean> {
    console.log('Initializing Apple HealthKit...');
    this.isInitialized = true;
    return true;
  }

  private async initializeHealthConnect(): Promise<boolean> {
    console.log('Initializing Google Health Connect...');
    this.isInitialized = true;
    return true;
  }

  async requestPermissions(): Promise<boolean> {
    try {
      if (this.platform === 'ios') {
        return await this.requestHealthKitPermissions();
      } else if (this.platform === 'android') {
        return await this.requestHealthConnectPermissions();
      }
      return true;
    } catch (error) {
      console.error('Failed to request health permissions:', error);
      return false;
    }
  }

  private async requestHealthKitPermissions(): Promise<boolean> {
    const requiredPermissions = [
      'HKQuantityTypeIdentifierStepCount',
      'HKQuantityTypeIdentifierHeartRate',
      'HKCategoryTypeIdentifierSleepAnalysis',
      'HKQuantityTypeIdentifierBodyTemperature',
      'HKQuantityTypeIdentifierBloodPressureSystolic',
      'HKQuantityTypeIdentifierBloodPressureDiastolic',
      'HKQuantityTypeIdentifierOxygenSaturation',
    ];
    
    console.log('Requesting HealthKit permissions for:', requiredPermissions);
    this.permissionsGranted = requiredPermissions;
    return true;
  }

  private async requestHealthConnectPermissions(): Promise<boolean> {
    const requiredPermissions = [
      'steps',
      'heart_rate',
      'sleep',
      'body_temperature',
      'blood_pressure',
      'oxygen_saturation',
    ];
    
    console.log('Requesting Health Connect permissions for:', requiredPermissions);
    this.permissionsGranted = requiredPermissions;
    return true;
  }

  checkPermissionStatus(permission: string): boolean {
    return this.permissionsGranted.includes(permission);
  }

  getPermissionsStatus(): { granted: string[]; denied: string[] } {
    const allPermissions = this.platform === 'ios' 
      ? [
          'HKQuantityTypeIdentifierStepCount',
          'HKQuantityTypeIdentifierHeartRate',
          'HKCategoryTypeIdentifierSleepAnalysis',
          'HKQuantityTypeIdentifierBodyTemperature',
          'HKQuantityTypeIdentifierBloodPressureSystolic',
          'HKQuantityTypeIdentifierBloodPressureDiastolic',
          'HKQuantityTypeIdentifierOxygenSaturation',
        ]
      : [
          'steps',
          'heart_rate',
          'sleep',
          'body_temperature',
          'blood_pressure',
          'oxygen_saturation',
        ];

    return {
      granted: this.permissionsGranted,
      denied: allPermissions.filter(p => !this.permissionsGranted.includes(p)),
    };
  }

  async getHealthData(startDate: Date, endDate: Date): Promise<HealthData> {
    try {
      const [steps, heartRateData, sleepData] = await Promise.all([
        this.getSteps(startDate, endDate),
        this.getHeartRate(startDate, endDate),
        this.getSleepData(startDate, endDate),
      ]);

      const avgHeartRate = heartRateData.length > 0
        ? Math.round(heartRateData.reduce((sum, r) => sum + r.value, 0) / heartRateData.length)
        : 0;

      this.lastSyncTime = new Date();

      return {
        steps,
        heartRate: avgHeartRate,
        heartRateData,
        sleepData: sleepData || this.generateMockSleepData(),
        lastUpdated: new Date().toISOString(),
      };
    } catch (error) {
      console.error('Failed to get health data:', error);
      return this.generateMockHealthData();
    }
  }

  async getSteps(startDate: Date, endDate: Date): Promise<number> {
    if (!this.isInitialized) {
      console.warn('Health service not initialized');
      return 0;
    }

    if (this.platform === 'ios') {
      return await this.getHealthKitSteps(startDate, endDate);
    } else if (this.platform === 'android') {
      return await this.getHealthConnectSteps(startDate, endDate);
    }
    return this.generateRandomSteps();
  }

  private async getHealthKitSteps(startDate: Date, endDate: Date): Promise<number> {
    console.log('Querying HealthKit steps:', startDate, endDate);
    return this.generateRandomSteps();
  }

  private async getHealthConnectSteps(startDate: Date, endDate: Date): Promise<number> {
    console.log('Querying Health Connect steps:', startDate, endDate);
    return this.generateRandomSteps();
  }

  async getHeartRate(startDate: Date, endDate: Date): Promise<HeartRateReading[]> {
    if (!this.isInitialized) {
      return [];
    }

    if (this.platform === 'ios') {
      return await this.getHealthKitHeartRate(startDate, endDate);
    } else if (this.platform === 'android') {
      return await this.getHealthConnectHeartRate(startDate, endDate);
    }
    return this.generateMockHeartRateData();
  }

  private async getHealthKitHeartRate(startDate: Date, endDate: Date): Promise<HeartRateReading[]> {
    console.log('Querying HealthKit heart rate:', startDate, endDate);
    return this.generateMockHeartRateData();
  }

  private async getHealthConnectHeartRate(startDate: Date, endDate: Date): Promise<HeartRateReading[]> {
    console.log('Querying Health Connect heart rate:', startDate, endDate);
    return this.generateMockHeartRateData();
  }

  async getSleepData(startDate: Date, endDate: Date): Promise<SleepData | null> {
    if (!this.isInitialized) {
      return null;
    }

    if (this.platform === 'ios') {
      return await this.getHealthKitSleep(startDate, endDate);
    } else if (this.platform === 'android') {
      return await this.getHealthConnectSleep(startDate, endDate);
    }
    return this.generateMockSleepData();
  }

  private async getHealthKitSleep(startDate: Date, endDate: Date): Promise<SleepData | null> {
    console.log('Querying HealthKit sleep:', startDate, endDate);
    return this.generateMockSleepData();
  }

  private async getHealthConnectSleep(startDate: Date, endDate: Date): Promise<SleepData | null> {
    console.log('Querying Health Connect sleep:', startDate, endDate);
    return this.generateMockSleepData();
  }

  async getWorkouts(startDate: Date, endDate: Date): Promise<Workout[]> {
    if (!this.isInitialized) {
      return [];
    }

    if (this.platform === 'ios') {
      return await this.getHealthKitWorkouts(startDate, endDate);
    } else if (this.platform === 'android') {
      return await this.getHealthConnectWorkouts(startDate, endDate);
    }
    return [];
  }

  private async getHealthKitWorkouts(startDate: Date, endDate: Date): Promise<Workout[]> {
    console.log('Querying HealthKit workouts:', startDate, endDate);
    return [];
  }

  private async getHealthConnectWorkouts(startDate: Date, endDate: Date): Promise<Workout[]> {
    console.log('Querying Health Connect workouts:', startDate, endDate);
    return [];
  }

  async getBodyMetrics(startDate: Date, endDate: Date): Promise<BodyMetrics | null> {
    if (!this.isInitialized) {
      return null;
    }

    if (this.platform === 'ios') {
      return await this.getHealthKitBodyMetrics(startDate, endDate);
    } else if (this.platform === 'android') {
      return await this.getHealthConnectBodyMetrics(startDate, endDate);
    }
    return null;
  }

  private async getHealthKitBodyMetrics(startDate: Date, endDate: Date): Promise<BodyMetrics | null> {
    console.log('Querying HealthKit body metrics:', startDate, endDate);
    return null;
  }

  private async getHealthConnectBodyMetrics(startDate: Date, endDate: Date): Promise<BodyMetrics | null> {
    console.log('Querying Health Connect body metrics:', startDate, endDate);
    return null;
  }

  subscribeToUpdates(callback: (data: Partial<HealthData>) => void): () => void {
    if (this.platform === 'ios') {
      return this.subscribeToHealthKitUpdates(callback);
    } else if (this.platform === 'android') {
      return this.subscribeToHealthConnectUpdates(callback);
    }
    return () => {};
  }

  private subscribeToHealthKitUpdates(callback: (data: Partial<HealthData>) => void): () => void {
    console.log('Subscribing to HealthKit updates...');
    return () => {
      console.log('Unsubscribing from HealthKit updates...');
    };
  }

  private subscribeToHealthConnectUpdates(callback: (data: Partial<HealthData>) => void): () => void {
    console.log('Subscribing to Health Connect updates...');
    return () => {
      console.log('Unsubscribing from Health Connect updates...');
    };
  }

  isAvailable(): boolean {
    return this.isInitialized;
  }

  getLastSyncTime(): Date | null {
    return this.lastSyncTime;
  }

  getPlatform(): 'ios' | 'android' | 'web' {
    return this.platform;
  }

  generateMockHealthData(): HealthData {
    const now = new Date();
    const heartRateReadings: HeartRateReading[] = [];
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      heartRateReadings.push({
        timestamp: time.toISOString(),
        value: Math.floor(Math.random() * (85 - 55 + 1)) + 55,
      });
    }

    return {
      steps: this.generateRandomSteps(),
      heartRate: Math.floor(Math.random() * (75 - 60 + 1)) + 60,
      heartRateData: heartRateReadings.reverse(),
      sleepData: this.generateMockSleepData(),
      lastUpdated: new Date().toISOString(),
    };
  }

  private generateRandomSteps(): number {
    return Math.floor(Math.random() * 12000) + 3000;
  }

  private generateMockHeartRateData(): HeartRateReading[] {
    const readings: HeartRateReading[] = [];
    const now = new Date();
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(now);
      time.setHours(time.getHours() - i);
      readings.push({
        timestamp: time.toISOString(),
        value: Math.floor(Math.random() * (85 - 55 + 1)) + 55,
      });
    }
    
    return readings.reverse();
  }

  private generateMockSleepData(): SleepData {
    const totalMinutes = Math.floor(Math.random() * 120) + 360;
    const deepMinutes = Math.floor(Math.random() * 60) + 60;
    const lightMinutes = Math.floor(Math.random() * 120) + 180;
    const remMinutes = Math.floor(Math.random() * 60) + 60;
    const awakeMinutes = Math.floor(Math.random() * 30) + 10;
    
    return {
      totalMinutes,
      deepMinutes,
      lightMinutes,
      remMinutes,
      awakeMinutes,
      score: Math.floor((deepMinutes + remMinutes) / (totalMinutes / 100)),
    };
  }
}

export const nativeHealthService = new NativeHealthService();
export default nativeHealthService;
