import React from 'react';
import Svg, { Path, G, Text as SvgText } from 'react-native-svg';
import { MuscleGroup } from '../../stores/avatarStore';

export type Gender = 'male' | 'female';
export type BodySide = 'front' | 'back';

interface AnatomyViewerProps {
  gender?: Gender;
  side: BodySide;
  muscleGroups: Record<string, MuscleGroup>;
  scale?: number;
  onMusclePress?: (muscleId: string) => void;
  showLabels?: boolean;
  width?: number;
  height?: number;
}

interface MusclePathData {
  slug: string;
  path: {
    left?: string[];
    right?: string[];
    common?: string[];
  };
  color: string;
}

const mapMuscleKey = (key: string): string => {
  const keyMap: Record<string, string> = {
    pectorals: 'chest',
    abdominals: 'abs',
    calves_front: 'calves',
    calves_back: 'calves',
    traps: 'trapezius',
    lats: 'upper-back',
  };
  return keyMap[key] || key;
};

const BODY_OUTLINE_FRONT = `
  M 90 30
  C 85 15, 115 15, 110 30
  C 112 40, 108 45, 105 50
  L 105 55
  C 75 58, 65 65, 60 90
  L 55 160
  C 53 170, 58 175, 60 170
  L 65 95
  L 70 55
  C 70 52, 100 52, 100 55
  L 100 50
  C 115 45, 118 40, 120 30
  C 115 15, 85 15, 90 30
  Z
  
  M 100 55
  L 100 90
  C 95 95, 90 130, 90 145
  L 95 200
  L 80 250
  L 75 250
  L 80 200
  L 85 150
  L 85 90
  L 100 55
  Z
  
  M 100 55
  L 100 90
  C 105 95, 110 130, 110 145
  L 105 200
  L 120 250
  L 125 250
  L 120 200
  L 115 150
  L 115 90
  L 100 55
  Z
`;

const BODY_OUTLINE_BACK = `
  M 90 30
  C 85 15, 115 15, 110 30
  C 112 40, 108 45, 105 50
  L 105 55
  C 75 58, 65 65, 60 90
  L 55 160
  C 53 170, 58 175, 60 170
  L 65 95
  L 70 55
  C 70 52, 100 52, 100 55
  L 100 50
  C 115 45, 118 40, 120 30
  C 115 15, 85 15, 90 30
  Z
  
  M 100 55
  L 100 90
  C 95 95, 90 130, 90 145
  L 95 200
  L 80 250
  L 75 250
  L 80 200
  L 85 150
  L 85 90
  L 100 55
  Z
  
  M 100 55
  L 100 90
  C 105 95, 110 130, 110 145
  L 105 200
  L 120 250
  L 125 250
  L 120 200
  L 115 150
  L 115 90
  L 100 55
  Z
`;

