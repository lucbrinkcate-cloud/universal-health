import { create } from 'zustand';

export type ViewMode = 'anatomy' | 'avatar';
export type BodyView = 'front' | 'back';
export type MuscleStatus = 'fresh' | 'trained' | 'recovering';
export type BodyType = 'slim' | 'average' | 'athletic' | 'curvy';
export type FaceShape = 'oval' | 'round' | 'square' | 'heart' | 'oblong';

export interface ProfileData {
  height: number;
  weight: number;
  age: number;
  gender: 'male' | 'female' | 'other';
}

export interface FaceCustomization {
  shape: FaceShape;
  jawline: 'narrow' | 'average' | 'wide';
  cheeks: 'flat' | 'average' | 'full';
  forehead: 'small' | 'average' | 'large';
  freckles: boolean;
  wrinkles: boolean;
}

export interface EyeCustomization {
  shape: 'almond' | 'round' | 'hooded' | 'upturned' | 'downturned';
  size: 'small' | 'average' | 'large';
  spacing: 'close' | 'average' | 'wide';
  color: string;
  lashLength: 'short' | 'average' | 'long';
  browThickness: 'thin' | 'average' | 'thick';
  browShape: 'straight' | 'arched' | 'curved';
}

export interface NoseCustomization {
  shape: 'small' | 'average' | 'large' | 'wide' | 'narrow';
}

export interface MouthCustomization {
  lipThickness: 'thin' | 'average' | 'full';
  width: 'narrow' | 'average' | 'wide';
  expression: 'neutral' | 'smile' | 'smirk';
}

export interface HairCustomization {
  style: string;
  color: string;
  highlights: string | null;
  ombre: string | null;
  texture: 'straight' | 'wavy' | 'curly' | 'coily';
  facialHair: 'none' | 'stubble' | 'mustache' | 'goatee' | 'beard' | 'full';
  facialHairColor: string;
}

export interface ClothingCustomization {
  top: string;
  topColor: string;
  bottom: string;
  bottomColor: string;
  outerwear: string;
  outerwearColor: string;
  footwear: string;
  footwearColor: string;
}

export interface AccessoryCustomization {
  glasses: string;
  glassesColor: string;
  hat: string;
  hatColor: string;
  earrings: string;
  earringsColor: string;
  necklace: string;
  necklaceColor: string;
}

export interface AvatarCustomization {
  gender: 'male' | 'female';
  skinTone: string;
  bodyType: BodyType;
  face: FaceCustomization;
  eyes: EyeCustomization;
  nose: NoseCustomization;
  mouth: MouthCustomization;
  hair: HairCustomization;
  clothing: ClothingCustomization;
  accessories: AccessoryCustomization;
}

export interface MuscleGroup {
  id: string;
  name: string;
  status: MuscleStatus;
  lastTrained?: string;
  intensity: number;
}

interface AvatarStore {
  profileData: ProfileData;
  viewMode: ViewMode;
  bodyView: BodyView;
  customization: AvatarCustomization;
  muscleGroups: Record<string, MuscleGroup>;
  purchasedAccessories: string[];
  selectedMuscle: string | null;
  
  setProfileData: (data: Partial<ProfileData>) => void;
  setViewMode: (mode: ViewMode) => void;
  toggleViewMode: () => void;
  setBodyView: (view: BodyView) => void;
  toggleBodyView: () => void;
  setCustomization: (customization: Partial<AvatarCustomization>) => void;
  setFaceCustomization: (face: Partial<FaceCustomization>) => void;
  setEyeCustomization: (eyes: Partial<EyeCustomization>) => void;
  setNoseCustomization: (nose: Partial<NoseCustomization>) => void;
  setMouthCustomization: (mouth: Partial<MouthCustomization>) => void;
  setHairCustomization: (hair: Partial<HairCustomization>) => void;
  setClothingCustomization: (clothing: Partial<ClothingCustomization>) => void;
  setAccessoryCustomization: (accessories: Partial<AccessoryCustomization>) => void;
  setGender: (gender: 'male' | 'female') => void;
  setSelectedMuscle: (muscleId: string | null) => void;
  updateMuscleGroup: (muscleId: string, data: Partial<MuscleGroup>) => void;
  addPurchasedAccessory: (accessoryId: string) => void;
  resetCustomization: () => void;
}

