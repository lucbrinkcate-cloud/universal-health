import { create } from 'zustand';
import { Platform } from 'react-native';
import { HealthData, DeviceProvider, ExtendedHealthData, BodyRegion, StravaActivity } from "../types";
import { nativeHealthService } from '../services/nativeHealth';
import { stravaService } from '../services/stravaService';
import { useGamificationStore } from './gamificationStore';
import axios from 'axios';
import { createExtendedHealthData } from '../utils/healthScoreEngine';

type ProviderId = 'native' | string;

enum HealthErrorCode {
  INITIALIZATION_FAILED = 'INITIALIZATION_FAILED',
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  DATA_FETCH_FAILED = 'DATA_FETCH_FAILED',
  DEVICE_NOT_FOUND = 'DEVICE_NOT_FOUND',
  DEVICE_CONNECTION_FAILED = 'DEVICE_CONNECTION_FAILED',
  DEVICE_DISCONNECTION_FAILED = 'DEVICE_DISCONNECTION_FAILED',
  UNKNOWN = 'UNKNOWN',
}

const formatErrorMessage = (error: unknown, defaultMessage: string): string => {
  if (error instanceof Error) {
    return `${defaultMessage}: ${error.message}`;
  }
  return defaultMessage;
};

const isValidDateString = (date: string): boolean => {
  const regex = /^\d{4}-\d{2}-\d{2}$/;
  return regex.test(date) && !isNaN(Date.parse(date));
};

interface HealthStore {
  healthData: HealthData | null;
  extendedHealthData: ExtendedHealthData | null;
  isLoading: boolean;
  error: string | null;
  connectedDevices: readonly DeviceProvider[];
  stravaActivities: StravaActivity[];
  stravaConnected: boolean;
  fetchStravaActivities: () => Promise<void>;
  selectedRegion: BodyRegion | null;
  nativeHealthAvailable: boolean;
  fetchHealthData: (date?: string) => Promise<void>;
  fetchConnectedDevices: () => Promise<void>;
  connectDevice: (providerId: ProviderId) => Promise<ProviderId>;
  disconnectDevice: (providerId: ProviderId) => Promise<void>;
  initializeNativeHealth: () => Promise<boolean>;
  fetchNativeHealthData: (date?: string) => Promise<HealthData | null>;
  clearError: () => void;
  useMockData: () => void;
  setSelectedRegion: (region: BodyRegion | null) => void;
}

