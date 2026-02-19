export interface AvatarConfig {
  photoUri?: string; // local URI of uploaded photo
  skinTone: string; // hex or predefined palette
  muscleDefinition: Record<string, number>; // muscle-id → intensity (0‑1)
  anatomyLayers: {
    bones: boolean;
    muscles: boolean;
    skin: boolean;
  };
}