const DEFAULT_CUSTOMIZATION: AvatarCustomization = {
  gender: 'male',
  skinTone: '#FFDFC4',
  bodyType: 'average',
  face: {
    shape: 'oval',
    jawline: 'average',
    cheeks: 'average',
    forehead: 'average',
    freckles: false,
    wrinkles: false,
  },
  eyes: {
    shape: 'almond',
    size: 'average',
    spacing: 'average',
    color: '#4A3728',
    lashLength: 'average',
    browThickness: 'average',
    browShape: 'arched',
  },
  nose: {
    shape: 'average',
  },
  mouth: {
    lipThickness: 'average',
    width: 'average',
    expression: 'smile',
  },
  hair: {
    style: 'short',
    color: '#2C1810',
    highlights: null,
    ombre: null,
    texture: 'straight',
    facialHair: 'none',
    facialHairColor: '#2C1810',
  },
  clothing: {
    top: 'tshirt',
    topColor: '#4A90D9',
    bottom: 'jeans',
    bottomColor: '#3B5998',
    outerwear: 'none',
    outerwearColor: '#2D3436',
    footwear: 'sneakers',
    footwearColor: '#FFFFFF',
  },
  accessories: {
    glasses: 'none',
    glassesColor: '#1A1A1A',
    hat: 'none',
    hatColor: '#2D3436',
    earrings: 'none',
    earringsColor: '#FFD700',
    necklace: 'none',
    necklaceColor: '#FFD700',
  },
};

const DEFAULT_MUSCLE_GROUPS: Record<string, MuscleGroup> = {
  // Head & Neck
  head_front: { id: 'head_front', name: 'Head (Front)', status: 'fresh', intensity: 0 },
  head_back: { id: 'head_back', name: 'Head (Back)', status: 'fresh', intensity: 0 },
  neck_front: { id: 'neck_front', name: 'Neck (Left)', status: 'fresh', intensity: 0 },
  neck_back: { id: 'neck_back', name: 'Neck (Right)', status: 'fresh', intensity: 0 },
  
  // Shoulders
  deltoid_front_left: { id: 'deltoid_front_left', name: 'Deltoid (Anterior, Left)', status: 'fresh', intensity: 0 },
  deltoid_front_right: { id: 'deltoid_front_right', name: 'Deltoid (Anterior, Right)', status: 'fresh', intensity: 0 },
  deltoid_back_left: { id: 'deltoid_back_left', name: 'Deltoid (Posterior, Left)', status: 'fresh', intensity: 0 },
  deltoid_back_right: { id: 'deltoid_back_right', name: 'Deltoid (Posterior, Right)', status: 'fresh', intensity: 0 },
  
  // Chest
  pec_front_left: { id: 'pec_front_left', name: 'Pectoralis Major (Left)', status: 'fresh', intensity: 0 },
  pec_front_right: { id: 'pec_front_right', name: 'Pectoralis Major (Right)', status: 'fresh', intensity: 0 },
  
  // Arms
  bicep_front_left: { id: 'bicep_front_left', name: 'Biceps Brachii (Left)', status: 'fresh', intensity: 0 },
  bicep_front_right: { id: 'bicep_front_right', name: 'Biceps Brachii (Right)', status: 'fresh', intensity: 0 },
  tricep_back_left: { id: 'tricep_back_left', name: 'Triceps Brachii (Left)', status: 'fresh', intensity: 0 },
  tricep_back_right: { id: 'tricep_back_right', name: 'Triceps Brachii (Right)', status: 'fresh', intensity: 0 },
  forearm_front_left: { id: 'forearm_front_left', name: 'Forearm Flexors (Left)', status: 'fresh', intensity: 0 },
  forearm_front_right: { id: 'forearm_front_right', name: 'Forearm Flexors (Right)', status: 'fresh', intensity: 0 },
  forearm_back_left: { id: 'forearm_back_left', name: 'Forearm Extensors (Left)', status: 'fresh', intensity: 0 },
  forearm_back_right: { id: 'forearm_back_right', name: 'Forearm Extensors (Right)', status: 'fresh', intensity: 0 },
  
  // Abs & Core
  abs_front: { id: 'abs_front', name: 'Rectus Abdominis', status: 'fresh', intensity: 0 },
  abs_side_left: { id: 'abs_side_left', name: 'External Oblique (Left)', status: 'fresh', intensity: 0 },
  abs_side_right: { id: 'abs_side_right', name: 'External Oblique (Right)', status: 'fresh', intensity: 0 },
  serratus_left: { id: 'serratus_left', name: 'Serratus Anterior (Left)', status: 'fresh', intensity: 0 },
  serratus_right: { id: 'serratus_right', name: 'Serratus Anterior (Right)', status: 'fresh', intensity: 0 },
  
  // Back
  trap_left: { id: 'trap_left', name: 'Trapezius (Left)', status: 'fresh', intensity: 0 },
  trap_right: { id: 'trap_right', name: 'Trapezius (Right)', status: 'fresh', intensity: 0 },
  rhomboid_left: { id: 'rhomboid_left', name: 'Rhomboids (Left)', status: 'fresh', intensity: 0 },
  rhomboid_right: { id: 'rhomboid_right', name: 'Rhomboids (Right)', status: 'fresh', intensity: 0 },
  lat_left: { id: 'lat_left', name: 'Latissimus Dorsi (Left)', status: 'fresh', intensity: 0 },
  lat_right: { id: 'lat_right', name: 'Latissimus Dorsi (Right)', status: 'fresh', intensity: 0 },
  spine_erector: { id: 'spine_erector', name: 'Erector Spinae', status: 'fresh', intensity: 0 },
  
  // Hips & Glutes
  glute_front_left: { id: 'glute_front_left', name: 'Gluteus Maximus (Left)', status: 'fresh', intensity: 0 },
  glute_front_right: { id: 'glute_front_right', name: 'Gluteus Maximus (Right)', status: 'fresh', intensity: 0 },
  glute_back_left: { id: 'glute_back_left', name: 'Gluteus Maximus (Left)', status: 'fresh', intensity: 0 },
  glute_back_right: { id: 'glute_back_right', name: 'Gluteus Maximus (Right)', status: 'fresh', intensity: 0 },
  
  // Legs
  quad_left: { id: 'quad_left', name: 'Quadriceps Femoris (Left)', status: 'fresh', intensity: 0 },
  quad_right: { id: 'quad_right', name: 'Quadriceps Femoris (Right)', status: 'fresh', intensity: 0 },
  ham_left: { id: 'ham_left', name: 'Hamstrings (Left)', status: 'fresh', intensity: 0 },
  ham_right: { id: 'ham_right', name: 'Hamstrings (Right)', status: 'fresh', intensity: 0 },
  calf_left: { id: 'calf_left', name: 'Gastrocnemius (Calf, Left)', status: 'fresh', intensity: 0 },
  calf_right: { id: 'calf_right', name: 'Gastrocnemius (Calf, Right)', status: 'fresh', intensity: 0 },
  calf_back_left: { id: 'calf_back_left', name: 'Gastrocnemius & Soleus (Left)', status: 'fresh', intensity: 0 },
  calf_back_right: { id: 'calf_back_right', name: 'Gastrocnemius & Soleus (Right)', status: 'fresh', intensity: 0 },
};

