import React, { useCallback } from 'react';
import { View, StyleSheet, Pressable, Text } from 'react-native';
import Svg, { Path, G, Defs, LinearGradient, Stop } from 'react-native-svg';
import { MuscleGroup, BodyView } from '../../stores/avatarStore';
import { COLORS, SPACING } from '../../constants';

interface MuscleAnatomyViewerProps {
  gender?: 'male' | 'female';
  side?: 'front' | 'back';
  muscleGroups: Record<string, MuscleGroup>;
  onMusclePress?: (muscleId: string) => void;
  size?: number;
}

interface MusclePath {
  id: string;
  path: string;
}

const FRONT_MUSCLES: MusclePath[] = [
  { id: 'pectoralals', path: 'M60,90 Q50,120 65,150 Q85,170 100,165 Q115,170 135,150 Q150,120 140,90 Q120,75 100,72 Q80,75 60,90 Z' },
  { id: 'biceps_left', path: 'M35,150 Q25,180 30,220 Q45,250 65,245 Q75,210 70,170 Q60,155 50,150 Z' },
  { id: 'biceps_right', path: 'M165,150 Q175,180 170,220 Q155,250 135,245 Q125,210 130,170 Q140,155 150,150 Z' },
  { id: 'forearms_left', path: 'M30,225 Q20,260 28,310 Q45,340 62,330 Q70,290 60,250 Q50,235 40,225 Z' },
  { id: 'forearms_right', path: 'M170,225 Q180,260 172,310 Q155,340 138,330 Q130,290 140,250 Q150,235 160,225 Z' },
  { id: 'abdominals', path: 'M75,155 Q70,190 75,230 Q85,260 100,255 Q115,260 125,230 Q130,190 125,155 Q112,145 100,143 Q88,145 75,155 Z' },
  { id: 'obliques_left', path: 'M60,155 Q50,180 55,220 Q65,245 80,235 Q85,200 75,170 Q68,158 60,155 Z' },
  { id: 'obliques_right', path: 'M140,155 Q150,180 145,220 Q135,245 120,235 Q115,200 125,170 Q132,158 140,155 Z' },
  { id: 'quadriceps_left', path: 'M70,260 Q55,310 60,380 Q75,430 100,420 Q110,370 105,300 Q95,270 85,260 Z' },
  { id: 'quadriceps_right', path: 'M130,260 Q145,310 140,380 Q125,430 100,420 Q90,370 95,300 Q105,270 115,260 Z' },
  { id: 'calves_left', path: 'M65,395 Q55,430 65,470 Q80,490 100,480 Q110,450 105,410 Q90,395 75,395 Z' },
  { id: 'calves_right', path: 'M135,395 Q145,430 135,470 Q120,490 100,480 Q90,450 95,410 Q110,395 125,395 Z' },
  { id: 'deltoids_left', path: 'M40,85 Q25,95 22,120 Q28,150 50,145 Q60,120 55,95 Q50,82 40,85 Z' },
  { id: 'deltoids_right', path: 'M160,85 Q175,95 178,120 Q172,150 150,145 Q140,120 145,95 Q150,82 160,85 Z' },
];

