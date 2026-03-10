import React, { useCallback } from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MuscleGroup, BodyView } from '../../stores/avatarStore';

interface MuscleBodyProps {
  gender: 'male' | 'female';
  side: BodyView;
  muscleGroups: Record<string, MuscleGroup>;
  onMusclePress?: (muscleId: string) => void;
  size?: number;
  selectedMuscle?: string | null;
}

const MUSCLE_COLORS = {
  fresh: '#B8B8B8',
  trained: '#4CAF50',
  recovering: '#FF9800',
  selected: '#2196F3',
};

const MUSCLE_STROKE_COLORS = {
  fresh: '#888888',
  trained: '#2E7D32',
  recovering: '#F57C00',
  selected: '#1565C0',
};

const SKIN_COLOR = '#E8C4B8';
const SKIN_DARK = '#D4A594';
const OUTLINE_COLOR = '#5D4037';

const MUSCLES_MALE_FRONT = `
M95,52 Q100,50 105,52 L105,65 L95,65 Z
M70,68 Q55,72 52,88 Q50,105 65,115 L78,100 Q85,85 78,72 Z
M130,68 Q145,72 148,88 Q150,105 135,115 L122,100 Q115,85 122,72 Z
M68,78 Q62,95 72,115 Q85,135 100,130 Q115,135 128,115 Q138,95 132,78 Q115,70 100,68 Q85,70 68,78 Z
M42,115 Q38,135 45,155 Q55,175 72,170 L80,145 Q85,125 75,110 Z
M158,115 Q162,135 155,155 Q145,175 128,170 L120,145 Q115,125 125,110 Z
M40,160 Q35,185 45,210 Q58,235 75,230 L82,195 Q88,170 75,155 Z
M160,160 Q165,185 155,210 Q142,235 125,230 L118,195 Q112,170 125,155 Z
M75,125 Q70,155 78,185 Q90,210 100,205 Q110,210 122,185 Q130,155 125,125 Q115,115 100,112 Q85,115 75,125 Z
M65,125 Q55,150 60,180 Q70,200 85,195 L92,165 Q95,145 82,130 Z
M135,125 Q145,150 140,180 Q130,200 115,195 L108,165 Q105,145 118,130 Z
M68,195 Q60,230 72,275 Q90,310 108,300 L112,255 Q115,220 100,200 Q85,220 88,255 Z
M132,195 Q140,230 128,275 Q110,310 92,300 L88,255 Q85,220 100,200 Q115,220 112,255 Z
M68,305 Q62,330 75,350 Q92,365 108,355 L110,330 Q112,310 100,305 Q88,310 90,330 Z
M132,305 Q138,330 125,350 Q108,365 92,355 L90,330 Q88,310 100,305 Q112,310 110,330 Z
`;

const MUSCLES_MALE_BACK = `
M95,52 Q100,50 105,52 L105,65 L95,65 Z
M72,58 Q55,68 58,90 Q65,115 85,120 Q105,125 115,105 Q125,80 128,62 Q110,52 95,52 Q80,52 72,58 Z
M128,58 Q145,68 142,90 Q135,115 115,120 Q95,125 85,105 Q75,80 72,62 Q90,52 105,52 Q120,52 128,58 Z
M70,70 Q55,80 55,100 Q58,130 80,145 L95,135 Q110,125 115,100 Q118,75 105,65 Q85,58 70,70 Z
M130,70 Q145,80 145,100 Q142,130 120,145 L105,135 Q90,125 85,100 Q82,75 95,65 Q115,58 130,70 Z
M50,105 Q45,130 55,160 Q70,190 90,185 L95,155 Q98,130 85,110 Z
M150,105 Q155,130 145,160 Q130,190 110,185 L105,155 Q102,130 115,110 Z
M45,165 Q40,195 52,230 Q70,260 90,250 L95,215 Q98,185 82,165 Z
M155,165 Q160,195 148,230 Q130,260 110,250 L105,215 Q102,185 118,165 Z
M70,190 Q60,220 75,260 Q95,290 115,275 Q125,250 118,210 Q110,185 95,180 Q80,185 70,190 Z
M130,190 Q140,220 125,260 Q105,290 85,275 Q75,250 82,210 Q90,185 105,180 Q120,185 130,190 Z
M65,270 Q55,300 70,340 Q95,375 118,355 Q132,320 125,285 Q115,260 95,255 Q75,260 65,270 Z
M135,270 Q145,300 130,340 Q105,375 82,355 Q68,320 75,285 Q85,260 105,255 Q125,260 135,270 Z
M70,345 Q62,370 80,385 Q100,395 115,380 Q128,360 118,340 Q100,330 85,340 Z
M130,345 Q138,370 120,385 Q100,395 85,380 Q72,360 82,340 Q100,330 115,340 Z
`;