export const useAvatarStore = create<AvatarStore>((set) => ({
  profileData: {
    height: 170,
    weight: 70,
    age: 25,
    gender: 'male',
  },
  viewMode: 'avatar',
  bodyView: 'front',
  customization: DEFAULT_CUSTOMIZATION,
  muscleGroups: DEFAULT_MUSCLE_GROUPS,
  purchasedAccessories: [],
  selectedMuscle: null,

  setProfileData: (data) =>
    set((state) => ({
      profileData: { ...state.profileData, ...data },
    })),

  setViewMode: (mode) => set({ viewMode: mode }),

  toggleViewMode: () =>
    set((state) => ({
      viewMode: state.viewMode === 'anatomy' ? 'avatar' : 'anatomy',
    })),

  setBodyView: (view) => set({ bodyView: view }),

  toggleBodyView: () =>
    set((state) => ({
      bodyView: state.bodyView === 'front' ? 'back' : 'front',
    })),

  setCustomization: (customization) =>
    set((state) => ({
      customization: { ...state.customization, ...customization },
    })),

  setFaceCustomization: (face) =>
    set((state) => ({
      customization: {
        ...state.customization,
        face: { ...state.customization.face, ...face },
      },
    })),

  setEyeCustomization: (eyes) =>
    set((state) => ({
      customization: {
        ...state.customization,
        eyes: { ...state.customization.eyes, ...eyes },
      },
    })),

  setNoseCustomization: (nose) =>
    set((state) => ({
      customization: {
        ...state.customization,
        nose: { ...state.customization.nose, ...nose },
      },
    })),

  setMouthCustomization: (mouth) =>
    set((state) => ({
      customization: {
        ...state.customization,
        mouth: { ...state.customization.mouth, ...mouth },
      },
    })),

  setHairCustomization: (hair) =>
    set((state) => ({
      customization: {
        ...state.customization,
        hair: { ...state.customization.hair, ...hair },
      },
    })),

  setClothingCustomization: (clothing) =>
    set((state) => ({
      customization: {
        ...state.customization,
        clothing: { ...state.customization.clothing, ...clothing },
      },
    })),

  setAccessoryCustomization: (accessories) =>
    set((state) => ({
      customization: {
        ...state.customization,
        accessories: { ...state.customization.accessories, ...accessories },
      },
    })),

  setGender: (gender) =>
    set((state) => ({
      customization: {
        ...state.customization,
        gender,
      },
    })),

  setSelectedMuscle: (muscleId) => set({ selectedMuscle: muscleId }),

  updateMuscleGroup: (muscleId, data) =>
    set((state) => ({
      muscleGroups: {
        ...state.muscleGroups,
        [muscleId]: { ...state.muscleGroups[muscleId], ...data },
      },
    })),

  addPurchasedAccessory: (accessoryId) =>
    set((state) => ({
      purchasedAccessories: [...state.purchasedAccessories, accessoryId],
    })),

  resetCustomization: () => set({ customization: DEFAULT_CUSTOMIZATION }),
}));

export default useAvatarStore;