const BACK_MUSCLES: MusclePath[] = [
  { id: 'trapezius', path: 'M60,80 Q45,95 50,130 Q65,155 100,150 Q135,155 150,130 Q155,95 140,80 Q120,68 100,66 Q80,68 60,80 Z' },
  { id: 'deltoids_left', path: 'M40,85 Q25,95 22,120 Q28,150 50,145 Q60,120 55,95 Q50,82 40,85 Z' },
  { id: 'deltoids_right', path: 'M160,85 Q175,95 178,120 Q172,150 150,145 Q140,120 145,95 Q150,82 160,85 Z' },
  { id: 'triceps_left', path: 'M35,150 Q25,185 30,225 Q48,255 68,248 Q78,215 70,175 Q58,158 48,150 Z' },
  { id: 'triceps_right', path: 'M165,150 Q175,185 170,225 Q152,255 132,248 Q122,215 130,175 Q142,158 152,150 Z' },
  { id: 'upper_back', path: 'M65,130 Q55,160 65,200 Q85,230 100,225 Q115,230 135,200 Q145,160 135,130 Q118,115 100,113 Q82,115 65,130 Z' },
  { id: 'lats_left', path: 'M55,175 Q45,210 55,260 Q75,290 95,275 Q100,235 90,195 Q75,178 60,175 Z' },
  { id: 'lats_right', path: 'M145,175 Q155,210 145,260 Q125,290 105,275 Q100,235 110,195 Q125,178 140,175 Z' },
  { id: 'lower_back', path: 'M75,230 Q70,255 75,285 Q90,310 100,305 Q110,310 125,285 Q130,255 125,230 Q112,220 100,218 Q88,220 75,230 Z' },
  { id: 'glutes', path: 'M60,270 Q45,300 55,350 Q80,385 100,380 Q120,385 145,350 Q155,300 140,270 Q120,255 100,253 Q80,255 60,270 Z' },
  { id: 'hamstrings_left', path: 'M65,320 Q52,370 60,430 Q80,470 100,460 Q110,410 100,355 Q88,325 75,320 Z' },
  { id: 'hamstrings_right', path: 'M135,320 Q148,370 140,430 Q120,470 100,460 Q90,410 100,355 Q112,325 125,320 Z' },
  { id: 'calves_left', path: 'M65,440 Q55,470 65,505 Q82,525 100,515 Q110,485 105,450 Q90,438 75,440 Z' },
  { id: 'calves_right', path: 'M135,440 Q145,470 135,505 Q118,525 100,515 Q90,485 95,450 Q110,438 125,440 Z' },
  { id: 'forearms_left', path: 'M30,230 Q20,265 28,310 Q45,335 62,325 Q70,285 60,250 Q50,235 40,230 Z' },
  { id: 'forearms_right', path: 'M170,230 Q180,265 172,310 Q155,335 138,325 Q130,285 140,250 Q150,235 160,230 Z' },
];

const BODY_OUTLINE_FRONT = `
M100,5
C80,5 65,18 65,40
C65,55 75,65 100,65
C125,65 135,55 135,40
C135,18 120,5 100,5
M100,65 L40,80 Q25,90 25,130 L25,200 L20,280 L15,360 L25,400 L50,400 L70,340 L80,260 L90,180 L100,100 L110,180 L120,260 L130,340 L150,400 L175,400 L185,360 L180,280 L175,200 L175,130 Q175,90 160,80 L100,65
`;

const BODY_OUTLINE_BACK = `
M100,5
C80,5 65,18 65,40
C65,55 75,65 100,65
C125,65 135,55 135,40
C135,18 120,5 100,5
M100,65 L40,80 Q25,90 25,130 L25,200 L20,280 L15,360 L25,400 L50,400 L70,340 L80,260 L90,180 L100,100 L110,180 L120,260 L130,340 L150,400 L175,400 L185,360 L180,280 L175,200 L175,130 Q175,90 160,80 L100,65
`;