const MALE_FRONT_MUSCLES: MusclePathData[] = [
  {
    slug: 'neck',
    color: '#3f3f3f',
    path: {
      left: ['M 95 50 C 90 55, 88 65, 92 75 L 98 75 C 102 65, 100 55, 95 50 Z'],
      right: ['M 105 50 C 110 55, 112 65, 108 75 L 102 75 C 98 65, 100 55, 105 50 Z'],
    },
  },
  {
    slug: 'deltoids',
    color: '#3f3f3f',
    path: {
      left: ['M 75 58 C 65 60, 60 70, 60 85 C 60 95, 68 100, 75 95 C 80 90, 82 70, 75 58 Z'],
      right: ['M 125 58 C 135 60, 140 70, 140 85 C 140 95, 132 100, 125 95 C 120 90, 118 70, 125 58 Z'],
    },
  },
  {
    slug: 'pectorals',
    color: '#3f3f3f',
    path: {
      left: ['M 78 65 C 75 60, 90 58, 95 62 C 100 68, 98 85, 90 90 C 80 88, 75 80, 78 65 Z'],
      right: ['M 122 65 C 125 60, 110 58, 105 62 C 100 68, 102 85, 110 90 C 120 88, 125 80, 122 65 Z'],
    },
  },
  {
    slug: 'biceps',
    color: '#3f3f3f',
    path: {
      left: ['M 60 90 C 55 95, 55 115, 60 125 C 65 130, 72 125, 75 115 C 78 100, 70 90, 60 90 Z'],
      right: ['M 140 90 C 145 95, 145 115, 140 125 C 135 130, 128 125, 125 115 C 122 100, 130 90, 140 90 Z'],
    },
  },
  {
    slug: 'forearms',
    color: '#3f3f3f',
    path: {
      left: ['M 58 128 C 52 135, 50 155, 55 165 C 58 168, 65 165, 68 155 C 70 140, 65 130, 58 128 Z'],
      right: ['M 142 128 C 148 135, 150 155, 145 165 C 142 168, 135 165, 132 155 C 130 140, 135 130, 142 128 Z'],
    },
  },
  {
    slug: 'abdominals',
    color: '#3f3f3f',
    path: {
      left: ['M 85 90 C 83 95, 82 110, 85 125 C 90 130, 95 125, 95 110 C 95 95, 92 90, 85 90 Z'],
      right: ['M 115 90 C 117 95, 118 110, 115 125 C 110 130, 105 125, 105 110 C 105 95, 108 90, 115 90 Z'],
      common: ['M 85 95 L 115 95 L 112 110 L 88 110 Z', 'M 86 112 L 114 112 L 112 125 L 88 125 Z'],
    },
  },
  {
    slug: 'obliques',
    color: '#3f3f3f',
    path: {
      left: ['M 75 90 C 70 95, 70 110, 75 120 C 80 125, 85 120, 85 110 C 85 100, 82 90, 75 90 Z'],
      right: ['M 125 90 C 130 95, 130 110, 125 120 C 120 125, 115 120, 115 110 C 115 100, 118 90, 125 90 Z'],
    },
  },
  {
    slug: 'serratus',
    color: '#3f3f3f',
    path: {
      left: ['M 75 85 C 72 90, 70 100, 72 110 C 75 115, 80 110, 82 100 C 84 90, 80 85, 75 85 Z'],
      right: ['M 125 85 C 128 90, 130 100, 128 110 C 125 115, 120 110, 118 100 C 116 90, 120 85, 125 85 Z'],
    },
  },
  {
    slug: 'quadriceps',
    color: '#3f3f3f',
    path: {
      left: ['M 82 145 C 78 150, 75 180, 78 210 C 82 220, 92 215, 95 200 C 98 175, 95 150, 82 145 Z'],
      right: ['M 118 145 C 122 150, 125 180, 122 210 C 118 220, 108 215, 105 200 C 102 175, 105 150, 118 145 Z'],
    },
  },
  {
    slug: 'calves',
    color: '#3f3f3f',
    path: {
      left: ['M 78 215 C 72 225, 70 255, 75 275 C 80 285, 90 280, 92 265 C 95 240, 88 220, 78 215 Z'],
      right: ['M 122 215 C 128 225, 130 255, 125 275 C 120 285, 110 280, 108 265 C 105 240, 112 220, 122 215 Z'],
    },
  },
  {
    slug: 'shins',
    color: '#3f3f3f',
    path: {
      left: ['M 80 280 C 78 285, 77 295, 80 305 C 85 310, 92 305, 93 295 C 94 285, 88 280, 80 280 Z'],
      right: ['M 120 280 C 122 285, 123 295, 120 305 C 115 310, 108 305, 107 295 C 106 285, 112 280, 120 280 Z'],
    },
  },
];

