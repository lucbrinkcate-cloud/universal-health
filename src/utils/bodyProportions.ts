import { ProfileData, BodyType } from '../stores/avatarStore';

export interface BodyProportions {
  height: number;
  width: number;
  headSize: number;
  headY: number;
  neckWidth: number;
  neckHeight: number;
  shoulderWidth: number;
  shoulderY: number;
  chestWidth: number;
  chestY: number;
  waistWidth: number;
  waistY: number;
  hipWidth: number;
  hipY: number;
  armLength: number;
  armWidth: number;
  legLength: number;
  legWidth: number;
  handSize: number;
  footSize: number;
  centerY: number;
  scale: number;
}

export const calculateBMI = (weight: number, heightCm: number): number => {
  const heightM = heightCm / 100;
  return weight / (heightM * heightM);
};

export const getBodyTypeFromBMI = (bmi: number): BodyType => {
  if (bmi < 18.5) return 'slim';
  if (bmi < 25) return 'average';
  if (bmi < 30) return 'athletic';
  return 'curvy';
};

export const calculateBodyProportions = (
  profileData: ProfileData,
  bodyType: BodyType,
  canvasSize: number = 300
): BodyProportions => {
  const { height, weight } = profileData;
  const bmi = calculateBMI(weight, height);
  
  const heightScale = height / 175;
  const baseScale = canvasSize / 300;
  
  const typeMultipliers: Record<BodyType, { width: number; shoulder: number; waist: number; hip: number }> = {
    slim: { width: 0.85, shoulder: 0.9, waist: 0.8, hip: 0.85 },
    average: { width: 1.0, shoulder: 1.0, waist: 1.0, hip: 1.0 },
    athletic: { width: 1.1, shoulder: 1.2, waist: 0.9, hip: 1.0 },
    curvy: { width: 1.15, shoulder: 1.0, waist: 1.1, hip: 1.2 },
  };
  
  const tm = typeMultipliers[bodyType];
  
  const baseWidth = 100 * baseScale * tm.width;
  const baseHeadSize = 45 * baseScale;
  
  const proportions: BodyProportions = {
    height: canvasSize,
    width: baseWidth,
    headSize: baseHeadSize * heightScale,
    headY: 30 * baseScale,
    neckWidth: 22 * baseScale * tm.width,
    neckHeight: 15 * baseScale,
    shoulderWidth: baseWidth * tm.shoulder,
    shoulderY: 75 * baseScale,
    chestWidth: baseWidth * 0.95 * tm.width,
    chestY: 100 * baseScale,
    waistWidth: baseWidth * 0.7 * tm.waist,
    waistY: 140 * baseScale,
    hipWidth: baseWidth * 0.85 * tm.hip,
    hipY: 165 * baseScale,
    armLength: 80 * baseScale * heightScale,
    armWidth: 18 * baseScale * tm.width,
    legLength: 100 * baseScale * heightScale,
    legWidth: 22 * baseScale * tm.width,
    handSize: 18 * baseScale,
    footSize: 25 * baseScale,
    centerY: canvasSize / 2,
    scale: baseScale,
  };
  
  return proportions;
};

export const getHeadCenter = (props: BodyProportions): { x: number; y: number } => {
  const centerX = props.width / 2 + (100 - props.width) / 2;
  return {
    x: centerX,
    y: props.headY + props.headSize / 2,
  };
};

export const getShoulderPoints = (props: BodyProportions): { left: { x: number; y: number }; right: { x: number; y: number } } => {
  const centerX = props.width / 2 + (100 - props.width) / 2;
  const halfShoulder = props.shoulderWidth / 2;
  return {
    left: { x: centerX - halfShoulder, y: props.shoulderY },
    right: { x: centerX + halfShoulder, y: props.shoulderY },
  };
};

export const getHeightCategory = (heightCm: number): 'short' | 'average' | 'tall' => {
  if (heightCm < 165) return 'short';
  if (heightCm < 185) return 'average';
  return 'tall';
};

export const getWeightCategory = (bmi: number): 'underweight' | 'normal' | 'overweight' | 'obese' => {
  if (bmi < 18.5) return 'underweight';
  if (bmi < 25) return 'normal';
  if (bmi < 30) return 'overweight';
  return 'obese';
};