const MUSCLES_FEMALE_FRONT = `
M95,48 Q100,46 105,48 L105,58 L95,58 Z
M72,62 Q58,66 55,80 Q53,95 66,105 L78,90 Q84,78 78,68 Z
M128,62 Q142,66 145,80 Q147,95 134,105 L122,90 Q116,78 122,68 Z
M70,72 Q64,88 74,105 Q86,122 100,118 Q114,122 126,105 Q136,88 130,72 Q114,66 100,64 Q86,66 70,72 Z
M50,108 Q46,125 52,145 Q62,162 76,158 L82,135 Q86,118 76,105 Z
M150,108 Q154,125 148,145 Q138,162 124,158 L118,135 Q114,118 124,105 Z
M48,150 Q44,172 52,195 Q66,218 80,212 L86,182 Q90,158 78,145 Z
M152,148 Q156,172 148,195 Q134,218 120,212 L114,182 Q110,158 122,145 Z
M78,108 Q74,135 82,160 Q94,182 100,178 Q106,182 118,160 Q126,135 122,108 Q112,100 100,98 Q88,100 78,108 Z
M72,110 Q62,132 66,158 Q76,178 88,172 L94,148 Q96,128 84,115 Z
M128,110 Q138,132 134,158 Q124,178 112,172 L106,148 Q104,128 116,115 Z
M75,175 Q68,205 78,245 Q94,275 108,265 L112,225 Q115,195 100,180 Q85,195 88,225 Z
M125,175 Q132,205 122,245 Q106,275 92,265 L88,225 Q85,195 100,180 Q115,195 112,225 Z
M75,280 Q68,302 78,322 Q94,338 108,328 L110,305 Q112,285 100,280 Q88,285 90,305 Z
M125,280 Q132,302 122,322 Q106,338 92,328 L90,305 Q88,285 100,280 Q112,285 110,305 Z
`;

const MUSCLES_FEMALE_BACK = `
M95,48 Q100,46 105,48 L105,58 L95,58 Z
M75,54 Q60,62 62,82 Q68,105 86,110 Q105,115 112,95 Q120,72 118,56 Q102,48 95,48 Q88,48 75,54 Z
M125,54 Q140,62 138,82 Q132,105 114,110 Q95,115 88,95 Q80,72 82,56 Q98,48 105,48 Q112,48 125,54 Z
M72,65 Q58,74 60,95 Q65,118 82,132 L95,122 Q108,112 112,90 Q115,68 102,58 Q88,52 72,65 Z
M128,65 Q142,74 140,95 Q135,118 118,132 L105,122 Q92,112 88,90 Q85,68 98,58 Q112,52 128,65 Z
M55,98 Q50,120 58,148 Q72,175 90,170 L95,145 Q98,122 84,102 Z
M145,98 Q150,120 142,148 Q128,175 110,170 L105,145 Q102,122 116,102 Z
M52,152 Q48,178 58,208 Q75,238 92,230 L96,198 Q98,172 82,155 Z
M148,152 Q152,178 142,208 Q125,238 108,230 L104,198 Q102,172 118,155 Z
M72,175 Q62,205 75,245 Q95,278 112,262 Q122,232 115,195 Q106,170 90,165 Q74,170 72,175 Z
M128,175 Q138,205 125,245 Q105,278 88,262 Q78,232 85,195 Q94,170 110,165 Q126,170 128,175 Z
M70,255 Q60,285 75,325 Q98,358 118,340 Q130,305 120,270 Q108,245 90,240 Q72,245 70,255 Z
M130,255 Q140,285 125,325 Q102,358 82,340 Q70,305 80,270 Q92,245 110,240 Q128,245 130,255 Z
M72,325 Q65,348 80,362 Q100,372 115,358 Q128,340 118,322 Q100,312 85,322 Z
M128,325 Q135,348 120,362 Q100,372 85,358 Q72,340 82,322 Q100,312 115,322 Z
`;

