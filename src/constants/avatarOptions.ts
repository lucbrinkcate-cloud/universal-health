import { MuscleStatus } from '../stores/avatarStore';

export const SKIN_TONES = [
  { id: 'light', color: '#FFDFC4', name: 'Light' },
  { id: 'fair', color: '#F0C8A0', name: 'Fair' },
  { id: 'medium', color: '#D4A574', name: 'Medium' },
  { id: 'olive', color: '#BA8C68', name: 'Olive' },
  { id: 'brown', color: '#8D5524', name: 'Brown' },
  { id: 'dark', color: '#5C3317', name: 'Dark' },
];

export const BODY_TYPES = [
  { id: 'slim', name: 'Slim', icon: '🧍' },
  { id: 'average', name: 'Average', icon: '🧍' },
  { id: 'athletic', name: 'Athletic', icon: '💪' },
  { id: 'curvy', name: 'Curvy', icon: '🧍' },
];

export const FACE_SHAPES = [
  { id: 'oval', name: 'Oval' },
  { id: 'round', name: 'Round' },
  { id: 'square', name: 'Square' },
  { id: 'heart', name: 'Heart' },
  { id: 'oblong', name: 'Oblong' },
];

export const HAIR_STYLES = [
  { id: 'short', name: 'Short', icon: '💇' },
  { id: 'medium', name: 'Medium', icon: '💇' },
  { id: 'long', name: 'Long', icon: '💇‍♀️' },
  { id: 'curly', name: 'Curly', icon: '👩‍🦱' },
  { id: 'wavy', name: 'Wavy', icon: '💇' },
  { id: 'spiky', name: 'Spiky', icon: '💈' },
  { id: 'ponytail', name: 'Ponytail', icon: '👧' },
  { id: 'bun', name: 'Bun', icon: '👩' },
  { id: 'afro', name: 'Afro', icon: '🧑‍🦱' },
  { id: 'bald', name: 'Bald', icon: '👨‍🦲' },
  { id: 'mohawk', name: 'Mohawk', icon: '🦔' },
  { id: 'undercut', name: 'Undercut', icon: '💇' },
];

export const HAIR_COLORS = [
  { id: 'black', color: '#1A1A1A', name: 'Black' },
  { id: 'dark_brown', color: '#2C1810', name: 'Dark Brown' },
  { id: 'brown', color: '#4A3728', name: 'Brown' },
  { id: 'light_brown', color: '#6A4E42', name: 'Light Brown' },
  { id: 'auburn', color: '#8B4513', name: 'Auburn' },
  { id: 'ginger', color: '#D2691E', name: 'Ginger' },
  { id: 'blonde', color: '#C49C48', name: 'Blonde' },
  { id: 'platinum', color: '#E6C96E', name: 'Platinum' },
  { id: 'gray', color: '#708090', name: 'Gray' },
  { id: 'white', color: '#F5F5F5', name: 'White' },
  { id: 'red', color: '#B22222', name: 'Red' },
  { id: 'pink', color: '#FF69B4', name: 'Pink' },
  { id: 'blue', color: '#4169E1', name: 'Blue' },
  { id: 'purple', color: '#8B008B', name: 'Purple' },
  { id: 'green', color: '#228B22', name: 'Green' },
];

export const FACIAL_HAIR_STYLES = [
  { id: 'none', name: 'None', icon: '😶' },
  { id: 'stubble', name: 'Stubble', icon: '😵' },
  { id: 'mustache', name: 'Mustache', icon: '🥸' },
  { id: 'goatee', name: 'Goatee', icon: '🧔' },
  { id: 'beard', name: 'Beard', icon: '🧔' },
  { id: 'full', name: 'Full Beard', icon: '🧔‍♂️' },
];

export const EYE_COLORS = [
  { id: 'brown', color: '#4A3728', name: 'Brown' },
  { id: 'dark_brown', color: '#2C1810', name: 'Dark Brown' },
  { id: 'hazel', color: '#8B6914', name: 'Hazel' },
  { id: 'green', color: '#1E5631', name: 'Green' },
  { id: 'blue', color: '#2E5A88', name: 'Blue' },
  { id: 'gray', color: '#708090', name: 'Gray' },
  { id: 'amber', color: '#FFBF00', name: 'Amber' },
];

export const EYE_SHAPES = [
  { id: 'almond', name: 'Almond' },
  { id: 'round', name: 'Round' },
  { id: 'hooded', name: 'Hooded' },
  { id: 'upturned', name: 'Upturned' },
  { id: 'downturned', name: 'Downturned' },
];

export const CLOTHING_TOPS = [
  { id: 'tshirt', name: 'T-Shirt', icon: '👕' },
  { id: 'hoodie', name: 'Hoodie', icon: '🧥' },
  { id: 'tank', name: 'Tank Top', icon: '🎽' },
  { id: 'longsleeve', name: 'Long Sleeve', icon: '👕' },
  { id: 'polo', name: 'Polo', icon: '👕' },
  { id: 'dress_shirt', name: 'Dress Shirt', icon: '👔' },
  { id: 'sweater', name: 'Sweater', icon: '🧶' },
  { id: 'crop_top', name: 'Crop Top', icon: '👚' },
];

export const CLOTHING_BOTTOMS = [
  { id: 'jeans', name: 'Jeans', icon: '👖' },
  { id: 'shorts', name: 'Shorts', icon: '🩳' },
  { id: 'sweats', name: 'Sweatpants', icon: '👖' },
  { id: 'leggings', name: 'Leggings', icon: '🩱' },
  { id: 'chinos', name: 'Chinos', icon: '👖' },
  { id: 'skirt', name: 'Skirt', icon: '👗' },
];