const MALE_BACK_MUSCLES: MusclePathData[] = [
  {
    slug: 'trapezius',
    color: '#3f3f3f',
    path: {
      left: ['M 90 35 C 80 40, 70 50, 70 70 C 70 85, 80 90, 90 85 C 95 80, 95 50, 90 35 Z'],
      right: ['M 110 35 C 120 40, 130 50, 130 70 C 130 85, 120 90, 110 85 C 105 80, 105 50, 110 35 Z'],
    },
  },
  {
    slug: 'sternocleidomastoid',
    color: '#3f3f3f',
    path: {
      left: ['M 95 45 C 92 50, 90 60, 93 70 L 97 70 C 100 60, 98 50, 95 45 Z'],
      right: ['M 105 45 C 108 50, 110 60, 107 70 L 103 70 C 100 60, 102 50, 105 45 Z'],
    },
  },
  {
    slug: 'deltoids',
    color: '#3f3f3f',
    path: {
      left: ['M 75 58 C 65 60, 60 70, 60 85 C 60 95, 68 100, 75 95 C 80 90, 82 70, 75 58 Z'],
      right: ['M 125 58 C 135 60, 140 70, 140 85 C 140 95, 132 100, 125 95 C 120 90, 118 70, 125 58 Z'],
    },
  },
  {
    slug: 'triceps',
    color: '#3f3f3f',
    path: {
      left: ['M 60 90 C 55 98, 55 115, 60 125 C 68 130, 75 120, 75 105 C 75 95, 70 88, 60 90 Z'],
      right: ['M 140 90 C 145 98, 145 115, 140 125 C 132 130, 125 120, 125 105 C 125 95, 130 88, 140 90 Z'],
    },
  },
  {
    slug: 'upper-back',
    color: '#3f3f3f',
    path: {
      left: ['M 80 70 C 75 80, 75 100, 80 115 C 88 120, 95 110, 95 90 C 95 75, 88 65, 80 70 Z'],
      right: ['M 120 70 C 125 80, 125 100, 120 115 C 112 120, 105 110, 105 90 C 105 75, 112 65, 120 70 Z'],
    },
  },
  {
    slug: 'lats',
    color: '#3f3f3f',
    path: {
      left: ['M 75 90 C 70 100, 70 120, 78 130 C 85 135, 90 125, 88 110 C 86 95, 82 85, 75 90 Z'],
      right: ['M 125 90 C 130 100, 130 120, 122 130 C 115 135, 110 125, 112 110 C 114 95, 118 85, 125 90 Z'],
    },
  },
  {
    slug: 'lower-back',
    color: '#3f3f3f',
    path: {
      left: ['M 85 125 C 82 130, 82 145, 85 155 C 92 160, 98 150, 96 135 C 94 125, 90 120, 85 125 Z'],
      right: ['M 115 125 C 118 130, 118 145, 115 155 C 108 160, 102 150, 104 135 C 106 125, 110 120, 115 125 Z'],
    },
  },
  {
    slug: 'glutes',
    color: '#3f3f3f',
    path: {
      left: ['M 80 155 C 72 165, 72 190, 82 205 C 92 215, 102 200, 100 175 C 98 160, 90 150, 80 155 Z'],
      right: ['M 120 155 C 128 165, 128 190, 118 205 C 108 215, 98 200, 100 175 C 102 160, 110 150, 120 155 Z'],
    },
  },
  {
    slug: 'hamstrings',
    color: '#3f3f3f',
    path: {
      left: ['M 82 205 C 78 215, 78 245, 85 265 C 92 275, 102 265, 100 240 C 98 220, 92 205, 82 205 Z'],
      right: ['M 118 205 C 122 215, 122 245, 115 265 C 108 275, 98 265, 100 240 C 102 220, 108 205, 118 205 Z'],
    },
  },
  {
    slug: 'calves',
    color: '#3f3f3f',
    path: {
      left: ['M 80 270 C 72 280, 72 305, 80 320 C 90 330, 100 315, 98 290 C 96 275, 88 265, 80 270 Z'],
      right: ['M 120 270 C 128 280, 128 305, 120 320 C 110 330, 100 315, 102 290 C 104 275, 112 265, 120 270 Z'],
    },
  },
  {
    slug: 'forearms',
    color: '#3f3f3f',
    path: {
      left: ['M 58 128 C 52 135, 50 155, 55 165 C 58 168, 65 165, 68 155 C 70 140, 65 130, 58 128 Z'],
      right: ['M 142 128 C 148 135, 150 155, 145 165 C 142 168, 135 165, 132 155 C 130 140, 135 130, 142 128 Z'],
    },
  },
];

