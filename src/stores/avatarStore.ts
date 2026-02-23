import { create } from 'zustand';

interface AvatarStore {
  skinTone: string;
  anatomyLayers: Record<string, boolean>;
  setSkinTone: (tone: string) => void;
  setAnatomyLayer: (key: string, value: boolean) => void;
}

export const useAvatarStore = create<AvatarStore>((set) => ({
  skinTone: '#FFCCAA',
  anatomyLayers: {
    cardiovascular: true,
    respiratory: true,
    muscular: false,
    skeletal: false,
  },
  setSkinTone: (tone) => set({ skinTone: tone }),
  setAnatomyLayer: (key, value) =>
    set((state) => ({
      anatomyLayers: { ...state.anatomyLayers, [key]: value },
    })),
}));

export default useAvatarStore;
