import { create } from 'zustand';
import { AvatarConfig } from '../types/avatar.d';

export interface AvatarState {
  config: AvatarConfig;
  // actions
  setPhotoUri: (uri: string) => void;
  setSkinTone: (tone: string) => void;
  setMuscleDefinition: (muscleId: string, intensity: number) => void;
  setAnatomyLayer: (layer: keyof AvatarConfig['anatomyLayers'], enabled: boolean) => void;
  // selector convenience
  selectConfig: () => AvatarConfig;
}

export const useAvatarStore = create<AvatarState>((set, get) => ({
  config: {
    photoUri: undefined,
    skinTone: '#FFCC99', // default skin tone
    muscleDefinition: {},
    anatomyLayers: {
      bones: true,
      muscles: true,
      skin: true,
    },
  },
  setPhotoUri: (uri) => set((state) => ({ config: { ...state.config, photoUri: uri } })),
  setSkinTone: (tone) => set((state) => ({ config: { ...state.config, skinTone: tone } })),
  setMuscleDefinition: (muscleId, intensity) =>
    set((state) => ({
      config: {
        ...state.config,
        muscleDefinition: { ...state.config.muscleDefinition, [muscleId]: intensity },
      },
    })),
  setAnatomyLayer: (layer, enabled) =>
    set((state) => ({
      config: {
        ...state.config,
        anatomyLayers: { ...state.config.anatomyLayers, [layer]: enabled },
      },
    })),
  selectConfig: () => get().config,
}));