export const useHealthStore = create<HealthStore>((set, get) => ({
  healthData: null,
  extendedHealthData: null,
  isLoading: false,
  error: null,
  connectedDevices: [],
  stravaActivities: [],
  stravaConnected: false,
  selectedRegion: null,
  nativeHealthAvailable: false,

  fetchHealthData: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Initialize native health service
      const isNativeAvailable = await get().initializeNativeHealth();
      
      let finalData: HealthData | null = null;

      // Fetch data from native health if available
      if (isNativeAvailable) {
        finalData = await get().fetchNativeHealthData(targetDate);
      }
      
      // If no native data, use mock as a base
      if (!finalData) {
        finalData = nativeHealthService.generateMockHealthData();
      }

      // SYNC WITH BACKEND (De-Duplication & Biological Engine)
      try {
        const response = await axios.post("http://localhost:3000/api/health/sync", {
          nativeData: finalData,
          stravaActivities: get().stravaActivities
        });

        if (response.data) {
          const syncedData = response.data;
          
          // Update health data
          set({
            healthData: syncedData,
            extendedHealthData: createExtendedHealthData(syncedData),
            isLoading: false,
            nativeHealthAvailable: isNativeAvailable,
          });

          // Award XP from activities
          if (syncedData.xpGained > 0) {
            useGamificationStore.getState().addXP(syncedData.xpGained, "Workout Sync");
          }

          // Update Avatar based on Readiness
          useGamificationStore.getState().updateAvatarState(syncedData, syncedData.readiness);
          
          return;
        }
      } catch (backendError) {
        console.warn("Backend sync failed, falling back to local processing:", backendError);
      }

      // Local Fallback if backend is down
      set({
        healthData: finalData,
        extendedHealthData: createExtendedHealthData(finalData),
        isLoading: false,
        nativeHealthAvailable: isNativeAvailable,
      });
      useGamificationStore.getState().updateAvatarState(finalData);
    } catch (error) {
      set({
        error: formatErrorMessage(error, 'Failed to fetch health data'),
        isLoading: false,
      });
    }
  },

  fetchConnectedDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const isAvailable = await nativeHealthService.initialize();
      
      set({
        connectedDevices: isAvailable ? [
          {
            id: "native",
            name: "Native Health",
            logo: "heart",
            description: "Health data from your device",
            status: "connected" as const,
          },
          ...(get().stravaConnected ? [{
            id: "strava",
            name: "Strava",
            logo: "bicycle",
            description: "Activity data from Strava",
            status: "connected" as const,
          }] : [])
        ] : [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: formatErrorMessage(error, 'Failed to fetch devices'),
        isLoading: false,
      });
    }
  },

  connectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (providerId === 'native' || providerId === 'apple_health' || providerId === 'google_health_connect') {
        const isAvailable = await nativeHealthService.initialize();
        if (isAvailable) {
          const isPermissionGranted = await nativeHealthService.requestPermissions();
          if (isPermissionGranted) {
            set(state => ({
              nativeHealthAvailable: true,
              connectedDevices: [
                ...state.connectedDevices.filter(d => d.id !== 'native'),
                {
                  id: 'native',
                  name: Platform.OS === 'ios' ? 'Apple Health' : 'Health Connect',
                  logo: 'health',
                  description: 'Native health platform',
                  status: 'connected' as const,
                },
              ],
              isLoading: false,
            }));
            return 'native';
          }
          set({ error: 'Permission denied. Please grant health data access.', isLoading: false });
          throw new Error('Health data permission denied');
        }
        set({ error: 'Native health service unavailable on this device', isLoading: false });
        throw new Error('Native health service unavailable');
      }

      const providerNames: Record<string, string> = {
        strava: 'Strava',
        garmin: 'Garmin',
        fitbit: 'Fitbit',
        ouraring: 'Oura Ring',
        whoop: 'Whoop',
        samsung_health: 'Samsung Health',
      };

      const providerName = providerNames[providerId] || providerId;
      
      set(state => ({
        connectedDevices: [
          ...state.connectedDevices.filter(d => d.id !== providerId),
          {
            id: providerId,
            name: providerName,
            logo: 'device',
            description: `${providerName} device connected`,
            status: 'connected' as const,
          },
        ],
        isLoading: false,
      }));
      
      return providerId;
    } catch (error) {
      if ((error as Error).message === 'Device not found' || (error as Error).message.includes('unavailable') || (error as Error).message.includes('denied')) {
        throw error;
      }
      set({
        error: formatErrorMessage(error, 'Failed to connect device'),
        isLoading: false,
      });
      throw error;
    }
  },

  disconnectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (providerId === 'native' || providerId === 'apple_health' || providerId === 'google_health_connect') {
        set(state => ({
          nativeHealthAvailable: false,
          connectedDevices: state.connectedDevices.filter(
            d => d.id !== 'native' && d.id !== 'apple_health' && d.id !== 'google_health_connect'
          ),
          isLoading: false,
        }));
        return;
      }

      set(state => ({
        connectedDevices: state.connectedDevices.filter(d => d.id !== providerId),
        isLoading: false,
      }));
    } catch (error) {
      set({
        error: formatErrorMessage(error, 'Failed to disconnect device'),
        isLoading: false,
      });
    }
  },

  initializeNativeHealth: async () => {
    try {
      const isAvailable = await nativeHealthService.initialize();
      if (isAvailable) {
        const isPermissionGranted = await nativeHealthService.requestPermissions();
        return isPermissionGranted;
      }
      return false;
    } catch (error) {
      console.error('Failed to initialize native health:', error);
      return false;
    }
  },

  fetchNativeHealthData: async (date?: string) => {
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const healthData = await nativeHealthService.getHealthData(
        new Date(targetDate),
        new Date(targetDate)
      );
      return healthData;
    } catch (error) {
      console.error('Failed to fetch native health data:', error);
      return null;
    }
  },

  fetchStravaActivities: async () => {
    set({ isLoading: true });
    try {
      if (get().stravaConnected) {
        const activities = await stravaService.getActivities();
        set({ stravaActivities: activities, isLoading: false });
      }
    } catch (error) {
      set({ error: "Failed to fetch Strava activities", isLoading: false });
    }
  },

  clearError: () => set({ error: null }),

  useMockData: () => {
    const mockData = nativeHealthService.generateMockHealthData();
    set({
      healthData: mockData,
      extendedHealthData: createExtendedHealthData(mockData),
      isLoading: false,
      nativeHealthAvailable: false,
    });
  },

  setSelectedRegion: (region: BodyRegion | null) => set({ selectedRegion: region }),
}));

export default useHealthStore;