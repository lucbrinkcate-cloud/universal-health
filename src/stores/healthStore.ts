import { create } from 'zustand';
import { HealthData, TerraProvider, ExtendedHealthData, BodyRegion } from '../types';
import terraService from '../services/terra';
import { createExtendedHealthData } from '../utils/healthScoreEngine';

interface HealthStore {
  healthData: HealthData | null;
  extendedHealthData: ExtendedHealthData | null;
  isLoading: boolean;
  error: string | null;
  connectedDevices: TerraProvider[];
  selectedRegion: BodyRegion | null;
  fetchHealthData: (date?: string) => Promise<void>;
  fetchConnectedDevices: () => Promise<void>;
  connectDevice: (providerId: string) => Promise<string>;
  disconnectDevice: (providerId: string) => Promise<void>;
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

  fetchHealthData: async (date?: string) => {
    set({ isLoading: true, error: null });
    try {
      const targetDate = date || new Date().toISOString().split('T')[0];
      const data = await terraService.getHealthSummary(targetDate);
      const extendedData = createExtendedHealthData(data);
      set({ healthData: data, extendedHealthData: extendedData, isLoading: false });
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
}));

export default useHealthStore;