const BODY_OUTLINE_MALE_FRONT = `
  M100,5 C85,5 72,15 72,32 C72,42 80,50 100,50 C120,50 128,42 128,32 C128,15 115,5 100,5
  M100,50 L125,55 C135,58 145,75 145,95 L145,140 L148,195 L148,260 L145,330 L130,345 L110,345 L108,280 L105,220 L102,140 L100,55
  L98,140 L95,220 L92,280 L90,345 L70,345 L55,345 L52,330 L52,260 L52,195 L55,140 L55,95 C55,75 65,58 75,55 L100,50
`;

const BODY_OUTLINE_MALE_BACK = `
  M100,5 C85,5 72,15 72,32 C72,42 80,50 100,50 C120,50 128,42 128,32 C128,15 115,5 100,5
  M100,50 L125,55 C135,58 145,75 145,95 L145,140 L148,195 L148,260 L145,330 L130,345 L110,345 L108,280 L105,220 L102,140 L100,55
  L98,140 L95,220 L92,280 L90,345 L70,345 L55,345 L52,330 L52,260 L52,195 L55,140 L55,95 C55,75 65,58 75,55 L100,50
`;

const BODY_OUTLINE_FEMALE_FRONT = `
  M100,5 C85,5 74,14 74,30 C74,40 82,48 100,48 C118,48 126,40 126,30 C126,14 115,5 100,5
  M100,48 L128,52 C138,55 148,72 148,90 L148,138 L150,190 L150,255 L148,325 L132,342 L112,342 L110,280 L108,215 L105,145 L100,52
  L95,145 L92,215 L90,280 L88,342 L68,342 L52,342 L52,325 L50,255 L50,190 L52,138 L52,90 C52,72 62,55 72,52 L100,48
`;

const BODY_OUTLINE_FEMALE_BACK = `
  M100,5 C85,5 74,14 74,30 C74,40 82,48 100,48 C118,48 126,40 126,30 C126,14 115,5 100,5
  M100,48 L128,52 C138,55 148,72 148,90 L148,138 L150,190 L150,255 L148,325 L132,342 L112,342 L110,280 L108,215 L105,145 L100,52
  L95,145 L92,215 L90,280 L88,342 L68,342 L52,342 L52,325 L50,255 L50,190 L52,138 L52,90 C52,72 62,55 72,52 L100,48
`;

const MUSCLE_ID_MAP: Record<string, string> = {
  pectorals: 'pectorals',
  abdominals: 'abdominals',
  calves_front: 'calves_left',
  calves_back: 'calves_left',
  traps: 'trapezius',
  lats: 'lats_left',
  glutes: 'glutes',
  hamstrings: 'hamstrings_left',
  forearms: 'forearms_left',
  obliques: 'obliques_left',
  quadriceps: 'quadriceps_left',
  deltoids: 'deltoids_left',
  biceps: 'biceps_left',
  triceps: 'triceps_left',
  lower_back: 'lower_back',
  neck: 'neck',
};

const REVERSE_MUSCLE_MAP: Record<string, string> = {
  pectorals: 'pectorals',
  abdominals: 'abdominals',
  calves_left: 'calves_front',
  calves_right: 'calves_front',
  calves: 'calves_front',
  trapezius: 'traps',
  lats_left: 'lats',
  lats_right: 'lats',
  gluteal: 'glutes',
  hamstring: 'hamstrings',
  hamstrings_left: 'hamstrings',
  hamstrings_right: 'hamstrings',
  forearms_left: 'forearms',
  forearms_right: 'forearms',
  forearm: 'forearms',
  obliques_left: 'obliques',
  obliques_right: 'obliques',
  quadriceps_left: 'quadriceps',
  quadriceps_right: 'quadriceps',
  deltoids_left: 'deltoids',
  deltoids_right: 'deltoids',
  biceps_left: 'biceps',
  biceps_right: 'biceps',
  triceps_left: 'triceps',
  triceps_right: 'triceps',
  upper_back: 'lats',
  'lower-back': 'lower_back',
  neck: 'neck',
};

