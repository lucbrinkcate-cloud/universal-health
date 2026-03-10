import { create } from 'zustand';
import { AuthState, User } from '../types';
import firebaseService from '../services/firebase';

interface AuthStore extends AuthState {
  initialize: () => void;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  clearError: () => void;
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,

  initialize: () => {
    firebaseService.initialize();
    const unsubscribe = firebaseService.onAuthChange((user) => {
      set({
        user,
        isAuthenticated: !!user,
        isLoading: false,
      });
    });
    return unsubscribe;
  },

  signIn: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseService.signIn(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      set({
        error: err.message || 'Failed to sign in',
        isLoading: false,
      });
      throw error;
    }
  },

  signUp: async (email: string, password: string) => {
    set({ isLoading: true, error: null });
    try {
      const user = await firebaseService.signUp(email, password);
      set({ user, isAuthenticated: true, isLoading: false });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      set({
        error: err.message || 'Failed to sign up',
        isLoading: false,
      });
      throw error;
    }
  },

  signOut: async () => {
    set({ isLoading: true, error: null });
    try {
      await firebaseService.signOut();
      set({ user: null, isAuthenticated: false, isLoading: false });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      set({
        error: err.message || 'Failed to sign out',
        isLoading: false,
      });
      throw error;
    }
  },

  resetPassword: async (email: string) => {
    set({ isLoading: true, error: null });
    try {
      await firebaseService.resetPassword(email);
      set({ isLoading: false });
    } catch (error: unknown) {
      const err = error as { code?: string; message?: string };
      set({
        error: err.message || 'Failed to send reset email',
        isLoading: false,
      });
      throw error;
    }
  },

  clearError: () => set({ error: null }),
}));

export default useAuthStore;
