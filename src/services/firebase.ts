import { initializeApp, getApps, FirebaseApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  sendPasswordResetEmail,
  onAuthStateChanged,
  User as FirebaseUser,
  Auth,
} from 'firebase/auth';
import { FIREBASE_CONFIG } from '../constants';
import { User, AuthState } from '../types';
import { AppError } from '../utils';

let app: FirebaseApp | null = null;
let auth: Auth | null = null;

const initializeFirebase = (): void => {
  if (!getApps().length) {
    app = initializeApp(FIREBASE_CONFIG);
  } else {
    app = getApps()[0];
  }
  auth = getAuth(app);
};

export const firebaseService = {
  initialize: (): void => {
    initializeFirebase();
  },

  signIn: async (email: string, password: string): Promise<User> => {
    try {
      initializeFirebase();
      if (!auth) throw new AppError('AUTH', 'Firebase not initialized');
      
      const result = await signInWithEmailAndPassword(auth, email, password);
      return mapFirebaseUser(result.user);
    } catch (error: unknown) {
      const err = error as Error;
      throw new AppError('AUTH_SIGN_IN', err.message || 'Failed to sign in');
    }
  },

  signUp: async (email: string, password: string): Promise<User> => {
    try {
      initializeFirebase();
      if (!auth) throw new AppError('AUTH', 'Firebase not initialized');
      
      const result = await createUserWithEmailAndPassword(auth, email, password);
      return mapFirebaseUser(result.user);
    } catch (error: unknown) {
      const err = error as Error;
      throw new AppError('AUTH_SIGN_UP', err.message || 'Failed to sign up');
    }
  },

  signOut: async (): Promise<void> => {
    try {
      initializeFirebase();
      if (!auth) throw new AppError('AUTH', 'Firebase not initialized');
      
      await signOut(auth);
    } catch (error: unknown) {
      const err = error as Error;
      throw new AppError('AUTH_SIGN_OUT', err.message || 'Failed to sign out');
    }
  },

  resetPassword: async (email: string): Promise<void> => {
    try {
      initializeFirebase();
      if (!auth) throw new AppError('AUTH', 'Firebase not initialized');
      
      await sendPasswordResetEmail(auth, email);
    } catch (error: unknown) {
      const err = error as Error;
      throw new AppError('AUTH_RESET_PASSWORD', err.message || 'Failed to send password reset email');
    }
  },

  onAuthChange: (callback: (user: User | null) => void): (() => void) => {
    initializeFirebase();
    if (!auth) throw new AppError('AUTH', 'Firebase not initialized');
    
    return onAuthStateChanged(auth, (firebaseUser: FirebaseUser | null) => {
      callback(firebaseUser ? mapFirebaseUser(firebaseUser) : null);
    });
  },

  getCurrentUser: (): User | null => {
    initializeFirebase();
    if (!auth?.currentUser) return null;
    return mapFirebaseUser(auth.currentUser);
  },
};

const mapFirebaseUser = (firebaseUser: FirebaseUser): User => ({
  uid: firebaseUser.uid,
  email: firebaseUser.email,
  displayName: firebaseUser.displayName,
  photoURL: firebaseUser.photoURL,
  createdAt: firebaseUser.metadata.creationTime || new Date().toISOString(),
});

export default firebaseService;
