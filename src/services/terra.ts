import axios, { AxiosInstance, AxiosError } from 'axios';
import { TERRA_CONFIG } from '../constants';
import { TerraActivity, TerraMetrics, TerraProvider, HealthData, HeartRateReading, SleepData } from '../types';
import { AppError } from '../utils';

class TerraService {
  private client: AxiosInstance;
  private userId: string | null = null;

  constructor() {
    this.client = axios.create({
      baseURL: TERRA_CONFIG.baseUrl,
      headers: {
        'api-key': TERRA_CONFIG.apiKey,
        'Content-Type': 'application/json',
      },
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  private handleError(error: AxiosError): never {
    if (error.response) {
      const status = error.response.status;
      const message = (error.response.data as Record<string, unknown>)?.message as string || 'Terra API error';
      
      if (status === 401) {
        throw new AppError('TERRA_AUTH', 'Invalid API key');
      }
      if (status === 429) {
        throw new AppError('TERRA_RATE_LIMIT', 'Rate limit exceeded');
      }
      throw new AppError('TERRA_API', message);
    }
    if (error.request) {
      throw new AppError('TERRA_NETWORK', 'Network error - please check your connection');
    }
    throw new AppError('TERRA_UNKNOWN', error.message || 'Unknown error');
  }

  async getProviders(): Promise<TerraProvider[]> {
    try {
      const response = await this.client.get('/partners/providers');
      return response.data.providers || [];
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async connectProvider(providerId: string): Promise<{ url: string }> {
    try {
      const response = await this.client.post('/partners/connect', {
        provider_id: providerId,
        reference_id: this.userId,
      });
      return response.data;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getConnectedDevices(): Promise<TerraProvider[]> {
    try {
      const response = await this.client.get(`/users/${this.userId}/devices`);
      return response.data.devices || [];
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getActivity(
    startDate: string,
    endDate: string,
    provider?: string
  ): Promise<TerraActivity[]> {
    try {
      const params: Record<string, string> = {
        start_date: startDate,
        end_date: endDate,
      };
      if (provider) {
        params.provider = provider;
      }

      const response = await this.client.get(`/users/${this.userId}/activity`, { params });
      return response.data.data || [];
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getSleepData(
    startDate: string,
    endDate: string,
    provider?: string
  ): Promise<SleepData | null> {
    try {
      const params: Record<string, string> = {
        start_date: startDate,
        end_date: endDate,
      };
      if (provider) {
        params.provider = provider;
      }

      const response = await this.client.get(`/users/${this.userId}/sleep`, { params });
      const sleepData = response.data.data?.[0];
      
      if (!sleepData) return null;

      return {
        totalMinutes: sleepData.total_sleep_duration || 0,
        deepMinutes: sleepData.deep_sleep_duration || 0,
        lightMinutes: sleepData.light_sleep_duration || 0,
        remMinutes: sleepData.rem_sleep_duration || 0,
        awakeMinutes: sleepData.awake_duration || 0,
        score: sleepData.sleep_score || 0,
      };
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getHeartRateData(
    startDate: string,
    endDate: string,
    provider?: string
  ): Promise<HeartRateReading[]> {
    try {
      const params: Record<string, string> = {
        start_date: startDate,
        end_date: endDate,
      };
      if (provider) {
        params.provider = provider;
      }

      const response = await this.client.get(`/users/${this.userId}/heart_rate`, { params });
      return response.data.data?.[0]?.heart_rate?.samples || [];
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getSteps(
    startDate: string,
    endDate: string,
    provider?: string
  ): Promise<number> {
    try {
      const params: Record<string, string> = {
        start_date: startDate,
        end_date: endDate,
      };
      if (provider) {
        params.provider = provider;
      }

      const response = await this.client.get(`/users/${this.userId}/body`, { params });
      const data = response.data.data?.[0];
      return data?.steps || 0;
    } catch (error) {
      this.handleError(error as AxiosError);
    }
  }

  async getHealthSummary(date: string): Promise<HealthData> {
    const endDate = new Date(date);
    const startDate = new Date(date);
    startDate.setDate(startDate.getDate() - 1);

    const startStr = startDate.toISOString().split('T')[0];
    const endStr = endDate.toISOString().split('T')[0];

    const [steps, heartRateData, sleepData] = await Promise.all([
      this.getSteps(startStr, endStr).catch(() => 0),
      this.getHeartRateData(startStr, endStr).catch(() => []),
      this.getSleepData(startStr, endStr).catch(() => null),
    ]);

    const avgHeartRate = heartRateData.length > 0
      ? Math.round(heartRateData.reduce((sum, r) => sum + r.value, 0) / heartRateData.length)
      : 0;

    return {
      steps,
      heartRate: avgHeartRate,
      heartRateData,
      sleepData: sleepData || {
        totalMinutes: 0,
        deepMinutes: 0,
        lightMinutes: 0,
        remMinutes: 0,
        awakeMinutes: 0,
        score: 0,
      },
      lastUpdated: new Date().toISOString(),
    };
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
      steps: Math.floor(Math.random() * 12000) + 3000,
      heartRate: Math.floor(Math.random() * (75 - 60 + 1)) + 60,
      heartRateData: heartRateReadings.reverse(),
      sleepData: {
        totalMinutes: Math.floor(Math.random() * 120) + 360,
        deepMinutes: Math.floor(Math.random() * 60) + 60,
        lightMinutes: Math.floor(Math.random() * 120) + 180,
        remMinutes: Math.floor(Math.random() * 60) + 60,
        awakeMinutes: Math.floor(Math.random() * 30) + 10,
        score: Math.floor(Math.random() * 30) + 70,
      },
      lastUpdated: now.toISOString(),
    };
  }
}

export const terraService = new TerraService();
export default terraService;
