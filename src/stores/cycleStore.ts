import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface CycleEntry {
  id: string;
  date: string;
  type: 'period' | 'spotting' | 'fertile' | 'ovulation' | 'symptoms' | 'notes';
  flow?: 'light' | 'medium' | 'heavy';
  symptoms?: string[];
  notes?: string;
}

export interface CycleSettings {
  cycleLength: number;
  periodLength: number;
  lastPeriodStart: string | null;
  isEnabled: boolean;
  notifications: boolean;
}

export interface Prediction {
  nextPeriod: string;
  nextFertileWindow: { start: string; end: string };
  ovulationDate: string;
}

interface CycleStore {
  entries: CycleEntry[];
  settings: CycleSettings;
  
  // Actions
  addEntry: (entry: Omit<CycleEntry, 'id'>) => void;
  updateEntry: (id: string, entry: Partial<CycleEntry>) => void;
  deleteEntry: (id: string) => void;
  updateSettings: (settings: Partial<CycleSettings>) => void;
  getPredictions: () => Prediction | null;
  getCurrentPhase: () => string;
}

const DEFAULT_SETTINGS: CycleSettings = {
  cycleLength: 28,
  periodLength: 5,
  lastPeriodStart: null,
  isEnabled: false,
  notifications: true,
};

const SAMPLE_ENTRIES: CycleEntry[] = [];

export const useCycleStore = create<CycleStore>((set, get) => ({
  entries: SAMPLE_ENTRIES,
  settings: DEFAULT_SETTINGS,

  addEntry: (entry) => {
    const newEntry: CycleEntry = {
      ...entry,
      id: Date.now().toString(),
    };
    set((state) => ({
      entries: [newEntry, ...state.entries].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      ),
    }));
    
    // If this is a period start, update the lastPeriodStart
    if (entry.type === 'period') {
      set((state) => ({
        settings: {
          ...state.settings,
          lastPeriodStart: entry.date,
        },
      }));
    }
  },

  updateEntry: (id, entryUpdate) => {
    set((state) => ({
      entries: state.entries.map((e) =>
        e.id === id ? { ...e, ...entryUpdate } : e
      ),
    }));
  },

  deleteEntry: (id) => {
    set((state) => ({
      entries: state.entries.filter((e) => e.id !== id),
    }));
  },

  updateSettings: (newSettings) => {
    set((state) => ({
      settings: { ...state.settings, ...newSettings },
    }));
  },

  getPredictions: () => {
    const { settings, entries } = get();
    if (!settings.lastPeriodStart || !settings.isEnabled) {
      return null;
    }

    const lastPeriod = new Date(settings.lastPeriodStart);
    const nextPeriod = new Date(lastPeriod);
    nextPeriod.setDate(lastPeriod.getDate() + settings.cycleLength);

    const ovulationDate = new Date(lastPeriod);
    ovulationDate.setDate(lastPeriod.getDate() + settings.cycleLength - 14);

    const fertileStart = new Date(ovulationDate);
    fertileStart.setDate(ovulationDate.getDate() - 5);

    const fertileEnd = new Date(ovulationDate);
    fertileEnd.setDate(ovulationDate.getDate() + 1);

    return {
      nextPeriod: nextPeriod.toISOString().split('T')[0],
      nextFertileWindow: {
        start: fertileStart.toISOString().split('T')[0],
        end: fertileEnd.toISOString().split('T')[0],
      },
      ovulationDate: ovulationDate.toISOString().split('T')[0],
    };
  },

  getCurrentPhase: () => {
    const { settings } = get();
    if (!settings.lastPeriodStart || !settings.isEnabled) {
      return 'not_configured';
    }

    const lastPeriod = new Date(settings.lastPeriodStart);
    const today = new Date();
    const daysSincePeriod = Math.floor(
      (today.getTime() - lastPeriod.getTime()) / (1000 * 60 * 60 * 24)
    );
    const cycleDay = (daysSincePeriod % settings.cycleLength) + 1;

    if (cycleDay <= settings.periodLength) {
      return 'menstruation';
    } else if (cycleDay >= settings.cycleLength - 13 && cycleDay <= settings.cycleLength - 9) {
      return 'fertile';
    } else if (cycleDay === settings.cycleLength - 13) {
      return 'ovulation';
    } else {
      return 'luteal';
    }
  },
}));

export default useCycleStore;