const MUSCLE_ID_MAP: Record<string, string> = {
  pectorals: 'pectoralals',
  pectorals_left: 'pectoralals',
  pectorals_right: 'pectoralals',
  abdominals: 'abdominals',
  obliques: 'obliques_left',
  obliques_left: 'obliques_left',
  obliques_right: 'obliques_right',
  biceps: 'biceps_left',
  biceps_left: 'biceps_left',
  biceps_right: 'biceps_right',
  triceps: 'triceps_left',
  triceps_left: 'triceps_left',
  triceps_right: 'triceps_right',
  forearms: 'forearms_left',
  forearms_left: 'forearms_left',
  forearms_right: 'forearms_right',
  quadriceps: 'quadriceps_left',
  quadriceps_left: 'quadriceps_left',
  quadriceps_right: 'quadriceps_right',
  hamstrings: 'hamstrings_left',
  hamstrings_left: 'hamstrings_left',
  hamstrings_right: 'hamstrings_right',
  calves: 'calves_left',
  calves_left: 'calves_left',
  calves_right: 'calves_right',
  glutes: 'glutes',
  deltoids: 'deltoids_left',
  deltoids_left: 'deltoids_left',
  deltoids_right: 'deltoids_right',
  trapezius: 'trapezius',
  lats: 'lats_left',
  lats_left: 'lats_left',
  lats_right: 'lats_right',
  upper_back: 'upper_back',
  lower_back: 'lower_back',
};

const SKIN_COLOR = '#E8C4B8';
const OUTLINE_COLOR = '#5D4037';

const MUSCLE_COLORS = {
  fresh: '#A0A0A0',
  trained: '#4CAF50',
  recovering: '#FF9800',
  selected: '#2196F3',
};

const MUSCLE_STROKE_COLORS = {
  fresh: '#666666',
  trained: '#2E7D32',
  recovering: '#F57C00',
  selected: '#1565C0',
};

export const MuscleAnatomyViewer: React.FC<MuscleAnatomyViewerProps> = ({
  gender,
  side,
  muscleGroups,
  onMusclePress,
  size = 280,
}) => {
  const viewBox = '0 0 200 420';

  const getMuscles = (): MusclePath[] => {
    return side === 'front' ? FRONT_MUSCLES : BACK_MUSCLES;
  };

  const getBodyOutline = (): string => {
    return side === 'front' ? BODY_OUTLINE_FRONT : BODY_OUTLINE_BACK;
  };

  const getMuscleColors = useCallback((muscleId: string) => {
    const mappedId = MUSCLE_ID_MAP[muscleId] || muscleId;
    const muscle = muscleGroups[mappedId];

    if (!muscle) {
      return { fill: MUSCLE_COLORS.fresh, stroke: MUSCLE_STROKE_COLORS.fresh };
    }

    return {
      fill: MUSCLE_COLORS[muscle.status] || MUSCLE_COLORS.fresh,
      stroke: MUSCLE_STROKE_COLORS[muscle.status] || MUSCLE_STROKE_COLORS.fresh,
    };
  }, [muscleGroups]);

  const handleMusclePress = useCallback((muscleId: string) => {
    const reverseMap: Record<string, string> = {};
    Object.entries(MUSCLE_ID_MAP).forEach(([key, value]) => {
      reverseMap[value] = key;
    });
    const originalId = reverseMap[muscleId] || muscleId;
    onMusclePress?.(originalId);
  }, [onMusclePress]);

  const muscles = getMuscles();
  const bodyOutline = getBodyOutline();

  return (
    <View style={styles.container}>
      <View style={[styles.svgContainer, { width: size, height: size * 2.1 }]}>
        <Svg
          width={size}
          height={size * 2.1}
          viewBox={viewBox}
        >
          <Defs>
            <LinearGradient id="skinGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <Stop offset="0%" stopColor={SKIN_COLOR} />
              <Stop offset="100%" stopColor="#D4A594" />
            </LinearGradient>
          </Defs>

          <Path
            d={bodyOutline}
            fill="url(#skinGradient)"
            stroke={OUTLINE_COLOR}
            strokeWidth={2}
          />

          {muscles.map((muscle) => {
            const colors = getMuscleColors(muscle.id);
            return (
              <Path
                key={muscle.id}
                d={muscle.path}
                fill={colors.fill}
                stroke={colors.stroke}
                strokeWidth={1}
                opacity={0.9}
                onPress={() => handleMusclePress(muscle.id)}
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
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  svgContainer: {
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
  },
});

export default MuscleAnatomyViewer;