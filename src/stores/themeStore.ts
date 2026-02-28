import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS } from '../constants';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  primary: string;
  primaryDark: string;
  primaryLight: string;
  secondary: string;
  secondaryDark: string;
  secondaryLight: string;
  error: string;
  errorDark: string;
  warning: string;
  warningDark: string;
  success: string;
  info: string;
  background: string;
  surface: string;
  text: string;
  textSecondary: string;
  textTertiary: string;
  textLight: string;
  border: string;
}

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const lightColors: ThemeColors = {
  primary: '#4F46E5',
  primaryDark: '#3730A3',
  primaryLight: '#818CF8',
  secondary: '#10B981',
  secondaryDark: '#059669',
  secondaryLight: '#34D399',
  error: '#EF4444',
  errorDark: '#DC2626',
  warning: '#F59E0B',
  warningDark: '#D97706',
  success: '#10B981',
  info: '#3B82F6',
  background: '#F9FAFB',
  surface: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',
  textLight: '#F9FAFB',
  border: '#E5E7EB',
};

const darkColors: ThemeColors = {
  primary: '#818CF8',
  primaryDark: '#6366F1',
  primaryLight: '#A5B4FC',
  secondary: '#34D399',
  secondaryDark: '#10B981',
  secondaryLight: '#6EE7B7',
  error: '#F87171',
  errorDark: '#EF4444',
  warning: '#FBBF24',
  warningDark: '#F59E0B',
  success: '#34D399',
  info: '#60A5FA',
  background: '#111827',
  surface: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  textTertiary: '#6B7280',
  textLight: '#111827',
  border: '#374151',
};

const getColors = (mode: ThemeMode, systemDark: boolean): ThemeColors => {
  if (mode === 'system') {
    return systemDark ? darkColors : lightColors;
  }
  return mode === 'dark' ? darkColors : lightColors;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      mode: 'system',
      colors: lightColors,
      setThemeMode: (mode: ThemeMode) => {
        const colors = getColors(mode, false);
        set({ mode, colors });
      },
      toggleTheme: () => {
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          return { mode: newMode, colors: getColors(newMode, false) };
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export { lightColors, darkColors };
export default useThemeStore;