const MUSCLE_STATUS_COLORS: Record<string, { fill: string; stroke: string }> = {
  fresh: { fill: '#E8F4F8', stroke: '#5B9BD5' },
  trained: { fill: '#4CAF50', stroke: '#2E7D32' },
  recovering: { fill: '#FF9800', stroke: '#F57C00' },
};

const MUSCLE_CENTERS: Record<string, { x: number; y: number }> = {
  chest: { x: 100, y: 75 },
  biceps: { x: 67, y: 108 },
  deltoids: { x: 70, y: 75 },
  abs: { x: 100, y: 108 },
  forearms: { x: 62, y: 148 },
  quadriceps: { x: 88, y: 178 },
  calves: { x: 85, y: 250 },
  trapezius: { x: 100, y: 60 },
  obliques: { x: 80, y: 105 },
  neck: { x: 100, y: 60 },
  serratus: { x: 78, y: 98 },
  shins: { x: 87, y: 293 },
  triceps: { x: 67, y: 108 },
  'upper-back': { x: 87, y: 92 },
  lats: { x: 80, y: 110 },
  'lower-back': { x: 100, y: 140 },
  glutes: { x: 100, y: 180 },
  hamstrings: { x: 90, y: 235 },
  sternocleidomastoid: { x: 100, y: 58 },
};

export const AnatomyViewer: React.FC<AnatomyViewerProps> = ({
  gender = 'male',
  side,
  muscleGroups,
  scale = 1,
  onMusclePress,
  showLabels = false,
  width = 200,
  height = 350,
}) => {
  const muscles = side === 'front' ? MALE_FRONT_MUSCLES : MALE_BACK_MUSCLES;
  const bodyOutline = side === 'front' ? BODY_OUTLINE_FRONT : BODY_OUTLINE_BACK;
  
  const getMuscleColor = (muscleSlug: string): { fill: string; stroke: string } => {
    const mappedKey = mapMuscleKey(muscleSlug);
    const muscle = muscleGroups[mappedKey] || muscleGroups[muscleSlug];
    if (!muscle) {
      return { fill: '#E8F4F8', stroke: '#5B9BD5' };
    }
    return MUSCLE_STATUS_COLORS[muscle.status] || MUSCLE_STATUS_COLORS.fresh;
  };

  const getMuscle = (muscleSlug: string) => {
    const mappedKey = mapMuscleKey(muscleSlug);
    return muscleGroups[mappedKey] || muscleGroups[muscleSlug];
  };

  const renderMusclePaths = (muscleData: MusclePathData) => {
    const { slug, path } = muscleData;
    const colors = getMuscleColor(slug);
    const muscle = getMuscle(slug);
    const isActive = muscle && muscle.status !== 'fresh';
    
    const renderPaths = (paths: string[] | undefined) => {
      if (!paths) return null;
      return paths.map((d, index) => (
        <Path
          key={`${slug}-${index}`}
          d={d}
          fill={colors.fill}
          stroke={colors.stroke}
          strokeWidth={isActive ? 2 : 1}
          opacity={isActive ? 0.85 : 0.5}
          onPress={() => onMusclePress?.(slug)}
        />
      ));
    };

    return (
      <G key={slug}>
        {renderPaths(path.left)}
        {renderPaths(path.right)}
        {renderPaths(path.common)}
      </G>
    );
  };

  return (
    <Svg 
      width={width} 
      height={height} 
      viewBox="0 0 200 350"
    >
      <Path
        d={bodyOutline}
        fill="none"
        stroke="#CCCCCC"
        strokeWidth={1.5}
      />
      {muscles.map(renderMusclePaths)}
      {showLabels && muscles.map((muscleData) => {
        const center = MUSCLE_CENTERS[muscleData.slug];
        if (!center) return null;
        return (
          <SvgText
            key={`label-${muscleData.slug}`}
            x={center.x}
            y={center.y}
            fontSize={8}
            fill="#1A1A1A"
            textAnchor="middle"
            fontWeight="600"
          >
            {getMuscle(muscleData.slug)?.name || muscleData.slug}
          </SvgText>
        );
      })}
    </Svg>
  );
};

export default AnatomyViewer;