export const CLOTHING_OUTERWEAR = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'jacket', name: 'Jacket', icon: '🧥' },
  { id: 'coat', name: 'Coat', icon: '🧥' },
  { id: 'blazer', name: 'Blazer', icon: '🧥' },
  { id: 'vest', name: 'Vest', icon: '🦺' },
];

export const FOOTWEAR = [
  { id: 'sneakers', name: 'Sneakers', icon: '👟' },
  { id: 'boots', name: 'Boots', icon: '👢' },
  { id: 'sandals', name: 'Sandals', icon: '🩴' },
  { id: 'dress_shoes', name: 'Dress Shoes', icon: '👞' },
  { id: 'heels', name: 'Heels', icon: '👠' },
];

export const GLASSES_STYLES = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'round', name: 'Round', icon: '👓' },
  { id: 'square', name: 'Square', icon: '👓' },
  { id: 'aviator', name: 'Aviator', icon: '🕶️' },
  { id: 'sport', name: 'Sport', icon: '🥽' },
  { id: 'cat_eye', name: 'Cat Eye', icon: '👓' },
  { id: 'wayfarer', name: 'Wayfarer', icon: '🕶️' },
];

export const HAT_STYLES = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'beanie', name: 'Beanie', icon: '🧢' },
  { id: 'cap', name: 'Baseball Cap', icon: '🧢' },
  { id: 'fedora', name: 'Fedora', icon: '🎩' },
  { id: 'beret', name: 'Beret', icon: '🎨' },
  { id: 'bucket', name: 'Bucket Hat', icon: '🧢' },
];

export const EARRING_STYLES = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'stud', name: 'Stud', icon: '💎' },
  { id: 'hoop', name: 'Hoop', icon: '⭕' },
  { id: 'drop', name: 'Drop', icon: '📿' },
  { id: 'dangle', name: 'Dangle', icon: '✨' },
];

export const NECKLACE_STYLES = [
  { id: 'none', name: 'None', icon: '❌' },
  { id: 'chain', name: 'Chain', icon: '⛓️' },
  { id: 'pendant', name: 'Pendant', icon: '📿' },
  { id: 'choker', name: 'Choker', icon: '🎀' },
];

export const COMMON_COLORS = [
  { id: 'white', color: '#FFFFFF', name: 'White' },
  { id: 'black', color: '#1A1A1A', name: 'Black' },
  { id: 'gray', color: '#6B7280', name: 'Gray' },
  { id: 'navy', color: '#1E3A5F', name: 'Navy' },
  { id: 'blue', color: '#4A90D9', name: 'Blue' },
  { id: 'red', color: '#DC2626', name: 'Red' },
  { id: 'green', color: '#059669', name: 'Green' },
  { id: 'yellow', color: '#FBBF24', name: 'Yellow' },
  { id: 'orange', color: '#F97316', name: 'Orange' },
  { id: 'purple', color: '#7C3AED', name: 'Purple' },
  { id: 'pink', color: '#EC4899', name: 'Pink' },
  { id: 'brown', color: '#78350F', name: 'Brown' },
  { id: 'beige', color: '#D4B896', name: 'Beige' },
  { id: 'teal', color: '#0D9488', name: 'Teal' },
  { id: 'maroon', color: '#7F1D1D', name: 'Maroon' },
];

export interface MuscleDefinition {
  id: string;
  name: string;
  displayName: string;
  view: 'front' | 'back';
}

export const MUSCLE_GROUPS: MuscleDefinition[] = [
  { id: 'deltoids', name: 'Shoulders', displayName: 'Deltoids', view: 'front' },
  { id: 'biceps', name: 'Biceps', displayName: 'Biceps', view: 'front' },
  { id: 'pectorals', name: 'Chest', displayName: 'Pectorals', view: 'front' },
  { id: 'abdominals', name: 'Abs', displayName: 'Abdominals', view: 'front' },
  { id: 'forearms', name: 'Forearms', displayName: 'Forearms', view: 'front' },
  { id: 'quadriceps', name: 'Quads', displayName: 'Quadriceps', view: 'front' },
  { id: 'calves_front', name: 'Shins', displayName: 'Tibialis', view: 'front' },
  { id: 'traps', name: 'Upper Back', displayName: 'Trapezius', view: 'back' },
  { id: 'triceps', name: 'Triceps', displayName: 'Triceps', view: 'back' },
  { id: 'lats', name: 'Lats', displayName: 'Latissimus Dorsi', view: 'back' },
  { id: 'lower_back', name: 'Lower Back', displayName: 'Erector Spinae', view: 'back' },
  { id: 'glutes', name: 'Glutes', displayName: 'Gluteus', view: 'back' },
  { id: 'hamstrings', name: 'Hamstrings', displayName: 'Hamstrings', view: 'back' },
  { id: 'calves_back', name: 'Calves', displayName: 'Gastrocnemius', view: 'back' },
];

export const MUSCLE_STATUS_COLORS: Record<MuscleStatus, { fill: string; stroke: string; name: string }> = {
  fresh: { fill: '#E8F4F8', stroke: '#A8D5E5', name: 'Fresh' },
  trained: { fill: '#FF6B6B', stroke: '#E55555', name: 'Trained' },
  recovering: { fill: '#FFB347', stroke: '#E59A3A', name: 'Recovering' },
};

export const ANATOMY_BASE_COLOR = {
  fill: '#E8F4F8',
  stroke: '#5B9BD5',
};

export const ANATOMY_HIGHLIGHT_COLOR = {
  fill: '#FF6B6B',
  stroke: '#E55555',
};
