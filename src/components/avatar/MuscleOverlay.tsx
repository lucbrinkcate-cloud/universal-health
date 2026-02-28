import React from 'react';
import Svg, { Path, G, Text as SvgText, Rect } from 'react-native-svg';
import { MuscleGroup, BodyView } from '../../stores/avatarStore';
import { MUSCLE_STATUS_COLORS } from '../../constants/avatarOptions';

interface MuscleOverlayProps {
  centerX?: number;
  scale?: number;
  bodyView: BodyView;
  muscleGroups: Record<string, MuscleGroup>;
  onMusclePress?: (muscleId: string) => void;
  showLabels?: boolean;
}

export const MuscleOverlay: React.FC<MuscleOverlayProps> = ({
  centerX = 110,
  scale = 1,
  bodyView,
  muscleGroups,
  onMusclePress,
  showLabels = false,
}) => {
  const getMusclePath = (muscleId: string): string => {
    const paths: Record<string, string> = {
      deltoids: `
        M ${centerX - 35 * scale} ${50 * scale}
        Q ${centerX - 45 * scale} ${55 * scale} ${centerX - 48 * scale} ${65 * scale}
        Q ${centerX - 45 * scale} ${75 * scale} ${centerX - 35 * scale} ${80 * scale}
        L ${centerX - 18 * scale} ${60 * scale}
        Q ${centerX - 28 * scale} ${50 * scale} ${centerX - 35 * scale} ${50 * scale}
        M ${centerX + 35 * scale} ${50 * scale}
        Q ${centerX + 45 * scale} ${55 * scale} ${centerX + 48 * scale} ${65 * scale}
        Q ${centerX + 45 * scale} ${75 * scale} ${centerX + 35 * scale} ${80 * scale}
        L ${centerX + 18 * scale} ${60 * scale}
        Q ${centerX + 28 * scale} ${50 * scale} ${centerX + 35 * scale} ${50 * scale}
      `,
      biceps: `
        M ${centerX - 48 * scale} ${68 * scale}
        Q ${centerX - 55 * scale} ${85 * scale} ${centerX - 50 * scale} ${100 * scale}
        L ${centerX - 42 * scale} ${100 * scale}
        Q ${centerX - 45 * scale} ${85 * scale} ${centerX - 40 * scale} ${70 * scale}
        Z
        M ${centerX + 48 * scale} ${68 * scale}
        Q ${centerX + 55 * scale} ${85 * scale} ${centerX + 50 * scale} ${100 * scale}
        L ${centerX + 42 * scale} ${100 * scale}
        Q ${centerX + 45 * scale} ${85 * scale} ${centerX + 40 * scale} ${70 * scale}
        Z
      `,
      pectorals: `
        M ${centerX - 18 * scale} ${52 * scale}
        Q ${centerX - 22 * scale} ${55 * scale} ${centerX - 22 * scale} ${70 * scale}
        Q ${centerX - 18 * scale} ${80 * scale} ${centerX - 5 * scale} ${78 * scale}
        L ${centerX - 3 * scale} ${55 * scale}
        Z
        M ${centerX + 18 * scale} ${52 * scale}
        Q ${centerX + 22 * scale} ${55 * scale} ${centerX + 22 * scale} ${70 * scale}
        Q ${centerX + 18 * scale} ${80 * scale} ${centerX + 5 * scale} ${78 * scale}
        L ${centerX + 3 * scale} ${55 * scale}
        Z
      `,
      abdominals: `
        M ${centerX - 12 * scale} ${80 * scale}
        L ${centerX + 12 * scale} ${80 * scale}
        L ${centerX + 10 * scale} ${130 * scale}
        L ${centerX - 10 * scale} ${130 * scale}
        Z
      `,
      forearms: `
        M ${centerX - 50 * scale} ${102 * scale}
        L ${centerX - 52 * scale} ${105 * scale}
        L ${centerX - 48 * scale} ${145 * scale}
        L ${centerX - 42 * scale} ${145 * scale}
        L ${centerX - 45 * scale} ${105 * scale}
        Z
        M ${centerX + 50 * scale} ${102 * scale}
        L ${centerX + 52 * scale} ${105 * scale}
        L ${centerX + 48 * scale} ${145 * scale}
        L ${centerX + 42 * scale} ${145 * scale}
        L ${centerX + 45 * scale} ${105 * scale}
        Z
      `,
      quadriceps: `
        M ${centerX - 20 * scale} ${137 * scale}
        L ${centerX - 8 * scale} ${137 * scale}
        L ${centerX - 10 * scale} ${190 * scale}
        L ${centerX - 22 * scale} ${190 * scale}
        Z
        M ${centerX + 20 * scale} ${137 * scale}
        L ${centerX + 8 * scale} ${137 * scale}
        L ${centerX + 10 * scale} ${190 * scale}
        L ${centerX + 22 * scale} ${190 * scale}
        Z
      `,
      calves_front: `
        M ${centerX - 20 * scale} ${195 * scale}
        L ${centerX - 12 * scale} ${195 * scale}
        L ${centerX - 14 * scale} ${225 * scale}
        L ${centerX - 20 * scale} ${225 * scale}
        Z
        M ${centerX + 20 * scale} ${195 * scale}
        L ${centerX + 12 * scale} ${195 * scale}
        L ${centerX + 14 * scale} ${225 * scale}
        L ${centerX + 20 * scale} ${225 * scale}
        Z
      `,
      traps: `
        M ${centerX - 15 * scale} ${30 * scale}
        Q ${centerX - 25 * scale} ${35 * scale} ${centerX - 28 * scale} ${50 * scale}
        Q ${centerX - 30 * scale} ${70 * scale} ${centerX} ${75 * scale}
        Q ${centerX + 30 * scale} ${70 * scale} ${centerX + 28 * scale} ${50 * scale}
        Q ${centerX + 25 * scale} ${35 * scale} ${centerX + 15 * scale} ${30 * scale}
        Z
      `,
      triceps: `
        M ${centerX - 48 * scale} ${68 * scale}
        Q ${centerX - 55 * scale} ${85 * scale} ${centerX - 50 * scale} ${100 * scale}
        L ${centerX - 42 * scale} ${100 * scale}
        Q ${centerX - 45 * scale} ${85 * scale} ${centerX - 40 * scale} ${70 * scale}
        Z
        M ${centerX + 48 * scale} ${68 * scale}
        Q ${centerX + 55 * scale} ${85 * scale} ${centerX + 50 * scale} ${100 * scale}
        L ${centerX + 42 * scale} ${100 * scale}
        Q ${centerX + 45 * scale} ${85 * scale} ${centerX + 40 * scale} ${70 * scale}
        Z
      `,
      lats: `
        M ${centerX - 18 * scale} ${55 * scale}
        Q ${centerX - 28 * scale} ${75 * scale} ${centerX - 25 * scale} ${105 * scale}
        L ${centerX - 5 * scale} ${100 * scale}
        L ${centerX - 5 * scale} ${55 * scale}
        Z
        M ${centerX + 18 * scale} ${55 * scale}
        Q ${centerX + 28 * scale} ${75 * scale} ${centerX + 25 * scale} ${105 * scale}
        L ${centerX + 5 * scale} ${100 * scale}
        L ${centerX + 5 * scale} ${55 * scale}
        Z
      `,
      lower_back: `
        M ${centerX - 20 * scale} ${105 * scale}
        L ${centerX + 20 * scale} ${105 * scale}
        L ${centerX + 18 * scale} ${135 * scale}
        L ${centerX - 18 * scale} ${135 * scale}
        Z
      `,
      glutes: `
        M ${centerX - 20 * scale} ${137 * scale}
        L ${centerX + 20 * scale} ${137 * scale}
        L ${centerX + 18 * scale} ${165 * scale}
        L ${centerX - 18 * scale} ${165 * scale}
        Z
      `,
      hamstrings: `
        M ${centerX - 20 * scale} ${167 * scale}
        L ${centerX - 8 * scale} ${167 * scale}
        L ${centerX - 10 * scale} ${215 * scale}
        L ${centerX - 22 * scale} ${215 * scale}
        Z
        M ${centerX + 20 * scale} ${167 * scale}
        L ${centerX + 8 * scale} ${167 * scale}
        L ${centerX + 10 * scale} ${215 * scale}
        L ${centerX + 22 * scale} ${215 * scale}
        Z
      `,
      calves_back: `
        M ${centerX - 20 * scale} ${217 * scale}
        L ${centerX - 10 * scale} ${217 * scale}
        L ${centerX - 12 * scale} ${250 * scale}
        L ${centerX - 20 * scale} ${250 * scale}
        Z
        M ${centerX + 20 * scale} ${217 * scale}
        L ${centerX + 10 * scale} ${217 * scale}
        L ${centerX + 12 * scale} ${250 * scale}
        L ${centerX + 20 * scale} ${250 * scale}
        Z
      `,
    };
    return paths[muscleId] || '';
  };

  const getMuscleCenter = (muscleId: string): { x: number; y: number } => {
    const centers: Record<string, { x: number; y: number }> = {
      deltoids: { x: centerX - 40 * scale, y: 65 * scale },
      biceps: { x: centerX - 50 * scale, y: 85 * scale },
      pectorals: { x: centerX - 12 * scale, y: 65 * scale },
      abdominals: { x: centerX, y: 105 * scale },
      forearms: { x: centerX - 48 * scale, y: 125 * scale },
      quadriceps: { x: centerX - 15 * scale, y: 165 * scale },
      calves_front: { x: centerX - 16 * scale, y: 210 * scale },
      traps: { x: centerX, y: 52 * scale },
      triceps: { x: centerX - 50 * scale, y: 85 * scale },
      lats: { x: centerX - 15 * scale, y: 80 * scale },
      lower_back: { x: centerX, y: 120 * scale },
      glutes: { x: centerX, y: 150 * scale },
      hamstrings: { x: centerX - 15 * scale, y: 190 * scale },
      calves_back: { x: centerX - 15 * scale, y: 235 * scale },
    };
    return centers[muscleId] || { x: centerX, y: 100 * scale };
  };

  const frontMuscleIds = ['deltoids', 'biceps', 'pectorals', 'abdominals', 'forearms', 'quadriceps', 'calves_front'];
  const backMuscleIds = ['traps', 'triceps', 'lats', 'lower_back', 'glutes', 'hamstrings', 'calves_back'];
  const visibleMuscleIds = bodyView === 'front' ? frontMuscleIds : backMuscleIds;

  return (
    <G>
      {visibleMuscleIds.map((muscleId) => {
        const muscle = muscleGroups[muscleId];
        if (!muscle) return null;

        const statusColor = MUSCLE_STATUS_COLORS[muscle.status];
        const isActive = muscle.status !== 'fresh';
        const center = getMuscleCenter(muscleId);

        return (
          <G key={muscleId}>
            <Path
              d={getMusclePath(muscleId)}
              fill={statusColor.fill}
              stroke={statusColor.stroke}
              strokeWidth={isActive ? 2 : 1}
              opacity={isActive ? 0.85 : 0.4}
              onPress={() => onMusclePress?.(muscleId)}
            />
            {showLabels && (
              <SvgText
                x={center.x}
                y={center.y}
                fontSize={8 * scale}
                fill="#1A1A1A"
                textAnchor="middle"
                fontWeight="600"
              >
                {muscle.name}
              </SvgText>
            )}
          </G>
        );
      })}
    </G>
  );
};

export default MuscleOverlay;
