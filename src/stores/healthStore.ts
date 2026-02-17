import { create } from 'zustand';
import { HealthData, TerraProvider, ExtendedHealthData, BodyRegion } from '../types';
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
      
      // Initialize native health service
      const isNativeAvailable = await get().initializeNativeHealth();
      
      // Fetch data from native health if available
      if (isNativeAvailable) {
        const nativeData = await get().fetchNativeHealthData(targetDate);
        if (nativeData) {
          set({
            healthData: nativeData,
            extendedHealthData: createExtendedHealthData(nativeData),
            isLoading: false,
            nativeHealthAvailable: true,
          });
          return;
        }
      }
      
      // If native health not available, use mock data
      const mockData = nativeHealthService.generateMockHealthData();
      set({
        healthData: mockData,
        extendedHealthData: createExtendedHealthData(mockData),
        isLoading: false,
        nativeHealthAvailable: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch health data',
        isLoading: false,
      });
    }
  },

  fetchConnectedDevices: async () => {
    set({ isLoading: true, error: null });
    try {
      // For native health, we don't have connected devices in the same way
      // But we can check what's available
      const isAvailable = await nativeHealthService.initialize();
      
      set({
        connectedDevices: isAvailable ? [{ id: 'native', name: 'Native Health' }] : [],
        isLoading: false,
      });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to fetch devices',
        isLoading: false,
      });
    }
  },

  connectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (providerId === 'native') {
        const isAvailable = await nativeHealthService.initialize();
        if (isAvailable) {
          const isPermissionGranted = await nativeHealthService.requestPermissions();
          if (isPermissionGranted) {
            set({ nativeHealthAvailable: true });
            return 'native';
          }
        }
      }
      throw new Error('Failed to connect device');
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to connect device',
        isLoading: false,
      });
      throw error;
    }
  },

  disconnectDevice: async (providerId: string) => {
    set({ isLoading: true, error: null });
    try {
      if (providerId === 'native') {
        // For native health, we don't really disconnect, just reset
        set({ nativeHealthAvailable: false });
      }
      set({ isLoading: false });
    } catch (error) {
      set({
        error: error instanceof Error ? error.message : 'Failed to disconnect device',
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