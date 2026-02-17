import { create } from 'zustand';
import { HealthData, TerraProvider, ExtendedHealthData, BodyRegion } from '../types';
import terraService from '../services/terra';
import { nativeHealthService } from '../services/nativeHealth';
import { createExtendedHealthData } from '../utils/healthScoreEngine';
import { deduplicationEngine } from '../utils/deduplication';

interface HealthStore {
  healthData: HealthData | null;
  extendedHealthData: ExtendedHealthData | null;
  isLoading: boolean;
  error: string | null;
  connectedDevices: TerraProvider[];
  selectedRegion: BodyRegion | null;
  nativeHealthAvailable: boolean;
  fetchHealthData: (date?: string) => Promise<void>;
  fetchConnectedDevices: () => Promise<void>;
  connectDevice: (providerId: string) => Promise<string>;
  disconnectDevice: (providerId: string) => Promise<void>;
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
  selectedRegion: null,
  nativeHealthAvailable: false,

  fetchHealthData: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      
      // Fetch data from multiple sources
      const dataSources: Array<{ data: HealthData; source: string }> = [];
      
      // Fetch from Terra API
      try {
        const terraData = await terraService.getHealthSummary(targetDate);
        dataSources.push({ data: terraData, source: 'terra' });
      } catch (e) {
        console.log('Terra data unavailable');
      }
      
      // Fetch from native health (HealthKit/Health Connect) if available
      if (get().nativeHealthAvailable) {
        try {
          const nativeData = await get().fetchNativeHealthData(targetDate);
          if (nativeData) {
            const sourceName = nativeHealthService.isAvailable() ? 
              (nativeHealthService as any).platform === 'ios' ? 'healthkit' : 'health_connect'
              : 'native';
            dataSources.push({ data: nativeData, source: sourceName });
          }
        } catch (e) {
          console.log('Native health data unavailable');
        }
      }
      
      // Merge and de-duplicate data
      let finalData: HealthData;
      if (dataSources.length === 0) {
        throw new Error('No health data sources available');
      } else if (dataSources.length === 1) {
        finalData = dataSources[0].data;
      } else {
        finalData = deduplicationEngine.mergeHealthData(dataSources);
      }
      
      // Validate data quality
      const validation = deduplicationEngine.validateData(finalData, 'merged');
      if (!validation.valid) {
        console.warn('Data quality issues detected:', validation.issues);
      }
      
      const extendedData = createExtendedHealthData(finalData);
      set({ healthData: finalData, extendedHealthData: extendedData, isLoading: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      set({
        error: err.message || 'Failed to fetch health data',
        isLoading: false,
      });
    }
  },

  fetchConnectedDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      const devices = await terraService.getConnectedDevices();
      set({ connectedDevices: devices, isLoading: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      set({
        error: err.message || 'Failed to fetch devices',
        isLoading: false,
      });
    }
  },

  connectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const result = await terraService.connectProvider(providerId);
      set({ isLoading: false });
      return result.url;
    } catch (error: unknown) {
      const err = error as { message?: string };
      set({
        error: err.message || 'Failed to connect device',
        isLoading: false,
      });
      throw error;
    }
  },

  disconnectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      const devices = get().connectedDevices.filter(d => d.id !== providerId);
      set({ connectedDevices: devices, isLoading: false });
    } catch (error: unknown) {
      const err = error as { message?: string };
      set({
        error: err.message || 'Failed to disconnect device',
        isLoading: false,
      });
    }
  },

  clearError: () => set({ error: null }),

  useMockData: () => {
    const mockData = terraService.generateMockHealthData();
    const extendedData = createExtendedHealthData(mockData);
    set({ healthData: mockData, extendedHealthData: extendedData, isLoading: false });
  },

  setSelectedRegion: (region: BodyRegion | null) => set({ selectedRegion: region }),

  initializeNativeHealth: async () => {
    try {
      const initialized = await nativeHealthService.initialize();
      if (initialized) {
        const permissions = await nativeHealthService.requestPermissions();
        set({ nativeHealthAvailable: permissions });
        return permissions;
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
      const startDate = new Date(targetDate);
      const endDate = new Date(targetDate);
      endDate.setDate(endDate.getDate() + 1);

      const data = await nativeHealthService.getHealthData(startDate, endDate);
      return data;
    } catch (error) {
      console.error('Failed to fetch native health data:', error);
      return null;
    }
  },
}));

export default useHealthStore;