function parsePathString(pathStr: string): string[] {
  const paths: string[] = [];
  const commands = pathStr.trim().split(/\s+(?=[MLCQ])/);
  
  let currentPath = '';
  for (const cmd of commands) {
    if (cmd.startsWith('M') || cmd.startsWith('Q')) {
      if (currentPath) paths.push(currentPath.trim());
      currentPath = cmd;
    } else {
      currentPath += ' ' + cmd;
    }
  }
  if (currentPath) paths.push(currentPath.trim());
  
  return paths;
}

export const MuscleBody: React.FC<MuscleBodyProps> = ({
  gender,
  side,
  muscleGroups,
  onMusclePress,
  size = 200,
  selectedMuscle,
}) => {
  const viewBox = '0 0 200 360';

  const getBodyOutline = () => {
    if (gender === 'male') {
      return side === 'front' ? BODY_OUTLINE_MALE_FRONT : BODY_OUTLINE_MALE_BACK;
    }
    return side === 'front' ? BODY_OUTLINE_FEMALE_FRONT : BODY_OUTLINE_FEMALE_BACK;
  };

  const getMusclePaths = () => {
    let pathStr: string;
    if (gender === 'male') {
      pathStr = side === 'front' ? MUSCLES_MALE_FRONT : MUSCLES_MALE_BACK;
    } else {
      pathStr = side === 'front' ? MUSCLES_FEMALE_FRONT : MUSCLES_FEMALE_BACK;
    }
    return parsePathString(pathStr);
  };

  const musclePathList = getMusclePaths();

  const muscleNames = [
    'neck', 'deltoids_left', 'deltoids_right', 'pectorals',
    'biceps_left', 'biceps_right', 'forearms_left', 'forearms_right',
    'abdominals', 'obliques_left', 'obliques_right', 'quadriceps_left',
    'quadriceps_right', 'calves_left', 'calves_right'
  ];

  const getMuscleColors = useCallback((index: number) => {
    const sideMuscleNames = muscleNames.map(name => {
      if (name.includes('_left')) return name.replace('_left', '');
      if (name.includes('_right')) return name.replace('_right', '');
      return name;
    });

    const muscleName = sideMuscleNames[index % sideMuscleNames.length];
    const mappedId = MUSCLE_ID_MAP[muscleName] || muscleName;
    const muscle = muscleGroups[mappedId];

    if (!muscle) return { fill: MUSCLE_COLORS.fresh, stroke: MUSCLE_STROKE_COLORS.fresh };

    return {
      fill: MUSCLE_COLORS[muscle.status] || MUSCLE_COLORS.fresh,
      stroke: MUSCLE_STROKE_COLORS[muscle.status] || MUSCLE_STROKE_COLORS.fresh,
    };
  }, [muscleGroups]);

  const handleMusclePress = useCallback((index: number) => {
    const muscleId = muscleNames[index % muscleNames.length];
    const mappedId = REVERSE_MUSCLE_MAP[muscleId] || muscleId;
    onMusclePress?.(mappedId);
  }, [onMusclePress]);

  const bodyOutline = getBodyOutline();

  return (
    <View style={[styles.container, { width: size, height: size * 1.8 }]} key={`${gender}-${side}`}>
      <Svg
        width={size}
        height={size * 1.8}
        viewBox={viewBox}
      >
        <Defs>
          <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <Stop offset="0%" stopColor={SKIN_COLOR} />
            <Stop offset="100%" stopColor={SKIN_DARK} />
          </LinearGradient>
        </Defs>

        <Path
          d={bodyOutline}
          fill="url(#skinGradient)"
          stroke={OUTLINE_COLOR}
          strokeWidth={2}
        />

        {musclePathList.map((path, index) => {
          const colors = getMuscleColors(index);
          return (
            <Path
              key={index}
              d={path}
              fill={colors.fill}
              stroke={colors.stroke}
              strokeWidth={1}
              opacity={0.9}
              onPress={() => handleMusclePress(index)}
            />
          );
        })}

        <Path
          d={bodyOutline}
          fill="transparent"
          stroke={OUTLINE_COLOR}
          strokeWidth={2.5}
        />
      </Svg>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MuscleBody;
