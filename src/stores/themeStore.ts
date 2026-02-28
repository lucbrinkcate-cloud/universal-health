import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

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
  steps: string;
  heartRate: string;
  sleep: string;
  calories: string;
}

interface ThemeState {
  mode: ThemeMode;
  colors: ThemeColors;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  isDark: boolean;
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
  steps: '#3B82F6',
  heartRate: '#EF4444',
  sleep: '#8B5CF6',
  calories: '#F59E0B',
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
  steps: '#60A5FA',
  heartRate: '#F87171',
  sleep: '#A78BFA',
  calories: '#FBBF24',
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set, get) => ({
      mode: 'system',
      colors: lightColors,
      isDark: false,
      setThemeMode: (mode: ThemeMode) => {
        const systemColorScheme = useColorScheme();
        const systemDark = systemColorScheme === 'dark';
        const isDark = mode === 'dark' || (mode === 'system' && systemDark);
        const colors = isDark ? darkColors : lightColors;
        set({ mode, colors, isDark });
      },
      toggleTheme: () => {
        set((state) => {
          const newMode = state.mode === 'light' ? 'dark' : 'light';
          const colors = newMode === 'dark' ? darkColors : lightColors;
          return { mode: newMode, colors, isDark: newMode === 'dark' };
        });
      },
    }),
    {
      name: 'theme-storage',
      storage: createJSONStorage(() => AsyncStorage),
      onRehydrateStorage: () => (state) => {
        if (state) {
          const systemColorScheme = useColorScheme();
          const systemDark = systemColorScheme === 'dark';
          const isDark = state.mode === 'dark' || (state.mode === 'system' && systemDark);
          state.isDark = isDark;
          state.colors = isDark ? darkColors : lightColors;
        }
      },
    }
  )
);

export const useTheme = () => {
  const systemColorScheme = useColorScheme();
  const { colors, mode, isDark } = useThemeStore();
  
  const actualIsDark = mode === 'system' ? systemColorScheme === 'dark' : mode === 'dark';
  const actualColors = actualIsDark ? darkColors : lightColors;
  
  return {
    colors: actualColors,
    isDark: actualIsDark,
    mode,
  };
};

export { lightColors, darkColors };
export default useThemeStore;
